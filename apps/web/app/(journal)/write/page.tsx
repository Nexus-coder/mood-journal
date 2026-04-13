"use client";

import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { WritingCanvas } from "../_components/writing-canvas";
import { SentimentIndicator } from "../_components/sentiment-indicator";
import { useMutation, useQuery } from "convex/react";
import { api } from "@mood-journal/convex/_generated/api";
import { useRouter, useSearchParams } from "next/navigation";

function JournalContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prompt = searchParams.get("prompt");
  const initialId = searchParams.get("id");

  const [entryId, setEntryId] = useState<string | null>(initialId);
  const [title, setTitle] = useState("Morning Reflections");
  const [body, setBody] = useState("");
  const [mood, setMood] = useState<"positive" | "neutral" | "anxious">("positive");
  const [wordCount, setWordCount] = useState(0);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  // Track whether the user has made changes (prevents save-on-load)
  const isDirtyRef = useRef(false);
  // Track the last saved snapshot to avoid redundant saves
  const lastSavedRef = useRef({ title: "", body: "", mood: "" });
  // Stable ref for the mutation so it never causes the debounce to reset
  const updateEntryRef = useRef<typeof updateEntry | null>(null);
  // Debounce timer ref
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const createEntry = useMutation(api.entries.create);
  const updateEntry = useMutation(api.entries.update);
  const existingEntry = useQuery(
    api.entries.get,
    entryId ? { entryId: entryId as any } : "skip"
  );

  // Keep the mutation ref up to date without triggering re-renders
  updateEntryRef.current = updateEntry;

  // --- 1. Load existing entry (only once, on first successful fetch) ---
  const hasLoadedEntry = useRef(false);
  useEffect(() => {
    if (existingEntry && !hasLoadedEntry.current) {
      hasLoadedEntry.current = true;
      setTitle(existingEntry.title);
      setBody(existingEntry.body);
      setMood(existingEntry.mood);
      // Treat the loaded data as the "last saved" baseline so we don't re-save immediately
      lastSavedRef.current = {
        title: existingEntry.title,
        body: existingEntry.body,
        mood: existingEntry.mood,
      };
    }
  }, [existingEntry]);

  // --- 2. Initial entry creation for new entries ---
  const isCreatingRef = useRef(false);
  useEffect(() => {
    if (entryId || isCreatingRef.current) return;
    isCreatingRef.current = true;

    const init = async () => {
      try {
        const initialBody = prompt
          ? JSON.stringify({
              type: "doc",
              content: [
                {
                  type: "blockquote",
                  content: [{ type: "text", text: prompt }],
                },
                { type: "paragraph", content: [] },
              ],
            })
          : "";

        const id = await createEntry({
          title,
          body: initialBody,
          mood,
        });

        setEntryId(id);
        if (prompt) {
          setBody(initialBody);
        }

        // Seed last-saved baseline so the new entry doesn't immediately re-save
        lastSavedRef.current = { title, body: initialBody, mood };

        const newParams = new URLSearchParams(searchParams.toString());
        newParams.set("id", id);
        router.replace(`/write?${newParams.toString()}`);
      } catch (error) {
        console.error("Failed to create initial entry:", error);
        setSaveStatus("error");
        isCreatingRef.current = false; // allow retry
      }
    };

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // --- 3. Stable save function using refs ---
  const performSave = useCallback(async (id: string, t: string, b: string, m: string) => {
    if (!updateEntryRef.current) return;
    setSaveStatus("saving");
    try {
      await updateEntryRef.current({
        entryId: id as any,
        title: t,
        body: b,
        mood: m as any,
      });
      lastSavedRef.current = { title: t, body: b, mood: m };
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch (error) {
      console.error("Autosave failed:", error);
      setSaveStatus("error");
    }
  }, []);

  // --- 4. Autosave: only when dirty and content actually changed ---
  useEffect(() => {
    if (!entryId || !isDirtyRef.current) return;

    const { title: savedTitle, body: savedBody, mood: savedMood } = lastSavedRef.current;
    if (title === savedTitle && body === savedBody && mood === savedMood) return;

    // Clear existing debounce
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    debounceTimerRef.current = setTimeout(() => {
      performSave(entryId, title, body, mood);
    }, 2000);

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [title, body, mood, entryId, performSave]);

  // --- 5. LocalStorage backup (only when dirty) ---
  useEffect(() => {
    if (isDirtyRef.current && body) {
      localStorage.setItem(
        "journal_draft",
        JSON.stringify({ title, body, mood, entryId })
      );
    }
  }, [title, body, mood, entryId]);

  // Setters that also flip the dirty flag
  const handleSetTitle = useCallback((v: string) => {
    isDirtyRef.current = true;
    setTitle(v);
  }, []);

  const handleSetBody = useCallback((v: string) => {
    isDirtyRef.current = true;
    setBody(v);
  }, []);

  const handleSetMood = useCallback((v: "positive" | "neutral" | "anxious") => {
    isDirtyRef.current = true;
    setMood(v);
  }, []);

  // --- 6. Manual save ("Done" button) ---
  const handleSave = async () => {
    // Flush any pending debounce
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    setSaveStatus("saving");
    try {
      if (entryId) {
        await updateEntry({
          entryId: entryId as any,
          title,
          body,
          mood,
        });
      }
      localStorage.removeItem("journal_draft");
      router.push("/dashboard");
    } catch (error) {
      console.error("Final save failed:", error);
      setSaveStatus("error");
    }
  };

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden">
      <WritingCanvas
        title={title}
        setTitle={handleSetTitle}
        body={body}
        setBody={handleSetBody}
        onSave={handleSave}
        wordCount={wordCount}
        setWordCount={setWordCount}
        saveStatus={saveStatus}
      />
      <SentimentIndicator mood={mood} setMood={handleSetMood} />
    </div>
  );
}

export default function JournalPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center bg-background">
          <div className="animate-pulse text-muted-foreground text-xs uppercase tracking-widest">
            Waking up the page...
          </div>
        </div>
      }
    >
      <JournalContent />
    </Suspense>
  );
}

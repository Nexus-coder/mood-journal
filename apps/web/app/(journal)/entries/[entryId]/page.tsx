"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useState, useRef, useCallback, Suspense } from "react";
import { useMutation, useQuery } from "convex/react";
import { useParams, useRouter } from "next/navigation";

import { api } from "@mood-journal/convex/_generated/api";
import { Id } from "@mood-journal/convex/_generated/dataModel";

import { WritingCanvas } from "../../_components/writing-canvas";
import { SentimentIndicator } from "../../_components/sentiment-indicator";

import { getPlainText } from "@/lib/tiptap-utils";

// ---------------------------------------------------------------------------
// Draft shape stored in localStorage
// ---------------------------------------------------------------------------
interface LocalDraft {
  title: string;
  body: string;
  mood: string;
  entryId: string | null;
  timestamp: number;
}

const DRAFT_KEY = "journal_draft";
const DEBOUNCE_MS = 2_000;
const SAVED_INDICATOR_MS = 3_000;
// Drafts older than 24 h are stale and should be discarded
const MAX_DRAFT_AGE_MS = 24 * 60 * 60 * 1_000;

function EntryContent() {
  const params = useParams();
  const entryId = params?.entryId as string;
  const router = useRouter();

  const entry = useQuery(
    api.entries.get,
    entryId ? { entryId: entryId as Id<"entries"> } : "skip"
  );
  const updateEntry = useMutation(api.entries.update);
  const deleteEntry = useMutation(api.entries.remove);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [mood, setMood] = useState<"positive" | "neutral" | "anxious">("neutral");
  const [wordCount, setWordCount] = useState(0);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error" | "unsaved">("idle");

  // Track whether the user has made changes (prevents save-on-load)
  const isDirtyRef = useRef(false);
  // Track the last saved snapshot to avoid redundant saves
  const lastSavedRef = useRef({ title: "", body: "", mood: "" });
  // Stable ref for the mutation so it never causes the debounce to reset
  const updateEntryRef = useRef<typeof updateEntry | null>(null);
  // Debounce timer ref
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Overlap guard — true while a save is in flight
  const isSavingRef = useRef(false);
  // Queued save — set when a save is requested while another is in flight
  const pendingSaveRef = useRef<{ t: string; b: string; m: string } | null>(null);

  // Keep the mutation ref up to date without triggering re-renders
  updateEntryRef.current = updateEntry;

  // -----------------------------------------------------------------------
  // 1. Load existing entry (only once, on first successful fetch)
  // -----------------------------------------------------------------------
  const hasLoadedEntry = useRef(false);
  useEffect(() => {
    if (entry && !hasLoadedEntry.current) {
      hasLoadedEntry.current = true;
      setTitle(entry.title);
      setBody(entry.body);
      setMood(entry.mood);
      setWordCount(getPlainText(entry.body).split(/\s+/).filter(Boolean).length);
      // Treat the loaded data as the "last saved" baseline
      lastSavedRef.current = {
        title: entry.title,
        body: entry.body,
        mood: entry.mood,
      };
    }
  }, [entry]);

  // -----------------------------------------------------------------------
  // 2. Recover orphan draft from localStorage
  // -----------------------------------------------------------------------
  const hasCheckedDraft = useRef(false);
  useEffect(() => {
    if (hasCheckedDraft.current) return;
    hasCheckedDraft.current = true;

    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const draft: LocalDraft = JSON.parse(raw);

      // Only recover if the draft belongs to this entry
      if (draft.entryId !== entryId) return;

      // Discard stale drafts
      if (Date.now() - draft.timestamp > MAX_DRAFT_AGE_MS) {
        localStorage.removeItem(DRAFT_KEY);
        return;
      }

      // Only recover if there's meaningful content
      if (draft.body && draft.body.length > 2) {
        setTitle(draft.title);
        setBody(draft.body);
        setMood(draft.mood as any);
        isDirtyRef.current = true;
        setSaveStatus("unsaved");
      }
    } catch {
      localStorage.removeItem(DRAFT_KEY);
    }
  }, [entryId]);

  // -----------------------------------------------------------------------
  // 3. Stable save function with overlap guard
  // -----------------------------------------------------------------------
  const performSave = useCallback(
    async (
      id: string,
      t: string,
      b: string,
      m: string,
      options: { skipSentiment?: boolean } = {}
    ) => {
      if (!updateEntryRef.current) return;

      // If a save is already in flight, queue this one
      if (isSavingRef.current) {
        pendingSaveRef.current = { t, b, m };
        return;
      }

      isSavingRef.current = true;
      setSaveStatus("saving");

      try {
        await updateEntryRef.current({
          entryId: id as Id<"entries">,
          title: t,
          body: b,
          mood: m as any,
          skipSentiment: options.skipSentiment ?? true,
        });
        lastSavedRef.current = { title: t, body: b, mood: m };
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), SAVED_INDICATOR_MS);
      } catch (error) {
        console.error("Autosave failed:", error);
        setSaveStatus("error");
      } finally {
        isSavingRef.current = false;

        // Flush queued save if one was enqueued while we were saving
        const pending = pendingSaveRef.current;
        if (pending) {
          pendingSaveRef.current = null;
          performSave(id, pending.t, pending.b, pending.m, options);
        }
      }
    },
    []
  );

  // -----------------------------------------------------------------------
  // 4. Debounced autosave — only when dirty and content actually changed
  // -----------------------------------------------------------------------
  useEffect(() => {
    if (!entryId || !isDirtyRef.current) return;

    const { title: savedTitle, body: savedBody, mood: savedMood } = lastSavedRef.current;
    if (title === savedTitle && body === savedBody && mood === savedMood) {
      // Content matches last save — clear any "unsaved" indicator
      if (saveStatus === "unsaved") setSaveStatus("idle");
      return;
    }

    // Show unsaved indicator immediately
    if (saveStatus === "idle") setSaveStatus("unsaved");

    // Clear existing debounce
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    debounceTimerRef.current = setTimeout(() => {
      performSave(entryId, title, body, mood, { skipSentiment: true });
    }, DEBOUNCE_MS);

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [title, body, mood, entryId, performSave, saveStatus]);

  // -----------------------------------------------------------------------
  // 5. LocalStorage backup (only when dirty)
  // -----------------------------------------------------------------------
  useEffect(() => {
    if (isDirtyRef.current && body) {
      const draft: LocalDraft = {
        title,
        body,
        mood,
        entryId,
        timestamp: Date.now(),
      };
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    }
  }, [title, body, mood, entryId]);

  // -----------------------------------------------------------------------
  // 6. Save-before-unload and save-on-visibility-change
  // -----------------------------------------------------------------------
  useEffect(() => {
    const flushSave = () => {
      if (!entryId || !isDirtyRef.current) return;
      const { title: st, body: sb, mood: sm } = lastSavedRef.current;
      if (title === st && body === sb && mood === sm) return;

      // Cancel debounce — we're flushing now
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }

      // Fire and forget — this is best-effort on tab close
      performSave(entryId, title, body, mood, { skipSentiment: true });
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const { title: st, body: sb, mood: sm } = lastSavedRef.current;
      const hasUnsaved =
        isDirtyRef.current && (title !== st || body !== sb || mood !== sm);

      if (hasUnsaved) {
        flushSave();
        // Show the browser's "unsaved changes" prompt
        e.preventDefault();
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        flushSave();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [entryId, title, body, mood, performSave]);

  // -----------------------------------------------------------------------
  // Setters that flip the dirty flag
  // -----------------------------------------------------------------------
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

  // -----------------------------------------------------------------------
  // 7. Manual save ("Done" button) — triggers sentiment analysis
  // -----------------------------------------------------------------------
  const handleSave = async () => {
    // Flush any pending debounce
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    setSaveStatus("saving");
    try {
      await updateEntry({
        entryId: entryId as Id<"entries">,
        title,
        body,
        mood,
        // Explicit manual save — DO run sentiment analysis
        skipSentiment: false,
      });
      lastSavedRef.current = { title, body, mood };
      localStorage.removeItem(DRAFT_KEY);
      router.push("/dashboard");
    } catch (error) {
      console.error("Final save failed:", error);
      setSaveStatus("error");
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this entry?")) {
      try {
        await deleteEntry({ entryId: entryId as Id<"entries"> });
        router.push("/dashboard");
      } catch (error) {
        console.error("Failed to delete entry:", error);
      }
    }
  };

  if (entry === undefined) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground/30" />
      </div>
    );
  }

  if (entry === null) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-background gap-4">
        <p className="text-muted-foreground">Entry not found.</p>
        <button
          onClick={() => router.push("/dashboard")}
          className="text-sm text-foreground font-medium underline underline-offset-4"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden bg-background">
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

      {/* Danger Zone / Delete Button */}
      <div className="absolute bottom-6 right-6">
        <button
          onClick={handleDelete}
          className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground/40 hover:text-red-400 transition-colors py-2 px-4 rounded-full border border-border/40 hover:border-red-400/20 bg-background/50 backdrop-blur-sm"
        >
          Delete Entry
        </button>
      </div>
    </div>
  );
}

export default function EditEntryPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center bg-background">
          <div className="animate-pulse text-muted-foreground text-xs uppercase tracking-widest">
            Waking up the entry...
          </div>
        </div>
      }
    >
      <EntryContent />
    </Suspense>
  );
}

"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@mood-journal/convex/_generated/api";
import { useParams, useRouter } from "next/navigation";
import { WritingCanvas } from "../../_components/writing-canvas";
import { SentimentIndicator } from "../../_components/sentiment-indicator";
import { useEffect, useState } from "react";
import { Id } from "@mood-journal/convex/_generated/dataModel";
import { Loader2 } from "lucide-react";
import { getPlainText } from "@/lib/tiptap-utils";

export default function EditEntryPage() {
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
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (entry && !isInitialized) {
      setTitle(entry.title);
      setBody(entry.body);
      setMood(entry.mood);
      setWordCount(getPlainText(entry.body).split(/\s+/).filter(Boolean).length);
      setIsInitialized(true);
    }
  }, [entry, isInitialized]);


  const handleSave = async () => {
    try {
      await updateEntry({
        entryId: entryId as Id<"entries">,
        title,
        body,
        mood,
      });
      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to update entry:", error);
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
        setTitle={setTitle} 
        body={body} 
        setBody={setBody} 
        onSave={handleSave}
        wordCount={wordCount}
        setWordCount={setWordCount}
      />
      <SentimentIndicator mood={mood} setMood={setMood} />
      
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

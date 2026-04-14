"use client";

import { useQuery } from "convex/react";

import { EntryCard } from "./entry-card";
import { getPlainText } from "@/lib/tiptap-utils";

import { api } from "@mood-journal/convex/_generated/api";

export function EntryList() {
  const entries = useQuery(api.entries.list);

  if (entries === undefined) {
    return (
      <div className="px-6 sm:px-12 pb-20 flex flex-col gap-4 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-muted rounded-2xl w-full" />
        ))}
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="px-6 sm:px-12 pb-20 flex flex-col items-center justify-center min-h-[40vh] text-center">
        <p className="text-muted-foreground mb-4">No entries found.</p>
        <p className="text-sm text-muted-foreground/60">Your journal is waiting for your first reflection.</p>
      </div>
    );
  }

  return (
    <div className="px-6 sm:px-12 pb-20 flex flex-col gap-4">
      {entries.map((entry: any) => (
        <EntryCard
          key={entry._id}
          id={entry._id}
          date={new Date(entry._creationTime).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric"
          })}
          time={new Date(entry._creationTime).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit"
          })}
          mood={entry.mood}
          title={entry.title}
          contentSnippet={getPlainText(entry.body).slice(0, 160) + (getPlainText(entry.body).length > 160 ? "..." : "")}
          tags={[]}
        />
      ))}
    </div>
  );
}


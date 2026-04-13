"use client";

import { useQuery } from "convex/react";
import { api } from "@mood-journal/convex/_generated/api";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

export function FrequentTopics() {
  const tags = useQuery(api.tags.list);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="size-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-widest">
          Frequent Topics
        </h3>
      </div>

      <div className="flex-1 flex flex-col gap-6">
        <div className="flex flex-wrap gap-2">
          {tags?.map((tag) => (
            <Badge
              key={tag}
              className="bg-muted hover:bg-muted/80 text-foreground border-border px-3 py-1 rounded-lg text-xs font-medium cursor-default transition-colors"
            >
              {tag}
            </Badge>
          ))}
          {(!tags || tags.length === 0) && (
            <span className="text-xs text-muted-foreground">No topics yet. Start writing to see your frequent topics.</span>
          )}
        </div>

        <Separator className="bg-border/50" />

        <div className="space-y-4 flex-1">
          <p className="text-xs leading-relaxed text-muted-foreground italic">
            {tags && tags.length > 0
              ? (
                <>
                  Your entries frequently discuss <span className="text-foreground font-medium underline underline-offset-4 decoration-primary/30">{tags[0]}</span>{tags.length > 1 && <> and <span className="text-foreground font-medium underline underline-offset-4 decoration-primary/30">{tags[1]}</span></>}.
                </>
              )
              : "Write your first entry to see insights about your frequent topics."}
          </p>
        </div>
      </div>
    </div>
  );
}

"use client";

import { Button } from "@/components/ui/button";

export function TrendsHeader() {
  return (
    <div className="px-6 py-8 sm:px-12 sm:pt-16 sm:pb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
      <div>
        <h1 className="text-3xl font-medium tracking-tight text-foreground mb-2">
          Sentiment Trends
        </h1>
        <p className="text-sm text-muted-foreground">
          Visualizing your emotional journey over the last 30 days.
        </p>
      </div>

      <div className="flex bg-muted p-1 rounded-xl shrink-0 border border-border/40">
        <Button variant="ghost" className="h-8 px-4 text-xs font-semibold bg-background text-foreground rounded-lg shadow-sm border border-border/20">
          30 Days
        </Button>
        <Button variant="ghost" className="h-8 px-4 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-transparent">
          90 Days
        </Button>
      </div>
    </div>
  );
}

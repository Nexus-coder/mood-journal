"use client";

import { useQuery } from "convex/react";
import { api } from "@mood-journal/convex/_generated/api";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function MoodChart() {
  const stats = useQuery(api.entries.getWeeklyStats);

  if (stats === undefined) {
    return (
      <div className="p-6 border-b border-border">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-6">Mood Trends</h2>
        <div className="flex items-end gap-2 h-20 w-full px-1">
          {[...Array(7)].map((_, i) => (
            <Skeleton key={i} className="h-4 flex-1 rounded-t-sm" />
          ))}
        </div>
      </div>
    );
  }

  if (!stats || stats.length === 0) return null;

  const maxCount = Math.max(...stats.map(s => s.count), 1);

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case "positive": return "bg-emerald-400 dark:bg-emerald-500/50";
      case "anxious": return "bg-amber-400 dark:bg-amber-500/50";
      default: return "bg-blue-400 dark:bg-blue-500/30";
    }
  };

  return (
    <div className="p-6 border-b border-border bg-background/50">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest pl-1">Mood Trends</h2>
        <div className="flex gap-1.5 px-1">
          <div className="size-1.5 rounded-full bg-emerald-400" />
          <div className="size-1.5 rounded-full bg-blue-400" />
          <div className="size-1.5 rounded-full bg-amber-400" />
        </div>
      </div>

      <div className="flex items-end gap-2 h-20 w-full px-1">
        {stats.map((day, idx) => {
          // Increase the scale significantly
          const heightPercent = day.count === 0 ? 15 : Math.max((day.count / maxCount) * 100, 30);
          
          return (
            <div
              key={idx}
              className={cn(
                getMoodColor(day.dominantMood),
                "rounded-t-sm flex-1 transition-all duration-500 ease-out border-b border-white/10 dark:border-black/10"
              )}
              style={{ height: `${heightPercent}%` }}
              title={`${day.dayName}: ${day.count} entries`}
            />
          );
        })}
      </div>
      
      <div className="flex justify-between text-[10px] uppercase font-bold text-muted-foreground mt-4 px-1 opacity-70">
        <span>{stats[0]?.dayName}</span>
        <span>{stats[stats.length - 1]?.dayName}</span>
      </div>
    </div>
  );
}

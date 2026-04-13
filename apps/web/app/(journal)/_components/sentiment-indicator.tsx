"use client";

import { cn } from "@/lib/utils";

interface SentimentIndicatorProps {
  mood: "positive" | "neutral" | "anxious";
  setMood: (mood: "positive" | "neutral" | "anxious") => void;
}

export function SentimentIndicator({ mood, setMood }: SentimentIndicatorProps) {
  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-background/90 backdrop-blur border border-border shadow-md px-4 py-2 rounded-full z-20">
      <div className="relative flex h-3 w-3">
        <span className={cn(
          "animate-ping absolute inline-flex h-full w-full rounded-full opacity-20",
          mood === "positive" ? "bg-emerald-400" : mood === "neutral" ? "bg-blue-400" : "bg-amber-400"
        )}></span>
        <span className={cn(
          "relative inline-flex rounded-full h-3 w-3",
          mood === "positive" ? "bg-emerald-400" : mood === "neutral" ? "bg-blue-400" : "bg-amber-400"
        )}></span>
      </div>
      <span className="text-xs font-semibold text-muted-foreground capitalize tracking-tight">
        Current mood leaning {mood}
      </span>
      <div className="h-4 w-[1px] bg-border mx-1"></div>
      <div className="flex gap-1 items-center">
        <button 
          onClick={() => setMood("anxious")}
          className={cn(
            "text-lg cursor-pointer transition-all",
            mood === "anxious" ? "scale-110 drop-shadow-sm" : "grayscale opacity-50 hover:grayscale-0 hover:opacity-100"
          )}
        >
          😔
        </button>
        <button 
          onClick={() => setMood("neutral")}
          className={cn(
            "text-lg cursor-pointer transition-all",
            mood === "neutral" ? "scale-110 drop-shadow-sm" : "grayscale opacity-50 hover:grayscale-0 hover:opacity-100"
          )}
        >
          😐
        </button>
        <button 
          onClick={() => setMood("positive")}
          className={cn(
            "text-lg cursor-pointer transition-all",
            mood === "positive" ? "scale-110 drop-shadow-sm" : "grayscale opacity-50 hover:grayscale-0 hover:opacity-100"
          )}
        >
          😊
        </button>
      </div>
    </div>
  );
}

"use client";

import { Lightbulb, SquarePen, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

export function FloatingMockups() {
  return (
    <div className="hidden sm:flex w-full lg:w-[55%] h-full items-center justify-center relative perspective-[1000px] mt-10 lg:mt-0">
      
      {/* Container for scaling on different screen sizes */}
      <div className="relative w-full max-w-[500px] aspect-square scale-90 lg:scale-100 xl:scale-110 transition-transform duration-700 animate-fade-up-delay-2">
        
        {/* Background decorative element behind cards */}
        <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-emerald-100/30 dark:from-emerald-500/10 via-white/0 to-blue-100/30 dark:to-blue-500/10 blur-2xl"></div>

        {/* Card 1: Daily Prompt (Center/Front) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100%] max-w-[400px] glass-panel rounded-3xl p-7 z-30 animate-float">
          <div className="flex items-center gap-2 mb-6">
            <div className="size-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <Lightbulb className="text-primary size-5" />
            </div>
            <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.15em]">Daily Prompt</h3>
          </div>
          <h2 className="text-xl font-medium tracking-tight text-foreground leading-snug mb-8">What is a minor detail you noticed today that brought you a sense of calm?</h2>
          <div className="flex items-center gap-3 w-full bg-background/60 border border-border/50 rounded-2xl px-4 py-4 shadow-sm transition-all hover:bg-background hover:border-border cursor-text group/prompt">
            <SquarePen className="text-muted-foreground size-5 shrink-0 group-hover/prompt:text-foreground transition-colors" />
            <div className="text-sm text-muted-foreground font-medium select-none">Start reflecting...</div>
          </div>
        </div>

        {/* Card 2: Sentiment Balance (Top Right/Back) */}
        <div className="absolute top-[0%] right-[-8%] w-[240px] glass-panel rounded-3xl p-6 z-20 animate-float-slow rotate-[6deg]">
          <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.15em] mb-4">Analytics</h3>
          <div className="flex items-end gap-3 mb-6">
            <h2 className="text-3xl font-medium tracking-tight text-foreground leading-none">72%</h2>
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full mb-0.5">
              +14%
            </span>
          </div>
          <div className="space-y-3">
            <SentimentMiniBar label="Pos" value={72} color="bg-emerald-400" />
            <SentimentMiniBar label="Neu" value={20} color="bg-primary/20" />
            <SentimentMiniBar label="Anx" value={8} color="bg-amber-400" />
          </div>
        </div>

        {/* Card 3: Emerging Themes (Bottom Left/Middle) */}
        <div className="absolute bottom-[5%] left-[-8%] w-[260px] glass-panel rounded-3xl p-6 z-40 animate-float-fast rotate-[-3deg]">
          <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.15em] mb-5">Themes</h3>
          <div className="flex flex-wrap gap-2 mb-6">
            <BadgeMinimal label="Productivity" color="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" />
            <BadgeMinimal label="Reading" color="bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300" />
            <BadgeMinimal label="Focus" color="bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300" />
          </div>
          <div className="pt-4 border-t border-border flex items-start gap-2.5">
            <TrendingUp className="text-emerald-500 size-4 mt-0.5 shrink-0" />
            <p className="text-[11px] text-muted-foreground leading-relaxed font-medium">
              Significant <span className="text-foreground">positive</span> climb today.
            </p>
          </div>
        </div>

        {/* Subtle connection line */}
        <svg className="absolute inset-0 size-full z-10 opacity-20 pointer-events-none" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 350 C 200 350, 300 200, 400 150" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" className="text-foreground"></path>
        </svg>
      </div>
    </div>
  );
}

function SentimentMiniBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-[10px] font-semibold text-muted-foreground w-8 uppercase tracking-wider">{label}</span>
      <div className="flex-1 h-1.5 bg-muted/50 rounded-full overflow-hidden">
        <div 
          className={color + " h-full rounded-full transition-all duration-700"} 
          style={{ width: `${value}%` }} 
        />
      </div>
    </div>
  );
}

function BadgeMinimal({ label, color }: { label: string; color: string }) {
  return (
    <span className={cn("px-2.5 py-1.5 rounded-xl text-[10px] font-bold border border-border/50 shadow-sm transition-all hover:scale-105 cursor-default flex items-center justify-center", color)}>
      {label}
    </span>
  );
}

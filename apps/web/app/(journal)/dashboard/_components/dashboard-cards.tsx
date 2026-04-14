"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { Lightbulb, ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { api } from "@mood-journal/convex/_generated/api";

export function DashboardCards() {
  const summary = useQuery(api.sentiment.getSummary);
  const dailyPrompt = useQuery(api.prompts.getDaily);

  const positive = summary ? Math.round(summary.positive * 100) : 0;
  const neutral = summary ? Math.round(summary.neutral * 100) : 0;
  const anxious = summary ? Math.round(summary.anxious * 100) : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Daily Prompt Card */}
      <Link href={dailyPrompt ? `/write?prompt=${encodeURIComponent(dailyPrompt.text)}` : "/write"} className="block group">
        <div className="border border-border rounded-3xl p-6 bg-background h-full flex flex-col justify-between hover:border-primary/50 hover:shadow-2xl transition-all duration-500 relative overflow-hidden active:scale-[0.98]">
          <div className="absolute -right-8 -top-8 size-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-500" />

          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-primary/10 rounded-lg text-primary">
                <Lightbulb size={16} />
              </div>
              <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Prompt of the day
              </h3>
            </div>
            <h2 className="text-xl font-medium tracking-tight text-foreground leading-snug mb-4 relative z-10 transition-colors group-hover:text-primary">
              {dailyPrompt?.text || "What's on your mind today?"}
            </h2>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground group-hover:text-primary transition-colors relative z-10 font-medium">
            <span>Write about this</span>
            <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Link>

      {/* Weekly Sentiment Insight */}
      <div className="border border-border rounded-3xl p-6 bg-background flex flex-col justify-between shadow-sm">
        <div className="mb-6">
          <h3 className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-4">
            Sentiment Balance
          </h3>
          <div className="flex items-end gap-3">
            <h2 className="text-3xl font-medium tracking-tight text-foreground">{positive}%</h2>
            {summary && (
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-md mb-1">
                Positive Average
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <SentimentBar label="Positive" percentage={positive} color="bg-emerald-500" trackColor="bg-emerald-100 dark:bg-emerald-500/10" />
          <SentimentBar label="Neutral" percentage={neutral} color="bg-primary/60" trackColor="bg-muted" />
          <SentimentBar label="Anxious" percentage={anxious} color="bg-amber-500" trackColor="bg-amber-100 dark:bg-amber-500/10" />
        </div>
      </div>
    </div>
  );
}

function SentimentBar({ label, percentage, color, trackColor }: { label: string; percentage: number; color: string, trackColor: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-[10px] font-medium text-muted-foreground w-12">{label}</span>
      <div className={cn("flex-1 h-1.5 rounded-full overflow-hidden", trackColor)}>
        <div
          className={cn(color, "h-full rounded-full transition-all duration-1000 ease-out")}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-[10px] font-semibold text-foreground w-8 text-right">{percentage}%</span>
    </div>
  );
}

"use client";

import Link from "next/link";

import { Badge } from "@/components/ui/badge";

import { Calendar, Smile, Meh, Frown } from "lucide-react";

export type EntryMood = "positive" | "neutral" | "anxious";

interface EntryCardProps {
  id: string;
  date: string;
  time: string;
  mood: EntryMood;
  title: string;
  contentSnippet: string;
  tags: string[];
}

const moodConfig = {
  positive: {
    icon: Smile,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10 dark:bg-emerald-400/20",
    label: "Positive"
  },
  neutral: {
    icon: Meh,
    color: "text-muted-foreground",
    bg: "bg-muted",
    label: "Neutral"
  },
  anxious: {
    icon: Frown,
    color: "text-amber-500",
    bg: "bg-amber-500/10 dark:bg-amber-400/20",
    label: "Anxious"
  },
};

export function EntryCard({ id, date, time, mood, title, contentSnippet, tags }: EntryCardProps) {
  const config = moodConfig[mood];
  const Icon = config.icon;

  return (
    <Link
      href={`/entries/${id}`}
      className="group border border-border/50 rounded-2xl p-6 bg-background hover:border-primary/30 hover:shadow-md transition-all cursor-pointer relative overflow-hidden block"
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl ${config.bg} ${config.color} shrink-0`}>
            <Icon size={20} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
              {title}
            </h3>
            <div className="flex items-center gap-2 text-xs text-muted-foreground/60 mt-1">
              <Calendar size={12} strokeWidth={1.5} />
              <span>{date}</span>
              <span className="opacity-30">•</span>
              <span>{time}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5 order-last sm:order-none">
          {tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="text-[10px] font-medium px-2 py-0 bg-muted text-muted-foreground border-none shadow-none"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
        {contentSnippet}
      </p>
    </Link>
  );
}


"use client";

import { useQuery } from "convex/react";
import { api } from "@mood-journal/convex/_generated/api";

export function WelcomeHeader() {
  const user = useQuery(api.users.viewer);
  const streak = useQuery(api.streaks.get);

  const name = user?.displayName?.split(" ")[0] || "there";
  const streakCount = streak?.currentStreak || 0;

  return (
    <div className="px-6 py-10 sm:px-12 sm:pt-16 sm:pb-10">
      <h1 className="text-3xl sm:text-4xl font-medium tracking-tight text-foreground mb-2">
        Good morning, {name}.
      </h1>
      <p className="text-sm text-muted-foreground">
        {streakCount > 0
          ? `You're on a ${streakCount}-day journaling streak. Keep building the habit.`
          : "Start your first journal entry today to begin a streak."}
      </p>
    </div>
  );
}

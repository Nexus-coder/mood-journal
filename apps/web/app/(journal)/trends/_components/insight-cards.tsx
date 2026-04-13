import { TrendingUp, Zap, Sun, Loader2 } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@mood-journal/convex/_generated/api";

export function InsightCards() {
  const data = useQuery(api.analytics.getDashboard);

  if (!data) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="border border-border/50 rounded-2xl p-6 bg-muted animate-pulse h-32" />
        ))}
      </div>
    );
  }

  const { insights } = data;

  const insightsList = [
    {
      icon: TrendingUp,
      label: "Activity Level",
      value: `${insights.totalEntries} entries`,
      description: `You've recorded ${insights.totalEntries} entries in the last 30 days.`,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10 dark:bg-emerald-400/20",
    },
    {
      icon: Zap,
      label: "Peak Productivity",
      value: insights.peakDay,
      description: `Most of your reflections happen on ${insights.peakDay}s.`,
      color: "text-blue-500",
      bg: "bg-blue-500/10 dark:bg-blue-400/20",
    },
    {
      icon: Sun,
      label: "Current Streak",
      value: `${insights.currentStreak} days`,
      description: `You are currently on a ${insights.currentStreak}-day writing streak!`,
      color: "text-amber-500",
      bg: "bg-amber-500/10 dark:bg-amber-400/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      {insightsList.map((insight) => {
        const Icon = insight.icon;
        return (
          <div key={insight.label} className="border border-border/50 rounded-2xl p-6 bg-background hover:border-primary/30 transition-all shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-xl ${insight.bg} ${insight.color} border border-border/10`}>
                <Icon size={18} />
              </div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                {insight.label}
              </span>
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">
              {insight.value}
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed italic opacity-80">
              &quot;{insight.description}&quot;
            </p>
          </div>
        );
      })}
    </div>
  );
}

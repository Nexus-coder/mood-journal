"use client";

import { useQuery } from "convex/react";
import { api } from "@mood-journal/convex/_generated/api";
import { Filter, PanelLeftClose, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MoodChart } from "./mood-chart";
import { useSidebar } from "../../_components/providers/sidebar-provider";
import { usePathname, useRouter } from "next/navigation";
import { getPlainText } from "@/lib/tiptap-utils";

const ENTRIES_LIMIT = 5;

export function SecondarySidebar() {
  const { isSecondaryCollapsed, toggleSecondary } = useSidebar();
  const entries = useQuery(api.entries.list);
  const pathname = usePathname();
  const router = useRouter();

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case "positive": return "bg-emerald-400";
      case "neutral": return "bg-blue-400";
      case "anxious": return "bg-amber-400";
      default: return "bg-neutral-300";
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    if (isToday) {
      return `Today, ${date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`;
    }

    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const visibleEntries = entries?.slice(0, ENTRIES_LIMIT) ?? [];
  const hasMore = (entries?.length ?? 0) > ENTRIES_LIMIT;

  return (
    <aside
      className={cn(
        "border-r border-border bg-background flex flex-col hidden lg:flex shrink-0 z-10 transition-all duration-300 ease-in-out overflow-hidden",
        isSecondaryCollapsed ? "w-0 border-r-0" : "w-80"
      )}
    >
      <div className={cn(
        "flex-1 flex flex-col min-w-[320px] transition-opacity duration-200",
        isSecondaryCollapsed ? "opacity-0 pointer-events-none" : "opacity-100"
      )}>
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest pl-1">Overview</h2>
          <button
            onClick={toggleSecondary}
            className="text-muted-foreground hover:text-foreground transition-colors p-1"
            title="Collapse Sidebar"
          >
            <PanelLeftClose size={16} strokeWidth={1.5} />
          </button>
        </div>

        <MoodChart />

        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="px-5 py-4 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-sm z-10">
            <h2 className="text-sm font-medium text-foreground">Recent Entries</h2>
            <button className="text-muted-foreground hover:text-foreground transition-colors">
              <Filter size={16} strokeWidth={1.5} />
            </button>
          </div>

          <ScrollArea className="flex-1">
            <div className="flex flex-col">
              {entries === undefined ? (
                <div className="px-5 py-4 flex flex-col gap-4 animate-pulse">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="space-y-2">
                      <div className="h-2 bg-muted rounded w-1/4" />
                      <div className="h-3 bg-muted rounded w-3/4" />
                      <div className="h-2 bg-muted rounded w-full" />
                    </div>
                  ))}
                </div>
              ) : entries.length === 0 ? (
                <div className="px-5 py-10 text-center">
                  <p className="text-xs text-muted-foreground">No entries yet.</p>
                </div>
              ) : (
                <>
                  {visibleEntries.map((entry) => (
                    <button
                      key={entry._id}
                      onClick={() => router.push(`/entries/${entry._id}`)}
                      className={cn(
                        "text-left px-5 py-4 border-l-2 transition-colors group border-t border-border first:border-t-0",
                        pathname.includes(entry._id)
                          ? "bg-muted/50 border-foreground"
                          : "border-transparent hover:bg-muted/50"
                      )}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-muted-foreground">
                          {formatDate(entry._creationTime)}
                        </span>
                        <div className={cn("w-2 h-2 rounded-full", getMoodColor(entry.mood))} />
                      </div>
                      <h3 className="text-sm font-medium text-foreground truncate mb-1">{entry.title}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {getPlainText(entry.body).slice(0, 100)}...
                      </p>
                    </button>
                  ))}

                  {/* Show more button */}
                  {hasMore && (
                    <div className="px-5 py-4 border-t border-border">
                      <button
                        onClick={() => router.push("/entries")}
                        className="w-full flex items-center justify-between text-xs font-medium text-muted-foreground hover:text-foreground transition-colors group py-1"
                      >
                        <span>Show all {entries.length} entries</span>
                        <ArrowRight
                          size={13}
                          className="opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all"
                        />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </aside>
  );
}


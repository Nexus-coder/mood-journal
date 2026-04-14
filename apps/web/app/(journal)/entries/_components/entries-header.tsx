"use client";

import { Search, Filter } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function EntriesHeader() {
  return (
    <div className="px-6 py-8 sm:px-12 sm:pt-16 sm:pb-8 flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-medium tracking-tight text-foreground mb-2">
          Journal Entries
        </h1>
        <p className="text-sm text-muted-foreground">
          Reflect on your journey and past insights.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
          <Input
            placeholder="Search entries..."
            className="pl-10 bg-background border-border focus-visible:ring-primary/20 h-10 rounded-xl"
          />
        </div>
        <Button variant="outline" className="h-10 px-4 rounded-xl border-border text-muted-foreground hover:text-foreground hover:bg-muted flex items-center gap-2 transition-all">
          <Filter size={16} />
          <span>Filter</span>
        </Button>
      </div>
    </div>
  );
}

"use client";

import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

import { WelcomeHeader } from "./_components/welcome-header";
import { QuickEntry } from "./_components/quick-entry";
import { DashboardCards } from "./_components/dashboard-cards";
import { FrequentTopics } from "./_components/frequent-topics";

export default function DashboardPage() {
  return (
    <main className="flex-1 flex flex-col bg-background overflow-hidden relative">
      {/* Mobile Header (Hidden on Desktop) */}
      <header className="h-14 px-6 flex items-center justify-between border-b border-border shrink-0 lg:hidden">
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <Menu size={20} />
        </Button>
        <div className="text-sm font-semibold tracking-tighter text-foreground">JRNL</div>
        <Avatar className="size-8 cursor-pointer border border-border">
          <AvatarFallback className="text-[10px] font-medium text-muted-foreground bg-muted">
            ME
          </AvatarFallback>
        </Avatar>
      </header>

      <ScrollArea className="flex-1">
        <div className="w-full max-w-5xl mx-auto pb-20">
          <WelcomeHeader />
          <div className="px-6 space-y-10">
            <QuickEntry />
            <DashboardCards />
            <div className="bg-muted/30 border border-border rounded-3xl p-6 sm:p-8">
              <FrequentTopics />
            </div>
          </div>
        </div>
      </ScrollArea>
    </main>
  );
}

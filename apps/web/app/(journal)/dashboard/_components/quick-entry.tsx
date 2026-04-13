"use client";

import { SquarePen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function QuickEntry() {
  const [text, setText] = useState("");
  const router = useRouter();

  const handleStart = () => {
    router.push("/write");
  };

  return (
    <div className="">
      <div className="border border-border rounded-2xl p-2 bg-muted/30 flex flex-col sm:flex-row items-center gap-2">
        <div className="flex items-center gap-3 w-full bg-background border border-border rounded-xl px-4 py-3 shadow-sm">
          <SquarePen className="text-muted-foreground size-5 shrink-0" />
          <Input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What's on your mind today?"
            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 border-none shadow-none focus-visible:ring-0 px-0 h-auto"
          />
        </div>
        <Button
          onClick={handleStart}
          className="bg-primary text-primary-foreground px-6 py-6 rounded-xl text-sm font-medium hover:opacity-90 transition-all shrink-0 w-full sm:w-auto shadow-sm"
        >
          Start Entry
        </Button>
      </div>
    </div>
  );
}

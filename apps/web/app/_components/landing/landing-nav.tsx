"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useConvexAuth } from "convex/react";
import { ThemeToggle } from "@/components/theme-toggle";

export function LandingNav() {
  const { isAuthenticated, isLoading } = useConvexAuth();

  return (
    <nav className="w-full px-6 py-6 sm:px-12 flex items-center justify-between relative z-50 shrink-0 animate-fade-up">
      <div className="text-base font-semibold tracking-tighter text-foreground flex items-center gap-2">
        <div className="size-6 bg-primary rounded-md flex items-center justify-center">
          <span className="text-primary-foreground text-[10px] tracking-tighter leading-none">JR</span>
        </div>
        JRNL
      </div>

      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
        <a href="#features" className="hover:text-foreground transition-colors">Features</a>
        <a href="#" className="hover:text-foreground transition-colors">Methodology</a>
        <a href="#" className="hover:text-foreground transition-colors">Security</a>
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        {!isLoading && (
          <>
            {isAuthenticated ? (
              <Link href="/dashboard">
                <Button className="bg-primary text-primary-foreground px-5 py-2.5 rounded-full text-sm font-medium hover:opacity-90 transition-all shadow-sm flex items-center gap-2 h-auto">
                  Dashboard <ArrowRight className="size-4 opacity-70" />
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="hidden sm:block text-sm font-medium text-muted-foreground hover:text-foreground px-0 hover:bg-transparent">
                    Log in
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-primary text-primary-foreground px-5 py-2.5 rounded-full text-sm font-medium hover:opacity-90 transition-all shadow-sm flex items-center gap-2 h-auto">
                    Get started <ArrowRight className="size-4 opacity-70" />
                  </Button>
                </Link>
              </>
            )}
          </>
        )}
      </div>
    </nav>
  );
}

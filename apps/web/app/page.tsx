"use client";

import Link from "next/link";
import { useConvexAuth } from "convex/react";
import { PlayCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { BackgroundEffects } from "./_components/landing/background-effects";
import { LandingNav } from "./_components/landing/landing-nav";
import { FloatingMockups } from "./_components/landing/floating-mockups";
import { FeaturesSection } from "./_components/landing/features-section";

export default function LandingPage() {
  const { isAuthenticated, isLoading } = useConvexAuth();

  return (
    <div className="bg-background text-foreground w-full min-h-screen flex flex-col antialiased relative font-sans transition-colors duration-300">

      {/* Background only covers the hero so it doesn't tile into features */}
      <div className="absolute inset-0 h-screen pointer-events-none">
        <BackgroundEffects />
      </div>

      <LandingNav />

      {/* ─── Hero ─── */}
      <main className="flex-1 w-full max-w-[1400px] mx-auto px-6 sm:px-12 flex flex-col lg:flex-row items-center relative z-10 min-h-[calc(100svh-80px)]">

        {/* Left Side: Copy & CTA */}
        <div className="w-full lg:w-[45%] flex flex-col justify-center pt-8 lg:pt-0 pb-12 lg:pb-0 relative z-20">

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-medium tracking-tighter text-foreground leading-[1.05] mb-6 animate-fade-up-delay-1">
            Clarity through <br className="hidden lg:block" /> reflection.
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-md mb-10 animate-fade-up-delay-2">
            A minimalist space to capture your thoughts, discover emerging
            patterns, and track your emotional well-being over time.
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 animate-fade-up-delay-3">
            {isLoading ? (
              <Skeleton className="h-[72px] w-[200px] rounded-2xl" />
            ) : (
              <Link href={isAuthenticated ? "/dashboard" : "/signup"} className="w-full sm:w-auto">
                <Button className="bg-primary text-primary-foreground px-7 py-6 rounded-2xl text-sm font-medium hover:opacity-90 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/10 w-full flex justify-center items-center gap-2 h-auto">
                  {isAuthenticated ? "Go to Dashboard" : "Start journaling"}
                </Button>
              </Link>
            )}
            <a href="#features" className="w-full sm:w-auto">
              <Button
                variant="outline"
                className="bg-background/50 backdrop-blur-md text-foreground border border-border/80 px-7 py-6 rounded-2xl text-sm font-medium hover:bg-accent transition-all w-full sm:w-auto flex justify-center items-center gap-2 shadow-sm h-auto"
              >
                <PlayCircle className="size-5 opacity-70" /> See features
              </Button>
            </a>
          </div>

          {/* Trust / Stats indicator */}
          <div className="mt-12 flex items-center gap-4 pt-8 border-t border-border/50 animate-fade-up-delay-3">
            <div className="flex -space-x-2">
              <div className="size-8 rounded-full bg-blue-100 dark:bg-blue-900 border-2 border-background flex items-center justify-center text-[10px] font-medium text-blue-700 dark:text-blue-300">A</div>
              <div className="size-8 rounded-full bg-emerald-100 dark:bg-emerald-900 border-2 border-background flex items-center justify-center text-[10px] font-medium text-emerald-700 dark:text-emerald-300">S</div>
              <div className="size-8 rounded-full bg-amber-100 dark:bg-amber-900 border-2 border-background flex items-center justify-center text-[10px] font-medium text-amber-700 dark:text-amber-300">M</div>
            </div>
            <div className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
              Join <span className="font-semibold text-foreground underline underline-offset-4 decoration-emerald-200/50">10,000+</span> mindful thinkers.
            </div>
          </div>
        </div>

        <FloatingMockups />
      </main>

      {/* ─── Features ─── */}
      <FeaturesSection />

      {/* ─── Footer ─── */}
      <footer className="relative z-10 border-t border-border/40 py-8 px-6 sm:px-12">
        <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-2 font-semibold tracking-tight text-foreground text-sm">
            <div className="size-5 bg-primary rounded-md flex items-center justify-center">
              <span className="text-primary-foreground text-[9px] tracking-tighter leading-none">JR</span>
            </div>
            Mood Journal
          </div>
          <span>Built with ❤️ for emotional clarity.</span>
          <div className="flex items-center gap-5 font-medium">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <Link href="/login" className="hover:text-foreground transition-colors">Login</Link>
            <Link href="/signup" className="hover:text-foreground transition-colors">Sign up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

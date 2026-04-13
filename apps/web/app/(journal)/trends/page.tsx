"use client";

import { TrendsHeader } from "./_components/trends-header";
import { SentimentTrendChart } from "./_components/sentiment-trend-chart";
import { MoodDistributionChart } from "./_components/mood-distribution-chart";
import { InsightCards } from "./_components/insight-cards";
import { useQuery } from "convex/react";
import { api } from "@mood-journal/convex/_generated/api";


export default function TrendsPage() {
  const data = useQuery(api.analytics.getDashboard);

  const getSummary = () => {
    if (!data || data.distribution.count === 0) {
      return "Start writing to see your emotional landscape evolve. Your summary will appear here once you have at least one analyzed entry.";
    }

    const { distribution, insights } = data;
    const dominantMood = distribution.positive > 50 ? "remarkably stable" : "evolving";
    
    return (
      <>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          Your emotional landscape this month has been <span className="text-emerald-500 font-semibold">{dominantMood}</span>, 
          with a total of {insights.totalEntries} reflections recorded. 
          Your current writing streak is <span className="font-bold text-foreground">{insights.currentStreak} days</span>, 
          demonstrating a consistent commitment to your mental well-being.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          We noticed that your activity peaks on <span className="font-bold text-foreground">{insights.peakDay}s</span>. 
          {distribution.anxious > 20 ? " You've had some fluctuations in anxiety lately; consider reviewing entries from those days to identify triggers." : " Your overall sentiment remains highly positive, contributing to a healthy psychological trend."}
        </p>
      </>
    );
  };

  return (
    <main className="flex-1 flex flex-col bg-background overflow-y-auto relative">
      <div className="w-full max-w-5xl mx-auto pb-20">
        <TrendsHeader />
        
        <div className="px-6 sm:px-12">
          <InsightCards />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <SentimentTrendChart />
            </div>
            <div className="lg:col-span-1">
              <MoodDistributionChart />
            </div>
          </div>

          <div className="mt-12 p-8 border border-border/50 rounded-3xl bg-muted/30">
            <h3 className="text-lg font-semibold text-foreground mb-4">Executive Summary</h3>
            <div className="max-w-3xl">
              {getSummary()}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}


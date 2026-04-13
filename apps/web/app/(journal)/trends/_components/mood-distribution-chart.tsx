"use client";

import { Pie, PieChart, Cell } from "recharts";
import { useQuery } from "convex/react";
import { api } from "@mood-journal/convex/_generated/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  positive: {
    label: "Positive",
    color: "oklch(0.792 0.209 151.711)",
  },
  neutral: {
    label: "Neutral",
    color: "oklch(0.588 0.158 241.966)",
  },
  anxious: {
    label: "Anxious",
    color: "oklch(0.841 0.193 83.335)",
  },
} satisfies ChartConfig;

export function MoodDistributionChart() {
  const summary = useQuery(api.sentiment.getSummary);

  const data = [
    { name: "Positive", value: summary ? Math.round(summary.positive * 100) : 0, color: "oklch(0.792 0.209 151.711)" },
    { name: "Neutral", value: summary ? Math.round(summary.neutral * 100) : 0, color: "oklch(0.588 0.158 241.966)" },
    { name: "Anxious", value: summary ? Math.round(summary.anxious * 100) : 0, color: "oklch(0.841 0.193 83.335)" },
  ];

  const hasData = summary && summary.count > 0;

  return (
    <Card className="border-border/50 shadow-none rounded-2xl overflow-hidden p-2 h-full flex flex-col bg-background">
      <CardHeader className="px-6 pt-6 pb-2">
        <CardTitle className="text-sm font-semibold text-foreground">Overall Distribution</CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Last 30 days mood breakdown.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-4">
        {hasData ? (
          <>
            <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  strokeWidth={0}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
            <div className="flex flex-col gap-2 mt-4 px-4">
              {data.map((item) => (
                <div key={item.name} className="flex items-center justify-between group/row">
                  <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full border border-white/10" style={{ backgroundColor: item.color }} />
                    <span className="text-xs text-muted-foreground group-hover/row:text-foreground transition-colors">{item.name}</span>
                  </div>
                  <span className="text-xs font-bold text-foreground">{item.value}%</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-[300px] text-center px-4">
            <p className="text-sm text-muted-foreground/50 italic">No historical data available yet.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

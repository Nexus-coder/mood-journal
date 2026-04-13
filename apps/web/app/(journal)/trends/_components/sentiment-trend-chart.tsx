import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
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
import { Skeleton } from "@/components/ui/skeleton";

const chartConfig = {
  positive: {
    label: "Positive",
    color: "oklch(0.792 0.209 151.711)", // Emerald
  },
  neutral: {
    label: "Neutral",
    color: "oklch(0.588 0.158 241.966)", // Primary/Blue-ish
  },
  anxious: {
    label: "Anxious",
    color: "oklch(0.841 0.193 83.335)", // Amber
  },
} satisfies ChartConfig;

export function SentimentTrendChart() {
  const data = useQuery(api.analytics.getDashboard);

  if (!data) {
    return (
      <Card className="border-border/50 shadow-none rounded-2xl overflow-hidden p-2 bg-background">
        <CardHeader className="px-6 pt-6 pb-2">
          <Skeleton className="h-4 w-32 mb-1 bg-muted" />
          <Skeleton className="h-3 w-48 bg-muted" />
        </CardHeader>
        <CardContent className="px-2 pt-0 h-[250px]">
          <Skeleton className="h-full w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50 shadow-none rounded-2xl overflow-hidden p-2 bg-background">
      <CardHeader className="px-6 pt-6 pb-2">
        <CardTitle className="text-sm font-semibold text-foreground">Sentiment Intensity</CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Showing sentiment breakdown for the last 30 days.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-0">
        <ChartContainer config={chartConfig} className="aspect-[16/9] w-full">
          <AreaChart
            data={data.trend}
            margin={{
              left: 12,
              right: 12,
              top: 12,
              bottom: 12,
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" opacity={0.2} />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `${value}`}
              className="text-[10px] text-muted-foreground"
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="anxious"
              type="natural"
              fill="var(--color-anxious)"
              fillOpacity={0.15}
              stroke="var(--color-anxious)"
              stackId="a"
            />
            <Area
              dataKey="neutral"
              type="natural"
              fill="var(--color-neutral)"
              fillOpacity={0.15}
              stroke="var(--color-neutral)"
              stackId="a"
            />
            <Area
              dataKey="positive"
              type="natural"
              fill="var(--color-positive)"
              fillOpacity={0.15}
              stroke="var(--color-positive)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

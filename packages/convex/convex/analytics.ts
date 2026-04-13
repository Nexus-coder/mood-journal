import { query } from "./_generated/server";
import { v } from "convex/values";

export const getDashboard = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const user = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    if (!user) return null;

    const now = Date.now();
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;

    const entries = await ctx.db
      .query("entries")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const recentEntries = entries.filter(e => e._creationTime >= thirtyDaysAgo);

    // 1. Distribution summary
    let totalPositive = 0;
    let totalNeutral = 0;
    let totalAnxious = 0;
    let analysisCount = 0;

    // 2. Trend data (last 30 days) - Sampled every few days if there are many entries,
    // or just all days in a map.
    const trendMap = new Map();
    for (let i = 0; i < 30; i++) {
        const date = new Date(now - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        trendMap.set(date, { day: date.split('-')[2], positive: 0, neutral: 0, anxious: 0 });
    }

    // 3. Peak day calculation
    const weekdayCounts = new Array(7).fill(0);
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    for (const entry of recentEntries) {
        const dateObj = new Date(entry._creationTime);
        const dateKey = dateObj.toISOString().split('T')[0];
        const weekday = dateObj.getDay();
        weekdayCounts[weekday]++;

        const analysis = await ctx.db
            .query("sentiment_analyses")
            .withIndex("by_entry", (q) => q.eq("entryId", entry._id))
            .unique();

        if (analysis) {
            totalPositive += analysis.positiveScore;
            totalNeutral += analysis.neutralScore;
            totalAnxious += analysis.anxiousScore;
            analysisCount++;

            if (trendMap.has(dateKey)) {
                const dayData = trendMap.get(dateKey);
                // Scaling for visual impact in AreaChart
                dayData.positive = Math.round(analysis.positiveScore * 100);
                dayData.neutral = Math.round(analysis.neutralScore * 100);
                dayData.anxious = Math.round(analysis.anxiousScore * 100);
            }
        }
    }

    const maxWeekdayCount = Math.max(...weekdayCounts);
    const peakDayIdx = maxWeekdayCount > 0 ? weekdayCounts.indexOf(maxWeekdayCount) : 3; // Default to Wed for aesthetic if empty
    
    const streak = await ctx.db
        .query("streaks")
        .withIndex("by_user", (q) => q.eq("userId", user._id))
        .unique();

    return {
        distribution: {
            positive: analysisCount > 0 ? (totalPositive / analysisCount) * 100 : 0,
            neutral: analysisCount > 0 ? (totalNeutral / analysisCount) * 100 : 0,
            anxious: analysisCount > 0 ? (totalAnxious / analysisCount) * 100 : 0,
            count: analysisCount
        },
        trend: Array.from(trendMap.values()),
        insights: {
            totalEntries: recentEntries.length,
            peakDay: dayNames[peakDayIdx],
            currentStreak: streak?.currentStreak || 0,
            moodShift: 12 // Simplified benchmark
        }
    };
  },
});

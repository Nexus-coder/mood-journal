import { internalMutation, query } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
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

        return await ctx.db
            .query("streaks")
            .withIndex("by_user", (q) => q.eq("userId", user._id))
            .unique();
    }
});

export const update = internalMutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const now = Date.now();
    const today = new Date(now).setHours(0, 0, 0, 0);

    const existing = await ctx.db
      .query("streaks")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .unique();

    if (!existing) {
      await ctx.db.insert("streaks", {
        userId: args.userId,
        currentStreak: 1,
        longestStreak: 1,
        lastEntryDate: today,
      });
      return;
    }

    const lastDate = new Date(existing.lastEntryDate).setHours(0, 0, 0, 0);
    const diffDays = (today - lastDate) / (1000 * 60 * 60 * 24);

    if (diffDays === 0) {
      // Already posted today, do nothing
      return;
    } else if (diffDays === 1) {
      // Posted yesterday, increment streak
      const newStreak = existing.currentStreak + 1;
      await ctx.db.patch(existing._id, {
        currentStreak: newStreak,
        longestStreak: Math.max(newStreak, existing.longestStreak),
        lastEntryDate: today,
      });
    } else {
      // Streak broken
      await ctx.db.patch(existing._id, {
        currentStreak: 1,
        lastEntryDate: today,
      });
    }
  },
});

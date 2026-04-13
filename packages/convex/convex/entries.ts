import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { api, internal } from "./_generated/api";

export const create = mutation({
  args: {
    title: v.string(),
    body: v.string(),
    mood: v.union(v.literal("positive"), v.literal("neutral"), v.literal("anxious")),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    if (!user) {
      throw new Error("User not found in system");
    }

    const userId = user._id;

    const wordCount = args.body.trim().split(/\s+/).length;
    const updatedAt = Date.now();

    const entryId = await ctx.db.insert("entries", {
      userId,
      title: args.title,
      body: args.body,
      mood: args.mood,
      wordCount,
      updatedAt,
    });

    // 1. Analyze sentiment (using AI SDK action)
    await ctx.scheduler.runAfter(0, api.sentiment.analyzeEntry, { 
      entryId, 
      body: args.body 
    });

    // 2. Handle tags
    if (args.tags) {
      for (const tag of args.tags) {
        await ctx.db.insert("entry_tags", { entryId, userId, tag });
      }
    }

    // 3. Update streaks
    await ctx.runMutation(internal.streaks.update, { userId });

    return entryId;
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }
    const user = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    if (!user) return [];

    return await ctx.db
      .query("entries")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();
  },
});

export const get = query({
  args: { entryId: v.id("entries") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    if (!user) throw new Error("User not found");

    const entry = await ctx.db.get(args.entryId);
    if (!entry || entry.userId !== user._id) {
      return null;
    }


    const sentiment = await ctx.db
      .query("sentiment_analyses")
      .withIndex("by_entry", (q) => q.eq("entryId", args.entryId))
      .unique();

    const tags = await ctx.db
      .query("entry_tags")
      .withIndex("by_entry", (q) => q.eq("entryId", args.entryId))
      .collect();

    return { ...entry, sentiment, tags: tags.map((t) => t.tag) };
  },
});

export const update = mutation({
  args: {
    entryId: v.id("entries"),
    title: v.optional(v.string()),
    body: v.optional(v.string()),
    mood: v.optional(v.union(v.literal("positive"), v.literal("neutral"), v.literal("anxious"))),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    if (!user) throw new Error("User not found");

    const existing = await ctx.db.get(args.entryId);
    if (!existing || existing.userId !== user._id) {
      throw new Error("Entry not found");
    }

    const patch: any = { updatedAt: Date.now() };
    if (args.title !== undefined) patch.title = args.title;
    if (args.body !== undefined) {
      patch.body = args.body;
      patch.wordCount = args.body.trim().split(/\s+/).length;
    }
    if (args.mood !== undefined) patch.mood = args.mood;

    await ctx.db.patch(args.entryId, patch);

    // Re-analyze sentiment if body changed
    if (args.body !== undefined) {
      await ctx.scheduler.runAfter(0, api.sentiment.analyzeEntry, { 
        entryId: args.entryId, 
        body: args.body 
      });
    }

    // Update tags if provided
    if (args.tags !== undefined) {
        // Simple approach: delete and re-insert
        const existingTags = await ctx.db
            .query("entry_tags")
            .withIndex("by_entry", (q) => q.eq("entryId", args.entryId))
            .collect();
        for (const tag of existingTags) {
            await ctx.db.delete(tag._id);
        }
        for (const tag of args.tags) {
            await ctx.db.insert("entry_tags", { entryId: args.entryId, userId: user._id, tag });
        }
    }

    return args.entryId;
  },
});

export const remove = mutation({
  args: { entryId: v.id("entries") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    if (!user) throw new Error("User not found");

    const existing = await ctx.db.get(args.entryId);
    if (!existing || existing.userId !== user._id) {
      throw new Error("Entry not found");
    }

    // Cleanup related data
    const sentiment = await ctx.db
      .query("sentiment_analyses")
      .withIndex("by_entry", (q) => q.eq("entryId", args.entryId))
      .unique();
    if (sentiment) await ctx.db.delete(sentiment._id);

    const tags = await ctx.db
      .query("entry_tags")
      .withIndex("by_entry", (q) => q.eq("entryId", args.entryId))
      .collect();
    for (const tag of tags) {
      await ctx.db.delete(tag._id);
    }

    await ctx.db.delete(args.entryId);
  },
});

export const getWeeklyStats = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    if (!user) return [];

    const now = Date.now();
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;

    const entries = await ctx.db
      .query("entries")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();
    
    // Filter manually for clarity and to handle potential index limitations on creationTime with userId
    const recentEntries = entries.filter(e => e._creationTime >= sevenDaysAgo);

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const stats = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(now - (6 - i) * 24 * 60 * 60 * 1000);
      return {
        dayName: days[date.getDay()],
        count: 0,
        moodDistribution: { positive: 0, neutral: 0, anxious: 0 } as Record<string, number>,
        date: date.toISOString().split('T')[0]
      };
    });

    for (const entry of recentEntries) {
      const entryDate = new Date(entry._creationTime).toISOString().split('T')[0];
      const stat = stats.find(s => s.date === entryDate);
      if (stat) {
        stat.count++;
        stat.moodDistribution[entry.mood]++;
      }
    }

    return stats.map(s => {
      let dominantMood = "neutral";
      if (s.count > 0) {
        if (s.moodDistribution.positive >= s.moodDistribution.neutral && s.moodDistribution.positive >= s.moodDistribution.anxious) {
          dominantMood = "positive";
        } else if (s.moodDistribution.anxious >= s.moodDistribution.positive && s.moodDistribution.anxious >= s.moodDistribution.neutral) {
          dominantMood = "anxious";
        }
      }
      
      return {
        dayName: s.dayName,
        count: s.count,
        dominantMood
      };
    });
  },
});


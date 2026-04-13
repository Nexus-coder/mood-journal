import { v } from "convex/values";
import { action, internalMutation, query } from "./_generated/server";
import { generateText, Output } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { internal } from "./_generated/api";

export const analyzeEntry = action({
  args: { entryId: v.id("entries"), body: v.string() },
  handler: async (ctx, { entryId, body }) => {
    if (!process.env.OPENAI_API_KEY) {
      console.error("OPENAI_API_KEY is not set in environment variables");
      throw new Error("AI analysis is currently unavailable. Please check backend configuration.");
    }

    try {
      const { output: analysis } = await generateText({
        model: openai("gpt-4o-mini"),
        output: Output.object({
          schema: z.object({
            positiveScore: z.number().describe("0-1 scale of positive sentiment"),
            neutralScore: z.number().describe("0-1 scale of neutral sentiment"),
            anxiousScore: z.number().describe("0-1 scale of anxious sentiment"),
            dominantMood: z.enum(["positive", "neutral", "anxious"]),
            highlightedWords: z.array(z.object({
              word: z.string(),
              sentiment: z.enum(["positive", "neutral", "anxious"])
            })).describe("Keywords and their detected sentiment"),
            tags: z.array(z.string()).describe("3-5 highly relevant descriptive tags")
          }),
        }),
        prompt: `Analyze the sentiment of this journal entry.
        
        Analyze for:
        - Emotional weight (positive, neutral, anxious)
        - Key emotional triggers/words
        - Relevant themes for tagging
        
        Entry: 
        """
        ${body}
        """`
      });

      await ctx.runMutation(internal.sentiment.upsertAnalysis, {
        entryId,
        ...analysis,
      });

      return analysis;
    } catch (error) {
      console.error("AI Analysis failed:", error);
      // Fallback to neutral if AI fails
      await ctx.runMutation(internal.sentiment.upsertAnalysis, {
        entryId,
        positiveScore: 0,
        neutralScore: 1,
        anxiousScore: 0,
        dominantMood: "neutral",
        highlightedWords: [],
        tags: [],
      });
      throw error;
    }
  }
});

export const upsertAnalysis = internalMutation({
  args: {
    entryId: v.id("entries"),
    positiveScore: v.number(),
    neutralScore: v.number(),
    anxiousScore: v.number(),
    dominantMood: v.string(),
    highlightedWords: v.array(v.object({ word: v.string(), sentiment: v.string() })),
    tags: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const entry = await ctx.db.get(args.entryId);
    if (!entry) return;

    // 1. Upsert sentiment analysis
    const existing = await ctx.db
      .query("sentiment_analyses")
      .withIndex("by_entry", (q) => q.eq("entryId", args.entryId))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        positiveScore: args.positiveScore,
        neutralScore: args.neutralScore,
        anxiousScore: args.anxiousScore,
        dominantMood: args.dominantMood,
        highlightedWords: args.highlightedWords,
      });
    } else {
      await ctx.db.insert("sentiment_analyses", {
        entryId: args.entryId,
        positiveScore: args.positiveScore,
        neutralScore: args.neutralScore,
        anxiousScore: args.anxiousScore,
        dominantMood: args.dominantMood,
        highlightedWords: args.highlightedWords,
      });
    }

    // 2. Handle tags (merging AI tags with any existing manual tags)
    // For simplicity, we'll just add the AI tags that don't exist yet
    for (const tag of args.tags) {
      const existingTag = await ctx.db
        .query("entry_tags")
        .withIndex("by_user_tag", (q) => q.eq("userId", entry.userId).eq("tag", tag))
        .filter((q) => q.eq(q.field("entryId"), args.entryId))
        .unique();

      if (!existingTag) {
        await ctx.db.insert("entry_tags", {
          entryId: args.entryId,
          userId: entry.userId,
          tag,
        });
      }
    }
  },
});

export const getSummary = query({
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

    const entries = await ctx.db
      .query("entries")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    if (entries.length === 0) return null;

    let totalPositive = 0;
    let totalNeutral = 0;
    let totalAnxious = 0;
    let count = 0;

    for (const entry of entries) {
      const analysis = await ctx.db
        .query("sentiment_analyses")
        .withIndex("by_entry", (q) => q.eq("entryId", entry._id))
        .unique();

      if (analysis) {
        totalPositive += analysis.positiveScore;
        totalNeutral += analysis.neutralScore;
        totalAnxious += analysis.anxiousScore;
        count++;
      }
    }

    if (count === 0) return null;

    return {
      positive: totalPositive / count,
      neutral: totalNeutral / count,
      anxious: totalAnxious / count,
      count,
    };
  },
});

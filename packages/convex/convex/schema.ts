import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    tokenIdentifier: v.string(), // Mapping to Clerk identity
    clerkId: v.string(),
    displayName: v.string(),
    email: v.string(),
    avatarUrl: v.optional(v.string()),
  }).index("by_tokenIdentifier", ["tokenIdentifier"]),

  entries: defineTable({
    userId: v.id("users"),
    title: v.string(),
    body: v.string(),
    mood: v.union(v.literal("positive"), v.literal("neutral"), v.literal("anxious")),
    wordCount: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"]),

  sentiment_analyses: defineTable({
    entryId: v.id("entries"),
    positiveScore: v.number(),
    neutralScore: v.number(),
    anxiousScore: v.number(),
    dominantMood: v.string(),
    highlightedWords: v.array(v.object({ word: v.string(), sentiment: v.string() })),
  }).index("by_entry", ["entryId"]),

  entry_tags: defineTable({
    entryId: v.id("entries"),
    userId: v.id("users"),
    tag: v.string(),
  })
    .index("by_entry", ["entryId"])
    .index("by_user_tag", ["userId", "tag"]),

  streaks: defineTable({
    userId: v.id("users"),
    currentStreak: v.number(),
    longestStreak: v.number(),
    lastEntryDate: v.number(),
  }).index("by_user", ["userId"]),

  prompts: defineTable({
    text: v.string(),
    date: v.string(), // ISO date "YYYY-MM-DD"
  }).index("by_date", ["date"]),
});

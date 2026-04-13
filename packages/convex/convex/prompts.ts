import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const getDaily = query({
  args: {},
  handler: async (ctx) => {
    const today = new Date().toISOString().split("T")[0];
    const prompt = await ctx.db
      .query("prompts")
      .withIndex("by_date", (q) => q.eq("date", today))
      .unique();

    if (prompt) return prompt;

    // Fallback
    return {
      text: "What is a minor detail you noticed today that brought you a sense of calm?",
      date: today,
    };
  },
});

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const prompts = [
      "What is a minor detail you noticed today that brought you a sense of calm?",
      "What's one thing you're grateful for today, and why?",
      "If you could talk to your future self, what would you ask?",
      "Describe a small moment today that made you smile.",
      "What is something you want to let go of this week?",
      "What is a goal you have for tomorrow, no matter how small?",
      "How did you practice self-care today?",
    ];

    const today = new Date();
    
    for (let i = 0; i < prompts.length; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateStr = date.toISOString().split("T")[0];

      const existing = await ctx.db
        .query("prompts")
        .withIndex("by_date", (q) => q.eq("date", dateStr))
        .unique();

      if (!existing) {
        await ctx.db.insert("prompts", {
          text: prompts[i],
          date: dateStr,
        });
      }
    }

    return "Prompts seeded!";
  },
});

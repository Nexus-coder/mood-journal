import { query } from "./_generated/server";

export const list = query({
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

    const tags = await ctx.db
      .query("entry_tags")
      .withIndex("by_user_tag", (q) => q.eq("userId", user._id))
      .collect();

    // Get unique tags
    const uniqueTags = Array.from(new Set(tags.map((t) => t.tag))).sort();
    return uniqueTags;
  },
});

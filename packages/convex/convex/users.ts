import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Insert or update the user in the database after they sign in.
 */
export const store = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called storeUser without authentication identity");
    }

    // Check if we already have this user
    const user = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    if (user !== null) {
      // If we've seen this user before, update their record
      // This ensures names and avatars stay in sync with Clerk
      if (user.displayName !== identity.name || user.avatarUrl !== identity.pictureUrl) {
        await ctx.db.patch(user._id, {
          displayName: identity.name ?? "Anonymous",
          avatarUrl: identity.pictureUrl,
          email: identity.email ?? "",
        });
      }
      return user._id;
    }

    // If it's a new user, create a document for them
    return await ctx.db.insert("users", {
      tokenIdentifier: identity.tokenIdentifier,
      clerkId: identity.subject, // Clerk's unique user ID
      displayName: identity.name ?? "Anonymous",
      email: identity.email ?? "",
      avatarUrl: identity.pictureUrl,
    });
  },
});

export const viewer = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    return await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();
  },
});

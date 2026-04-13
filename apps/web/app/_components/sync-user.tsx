"use client";

import { useConvexAuth, useMutation } from "convex/react";
import { useEffect, useState } from "react";
import { api } from "@mood-journal/convex/_generated/api";

/**
 * Ensures the user is synchronized with our Convex database.
 * This runs after Clerk has authenticated the user.
 */
export function SyncUser({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useConvexAuth();
  const storeUser = useMutation(api.users.store);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !done) {
      storeUser().then(() => setDone(true));
    }
  }, [isAuthenticated, storeUser, done]);

  return <>{children}</>;
}

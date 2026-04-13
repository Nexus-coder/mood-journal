"use client";

import React, { createContext, useContext, useState } from "react";

type SidebarContextType = {
  isSecondaryCollapsed: boolean;
  setSecondaryCollapsed: (collapsed: boolean) => void;
  toggleSecondary: () => void;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isSecondaryCollapsed, setSecondaryCollapsed] = useState(false);

  const toggleSecondary = () => setSecondaryCollapsed((prev) => !prev);

  return (
    <SidebarContext.Provider
      value={{
        isSecondaryCollapsed,
        setSecondaryCollapsed,
        toggleSecondary,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}

---
name: nextjs-colocation
description: Enforces a colocation-first approach for Next.js App Router projects, grouping components, pages, and logic within route folders for modularity and maintainability.
---

# Next.js Colocation Skill

## Overview

Structure your Next.js apps with a **colocation-first** approach. Colocation means placing components, pages, and related logic together within their route folders. This aligns with the Next.js App Router's design, making features self-contained and easier to manage.

---

## Colocation Principles

1.  **Feature-Self-Containment**: Place components, layouts, and logic specific to a route inside that route's folder.
2.  **Private Folders (`_components/`, `_hooks/`, `_types/`)**: Use underscore-prefixed folders to opt out of the routing system and store route-specific logic/UI.
3.  **Scoped Reusability**: Shared components used across multiple routes within a segment should live in the nearest common parent's `_components/` folder.
4.  **Global Decoupling**: Keep truly global primitives (design system, absolute core utilities) at the top level.

---

## Recommended Folder Structure

```text
app/
├── (logical-group)/             # Route Group: Group features by domain (e.g. auth, dashboard, marketing)
│   ├── feature-name/               
│   │   ├── page.tsx             
│   │   ├── layout.tsx
│   │   ├── _components/         # Route-specific UI
│   │   ├── _hooks/              # Route-specific state/logic
│   │   └── _types/              # Route-specific interfaces
├── globals.css
├── layout.tsx
├── components/                  # Global UI primitives (Shadcn, Base UI)
├── lib/                         # Shared libraries and utilities
├── hooks/                       # Global reusable hooks
├── types/                       # Global shared TypeScript types
└── middleware.ts                # App-wide middleware
```

---

## Using Private Folders

Prefixing folders with an underscore (e.g., `_components`) prevents Next.js from considering them as route segments.

-   **When to use**: Always use `_components/` (or similar) within a route folder for elements that belong exclusively to that route.
-   **Server vs. Client**: Next.js defaults to Server Components. Add `"use client"` only when interactivity is needed. Colocation makes it easier to see where the client/server boundary is.

---

## Strategic Placement

-   **Route-Specific Schema**: If a Zod schema or input type is only used in one route, colocate it inside that route folder.
-   **Feature Shared Logic**: If logic is reused across a specific feature set (e.g. all dashboard pages), move it to the `(dashboard)/_components` or `(dashboard)/_hooks`.
-   **Truly Global Utilities**: Only move to the root `lib/` or `hooks/` if it is used across disparate feature groups.

---

## Step-by-Step: Adding a New Route

1.  **Identify Segment**: Determine where the route fits logically (e.g. part of a feature group or a top-level route).
2.  **Create Folder**: Create the route folder (e.g., `app/dashboard/settings`).
3.  **Add Entry Point**: Create `page.tsx` for the main content.
4.  **Colocate UI**: Create a `_components/` folder for any UI primitives needed specifically for this page.
5.  **Extract Shared Logic**: If you find yourself copying components from another route, move those components to the nearest common parent `_components/` folder.

---

## Common Mistakes to Avoid

-   ❌ **Flat Global `components/`**: Avoid putting every component in a single top-level folder.
-   ❌ **Naming Conflicts**: Ensure `_components/` is always underscored to avoid accidental route generation.
-   ❌ **Circular Dependencies**: Be careful when importing from parent `_components/` folders; always try to import from sibling or child folders, never "up" into a specific child's private folder from a global context.

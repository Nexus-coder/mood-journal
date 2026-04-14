"use client";

import { EntryList } from "./_components/entry-list";
import { EntriesHeader } from "./_components/entries-header";

export default function EntriesPage() {
  return (
    <main className="flex-1 flex flex-col bg-background overflow-y-auto relative">
      <div className="w-full max-w-5xl mx-auto">
        <EntriesHeader />
        <EntryList />
      </div>
    </main>
  );
}

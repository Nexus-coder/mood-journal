import { PrimarySidebar } from "./_components/primary-sidebar";
import { SecondarySidebar } from "./_components/secondary-sidebar";
import { SidebarProvider } from "../_components/providers/sidebar-provider";

export default function JournalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden bg-background text-foreground antialiased selection:bg-primary/20 selection:text-foreground">
        <PrimarySidebar />
        <SecondarySidebar />
        <main className="flex-1 relative overflow-hidden flex flex-col min-w-0">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}


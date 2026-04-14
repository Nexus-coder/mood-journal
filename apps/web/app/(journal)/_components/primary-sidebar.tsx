"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, SquarePen, FileText, BarChart3, PanelLeftOpen, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useClerk } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useSidebar } from "../../_components/providers/sidebar-provider";
import { ThemeToggle } from "@/components/theme-toggle";

const navItems = [
  { icon: Home, label: "Home", href: "/dashboard" },
  { icon: SquarePen, label: "New Entry", href: "/write" },
  { icon: FileText, label: "Entries", href: "/entries" },
  { icon: BarChart3, label: "Trends", href: "/trends" },
];

export function PrimarySidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut, user: clerkUser } = useClerk();
  const { isSecondaryCollapsed, toggleSecondary } = useSidebar();

  async function handleSignOut() {
    await signOut();
    window.location.href = "/";
  }

  return (
    <nav className="w-16 border-r border-border flex flex-col items-center py-6 bg-muted/30 hidden sm:flex shrink-0 z-20">
      <Tooltip>
        <TooltipTrigger
          render={
            <Link
              href="/"
              className="mb-10 group relative flex items-center justify-center pt-2"
            >
              <div className="size-9 rounded-xl bg-primary flex items-center justify-center transition-all group-hover:scale-105 active:scale-95 shadow-lg shadow-primary/20">
                <span className="text-primary-foreground font-bold text-lg leading-none">M</span>
              </div>
            </Link>
          }
        />
        <TooltipContent side="right">
          <p>Mood Journal</p>
        </TooltipContent>
      </Tooltip>

      <div className="flex flex-col gap-6 w-full items-center">
        {navItems.map((item, idx) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Tooltip key={idx}>
              <TooltipTrigger
                render={
                  <Link
                    href={item.href}
                    className={cn(
                      "w-full flex items-center justify-center transition-colors relative group py-3",
                      isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-primary rounded-r-full shadow-[0_0_8px_rgba(59,130,246,0.3)]" />
                    )}
                    <Icon 
                      size={20} 
                      strokeWidth={1.5} 
                      className={cn(
                        "transition-all duration-300 group-hover:scale-110", 
                        isActive && "scale-110"
                      )} 
                    />
                  </Link>
                }
              />
              <TooltipContent side="right" sideOffset={10}>
                <p>{item.label}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}

        {isSecondaryCollapsed && (
          <Tooltip>
            <TooltipTrigger
              render={
                <button
                  onClick={toggleSecondary}
                  className="text-muted-foreground hover:text-foreground transition-colors p-2 mt-4 animate-in fade-in slide-in-from-left-2 duration-300"
                >
                  <PanelLeftOpen size={20} strokeWidth={1.5} />
                </button>
              }
            />
            <TooltipContent side="right">
              <p>Expand Sidebar</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>

      <div className="mt-auto flex flex-col items-center gap-6">
        <ThemeToggle />
        <Tooltip>
          <TooltipTrigger
            render={
              <button
                onClick={handleSignOut}
                className="text-muted-foreground hover:text-destructive transition-colors p-2"
              >
                <LogOut size={20} strokeWidth={1.5} />
              </button>
            }
          />
          <TooltipContent side="right">
            <p>Sign Out</p>
          </TooltipContent>
        </Tooltip>

        <Avatar className="w-8 h-8 cursor-pointer border border-border">
          <AvatarImage src={clerkUser?.imageUrl} alt={clerkUser?.fullName || "User Avatar"} />
          <AvatarFallback className="text-[10px] font-medium text-muted-foreground bg-muted">
            {clerkUser?.firstName?.charAt(0) || "ME"}
          </AvatarFallback>
        </Avatar>
      </div>
    </nav>
  );
}

import { ReactNode } from "react";
import Link from "next/link";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-[#FAFAFA] min-h-screen w-full flex flex-col antialiased font-sans">
      <header className="w-full px-6 py-8 flex justify-between items-center max-w-[1400px] mx-auto">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="size-8 rounded-xl bg-neutral-900 flex items-center justify-center transition-transform group-hover:scale-105 active:scale-95 shadow-lg shadow-neutral-900/10">
            <span className="text-white font-bold text-lg leading-none">M</span>
          </div>
          <span className="text-lg font-medium tracking-tight text-neutral-900 group-hover:opacity-80 transition-opacity">
            Mood Journal
          </span>
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center p-6 sm:p-12 relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neutral-200/20 blur-[100px] rounded-full -z-10" />
        <div className="w-full max-w-md relative z-10 animate-fade-in">
          {children}
        </div>
      </main>
      <footer className="w-full px-6 py-8 text-center text-xs text-neutral-400 font-medium tracking-wide uppercase">
        © {new Date().getFullYear()} Mood Journal — The art of reflection.
      </footer>
    </div>
  );
}

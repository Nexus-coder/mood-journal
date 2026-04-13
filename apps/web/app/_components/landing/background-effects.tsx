"use client";

export function BackgroundEffects() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-grid opacity-50"></div>
      
      {/* Ambient Blur Orbs */}
      <div className="absolute top-[-10%] left-[-5%] size-[40vw] bg-emerald-100/40 dark:bg-emerald-500/10 rounded-full blur-[80px] mix-blend-multiply dark:mix-blend-soft-light animate-blob"></div>
      <div className="absolute bottom-[-10%] right-[-5%] size-[45vw] bg-blue-100/40 dark:bg-blue-500/10 rounded-full blur-[80px] mix-blend-multiply dark:mix-blend-soft-light animate-blob-delay"></div>
      <div className="absolute top-[20%] right-[15%] size-[30vw] bg-amber-100/30 dark:bg-amber-500/10 rounded-full blur-[80px] mix-blend-multiply dark:mix-blend-soft-light animate-blob-delay-2"></div>
    </div>
  );
}

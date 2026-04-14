"use client";

import {
  Sparkles,
  PenLine,
  Moon,
  Zap,
  Tag,
  LayoutGrid,
  BarChart3,
  Activity,
  BrainCircuit,
  ShieldCheck,
  Database,
  FileText,
} from "lucide-react";

const featureGroups = [
  {
    badge: "01 — Write",
    heading: "AI-Powered Journaling",
    description:
      "A rich, distraction-free canvas that thinks alongside you — analysing every word as you write.",
    accent: "from-violet-500/20 via-primary/10 to-transparent",
    iconBg: "bg-violet-500/10 text-violet-500 dark:text-violet-400",
    features: [
      {
        icon: PenLine,
        title: "Rich Text Editor",
        body: "Tiptap 3 powers a beautiful writing experience with a floating Bubble Menu, headings, lists, blockquotes, and JSON-based storage.",
      },
      {
        icon: Moon,
        title: "Midnight Dark Mode",
        body: "A premium, high-contrast aesthetic optimised for late-night journaling, built on semantic CSS variables for effortless theming.",
      },
      {
        icon: Zap,
        title: "Real-time Sentiment",
        body: "OpenAI GPT-4o-mini analyses your entries on the fly, surfacing instant feedback — Positive, Neutral, or Anxious — before you even finish the page.",
      },
      {
        icon: Tag,
        title: "Automatic Tagging",
        body: "The AI silently generates relevant tags (#productivity, #anxiety, #growth) for every entry so your journal is always organised.",
      },
      {
        icon: LayoutGrid,
        title: "Full CRUD",
        body: "Create, view, edit, and delete entries with ease. Every action is instant thanks to Convex's real-time database.",
      },
    ],
  },
  {
    badge: "02 — Reflect",
    heading: "Live Analytics & Trends",
    description:
      "Turn three months of feelings into a single glance at your emotional trajectory.",
    accent: "from-emerald-500/20 via-teal-500/10 to-transparent",
    iconBg: "bg-emerald-500/10 text-emerald-500 dark:text-emerald-400",
    features: [
      {
        icon: Activity,
        title: "7-Day Heartbeat",
        body: "A mini mood chart in the sidebar shows your writing consistency and emotional shifts at a glance — no dashboard required.",
      },
      {
        icon: BarChart3,
        title: "Sentiment Intensity",
        body: "A 30-day area chart tracks your emotional trajectory so you can spot patterns, regressions, and breakthroughs over time.",
      },
      {
        icon: BrainCircuit,
        title: "AI Monthly Insight",
        body: "A heuristic-based executive summary interprets your 30-day data into plain language — your personal emotional debrief.",
      },
    ],
  },
  {
    badge: "03 — Trust",
    heading: "Secure & Personalized",
    description:
      "Enterprise-grade infrastructure so you can write freely, knowing your thoughts are always private.",
    accent: "from-sky-500/20 via-blue-500/10 to-transparent",
    iconBg: "bg-sky-500/10 text-sky-500 dark:text-sky-400",
    features: [
      {
        icon: ShieldCheck,
        title: "Clerk Authentication",
        body: "Enterprise-grade security with seamless sign-in / sign-up flows. Your journal is locked behind a verified identity.",
      },
      {
        icon: Database,
        title: "Convex Real-time Backend",
        body: "A lightning-fast, reactive database keeps your entries in sync across every device — instantly, without polling.",
      },
      {
        icon: FileText,
        title: "Daily Prompts",
        body: "Curated prompts surface every day so you always have a thoughtful starting point, even on blank-page days.",
      },
    ],
  },
];

export function FeaturesSection() {
  return (
    <section
      id="features"
      className="w-full bg-background relative overflow-hidden"
    >
      {/* Subtle top separator */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-20 bg-gradient-to-b from-transparent via-border to-transparent" />

      <div className="max-w-[1200px] mx-auto px-6 sm:px-12 py-24 sm:py-36 space-y-28">

        {/* Section header */}
        <div className="text-center max-w-xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border/60 bg-muted/40 text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground mb-6">
            <Sparkles className="size-3 text-primary" />
            Everything you need
          </div>
          <h2 className="text-4xl sm:text-5xl font-medium tracking-tighter text-foreground leading-[1.08] mb-4">
            Built for depth,<br className="hidden sm:block" /> not volume.
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            Three pillars designed to take you from blank page to genuine
            emotional clarity — powered by AI, stored in real-time.
          </p>
        </div>

        {/* Feature groups */}
        {featureGroups.map((group, gi) => (
          <div key={gi} className="space-y-10" id={gi === 2 ? "security" : undefined}>
            {/* Group heading row */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pb-6 border-b border-border/50">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground mb-2">
                  {group.badge}
                </p>
                <h3 className="text-2xl sm:text-3xl font-medium tracking-tight text-foreground leading-tight">
                  {group.heading}
                </h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs sm:text-right">
                {group.description}
              </p>
            </div>

            {/* Cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {group.features.map((feat, fi) => {
                const Icon = feat.icon;
                return (
                  <div
                    key={fi}
                    className={`
                      relative group rounded-3xl border border-border/60 bg-card p-7
                      hover:border-border hover:shadow-xl hover:shadow-black/5
                      dark:hover:shadow-black/30 transition-all duration-300
                      ${fi === 0 && group.features.length === 5 ? "sm:col-span-2 lg:col-span-1" : ""}
                    `}
                  >
                    {/* Gradient accent */}
                    <div
                      className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${group.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
                    />
                    <div className="relative">
                      <div
                        className={`size-10 rounded-2xl flex items-center justify-center mb-5 ${group.iconBg}`}
                      >
                        <Icon className="size-5" />
                      </div>
                      <h4 className="text-sm font-semibold text-foreground mb-2 tracking-tight">
                        {feat.title}
                      </h4>
                      <p className="text-[13px] text-muted-foreground leading-relaxed">
                        {feat.body}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Bottom CTA strip */}
        <div className="rounded-3xl border border-border/60 bg-gradient-to-br from-primary/5 via-card to-card p-10 sm:p-14 flex flex-col sm:flex-row items-center justify-between gap-8 text-center sm:text-left">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground mb-2">
              Ready to start?
            </p>
            <h3 className="text-2xl sm:text-3xl font-medium tracking-tight text-foreground">
              Your clarity is one entry away.
            </h3>
          </div>
          <a
            href="/signup"
            className="shrink-0 inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 rounded-full text-sm font-semibold hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-primary/20"
          >
            Start journaling — it&apos;s free
          </a>
        </div>
      </div>
    </section>
  );
}

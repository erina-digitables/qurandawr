import { Flame } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Tone = "neutral" | "accent" | "success" | "warning" | "danger" | "highlight" | "glass";

// Tone fills always carry ink text, so they read the same in both themes.
const tones: Record<Tone, string> = {
  neutral: "bg-surface-2 text-text-muted",
  accent: "bg-slate text-ink",
  success: "bg-sage text-ink",
  warning: "bg-sand text-ink",
  danger: "bg-clay text-ink",
  highlight: "bg-sand text-ink",
  /** For badges that sit on a toned card. */
  glass: "bg-white/70 text-ink",
};

export function Badge({ tone = "neutral", icon, children, className }: { tone?: Tone; icon?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex h-7 items-center gap-1 rounded-pill px-3 text-xs font-bold [&_svg]:size-3.5", tones[tone], className)}>
      {icon}
      {children}
    </span>
  );
}

export function CodeTag({ children }: { children: ReactNode }) {
  return <span className="inline-flex h-7 items-center rounded-pill bg-surface-2 px-2.5 font-mono text-xs font-bold text-text-muted">{children}</span>;
}

export function StreakPill({ days, atRisk }: { days: number; atRisk?: boolean }) {
  const live = days > 0;
  return (
    <span
      title={atRisk ? "Finish today to keep it" : undefined}
      className={cn(
        "inline-flex h-11 items-center gap-1.5 rounded-pill border px-4 text-sm font-bold [&_svg]:size-4",
        live ? "border-transparent bg-sand text-ink" : "border-border bg-surface text-text-muted",
        atRisk && "border-dashed border-ink/50",
      )}
    >
      <Flame aria-hidden fill={live ? "currentColor" : "none"} />
      <span className="sr-only">Streak: </span>
      {days} {days === 1 ? "day" : "days"}
    </span>
  );
}

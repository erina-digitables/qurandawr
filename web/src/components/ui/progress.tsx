import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { Badge } from "./badge";
import { IconButton, iconButtonClass } from "./button";

export function ProgressBar({ value, max, label }: { value: number; max: number; label: string }) {
  const pct = Math.min(100, Math.round((value / Math.max(max, 1)) * 100));
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuenow={Math.min(value, max)}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuetext={`${value} of ${max} quarters`}
      className="h-2.5 w-full overflow-hidden rounded-pill bg-white/60"
    >
      <div className="h-full rounded-pill bg-forest transition-[width] duration-(--t-duration-base) ease-out" style={{ width: `${pct}%` }} />
    </div>
  );
}

/** Round meter, like a fitness ring. Decorative: the bar under it carries the numbers for screen readers. */
function Ring({ value, max }: { value: number; max: number }) {
  const pct = Math.min(1, value / Math.max(max, 1));
  const r = 42;
  const c = 2 * Math.PI * r;
  return (
    <div aria-hidden className="relative grid size-28 shrink-0 place-items-center">
      <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90">
        <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,.65)" strokeWidth="9" />
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke="#1f3d33"
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={`${c * pct} ${c}`}
          opacity={pct > 0 ? 1 : 0}
          className="transition-[stroke-dasharray] duration-(--t-duration-base)"
        />
      </svg>
      <span className="grid size-[72px] place-items-center rounded-pill bg-white text-center">
        <span className="font-display text-xl leading-none text-ink">{Math.round(pct * 100)}%</span>
      </span>
    </div>
  );
}

export function GoalCard({ title, done, target, eyebrow = "Today's portion" }: { title: string; done: number; target: number; eyebrow?: string }) {
  const met = done >= target;
  const status = done === 0 ? "Not started" : met ? "Goal met" : "In progress";
  return (
    <section aria-labelledby="goal-title" className={cn("flex flex-col gap-5 rounded-xl p-5 text-ink sm:p-6", met ? "bg-sage" : "bg-slate")}>
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="glass">{eyebrow}</Badge>
        <Badge tone={met ? "glass" : done ? "warning" : "glass"}>{status}</Badge>
      </div>
      <div className="flex items-center gap-4">
        <div className="min-w-0 flex-1">
          <h2 id="goal-title" className="font-display text-xl text-ink">
            {title}
          </h2>
          <p className="mt-2 text-sm text-ink/75">
            <span className="font-display text-display text-ink">{done}</span>
            <span className="font-display text-lg text-ink/75">/{target}</span>
            <span className="sr-only"> </span>
            <span className="block">
              {done} of {target} quarters read
              {done > target && " · beyond today's goal"}
            </span>
          </p>
        </div>
        <Ring value={done} max={target} />
      </div>
      <ProgressBar value={done} max={target} label="Today's progress" />
      {met && (
        <div role="status" className="flex items-center gap-3 rounded-lg bg-white/70 p-4">
          <span className="grid size-11 shrink-0 place-items-center rounded-pill bg-ink text-white">
            <Sparkles aria-hidden className="size-5" />
          </span>
          <div>
            <p className="font-display text-base font-semibold">Goal met</p>
            <p className="text-sm text-ink/75">That&apos;s the day&apos;s portion done. Barakallahu feek.</p>
          </div>
        </div>
      )}
    </section>
  );
}

export function DateNavigator({
  label,
  date,
  onPrev,
  onNext,
  prevHref,
  nextHref,
  isToday,
  size = "lg",
}: {
  /** "md" for long labels such as "Week of 2 Nov". */
  size?: "lg" | "md";
  label: string;
  date: string;
  onPrev?: () => void;
  onNext?: () => void;
  /** Link-based navigation (server pages). Takes precedence over the callbacks. */
  prevHref?: string;
  nextHref?: string;
  isToday?: boolean;
}) {
  return (
    <div className="flex items-end justify-between gap-3">
      <p aria-live="polite" className="min-w-0 px-1">
        <span className={cn("block truncate font-display text-text", size === "lg" ? "text-display" : "text-xl")}>{label}</span>
        <span className="block text-sm font-semibold text-text-muted">{date}</span>
      </p>
      <div className="flex shrink-0 gap-2">
        {prevHref ? (
          <Link href={prevHref} aria-label="Previous day" title="Previous day" className={iconButtonClass()}>
            <ChevronLeft aria-hidden />
          </Link>
        ) : (
          <IconButton label="Previous day" onClick={onPrev}>
            <ChevronLeft aria-hidden />
          </IconButton>
        )}
        {nextHref && !isToday ? (
          <Link href={nextHref} aria-label="Next day" title="Next day" className={iconButtonClass()}>
            <ChevronRight aria-hidden />
          </Link>
        ) : (
          <IconButton label="Next day" onClick={onNext} disabled={isToday}>
            <ChevronRight aria-hidden />
          </IconButton>
        )}
      </div>
    </div>
  );
}

/** A week of round day chips (Mo Tu We...). The picked day is ink; days after today are not links. */
export function WeekStrip({
  days,
}: {
  days: { href: string; short: string; num: number; full: string; selected: boolean; future: boolean; dot?: "met" | "some" }[];
}) {
  return (
    <ol aria-label="This week" className="grid grid-cols-7 gap-1.5">
      {days.map((d) => {
        const inner = (
          <>
            <span className="sr-only">{d.full}</span>
            <span aria-hidden className="text-[11px] font-bold uppercase">{d.short}</span>
            <span aria-hidden className="font-display text-base font-semibold leading-none">{d.num}</span>
            <span
              aria-hidden
              className={cn(
                "size-1.5 rounded-pill",
                d.dot === "met" ? (d.selected ? "bg-sage" : "bg-success") : d.dot === "some" ? (d.selected ? "bg-sand" : "bg-warning") : "bg-transparent",
              )}
            />
          </>
        );
        const cls = cn(
          "flex h-[70px] flex-col items-center justify-center gap-1 rounded-pill border transition-colors",
          d.selected
            ? "border-accent bg-accent text-on-accent"
            : d.future
              ? "border-dashed border-border bg-transparent text-text-muted"
              : "border-border bg-surface text-text hover:bg-surface-2",
        );
        return (
          <li key={d.href}>
            {d.future ? (
              <span className={cls}>
                {inner}
              </span>
            ) : (
              <Link href={d.href} aria-current={d.selected ? "date" : undefined} className={cls}>
                {inner}
              </Link>
            )}
          </li>
        );
      })}
    </ol>
  );
}

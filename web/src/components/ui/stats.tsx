"use client";

import { ChevronRight, Trash2, Trophy } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Badge } from "./badge";
import { IconButton } from "./button";

export type Tone =
  "sand" | "stone" | "slate" | "sage" | "wheat" | "clay" | "moss" | "mist";
const toneBg: Record<Tone, string> = {
  sand: "bg-sand",
  stone: "bg-stone",
  slate: "bg-slate",
  sage: "bg-sage",
  wheat: "bg-wheat",
  clay: "bg-clay",
  moss: "bg-moss",
  mist: "bg-mist",
};

/** Colour-blocked tile: label and icon on top, one big number, one line of context. */
export function StatCard({
  label,
  value,
  unit,
  sub,
  icon,
  tone = "slate",
}: {
  label: string;
  value: string;
  unit?: string;
  sub: string;
  icon: ReactNode;
  tone?: Tone;
}) {
  return (
    <div
      className={cn(
        "flex min-h-40 flex-col gap-1 rounded-xl p-4 text-ink",
        toneBg[tone],
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-sm font-bold">{label}</span>
        <span
          aria-hidden
          className="grid size-9 shrink-0 place-items-center rounded-pill bg-white/70 [&_svg]:size-4"
        >
          {icon}
        </span>
      </div>
      <p className="mt-auto font-display text-display leading-none">
        {value}{" "}
        {unit && <span className="text-sm font-bold text-ink/70">{unit}</span>}
      </p>
      <p className="text-xs font-semibold text-ink/75">{sub}</p>
    </div>
  );
}

export type DayBar = { day: string; full: string; value: number };

/**
 * Round the chart's top up to a tidy number and pick 3-5 gridlines.
 * Steps of 4 are tried before 5, so bigger goals tend to land on whole juz.
 */
export function quarterScale(max: number) {
  const steps = [1, 2, 4, 5, 10, 20, 40, 50, 100, 200, 500];
  const step = steps.find((s) => max / s <= 4) ?? Math.ceil(max / 4);
  const top = Math.ceil(max / step) * step;
  return {
    top,
    ticks: Array.from({ length: top / step + 1 }, (_, i) => i * step),
  };
}

export function WeeklyBarChart({
  data,
  goal,
  selected,
  onSelect,
}: {
  data: DayBar[];
  goal: number;
  selected?: number;
  onSelect?: (i: number) => void;
}) {
  const { top, ticks } = quarterScale(
    Math.max(goal * 1.5, ...data.map((d) => d.value), 1),
  );
  const goalPct = (goal / top) * 100;
  return (
    <figure className="flex flex-col gap-2">
      <div className="flex gap-2 pt-2">
        {/* Y axis: quarter counts, spaced to suit the daily goal. */}
        <div
          aria-hidden
          className="relative h-44 w-6 shrink-0 font-mono text-xs font-semibold text-text-muted"
        >
          {ticks.map((t) => (
            <span
              key={t}
              className="absolute right-0 translate-y-1/2 leading-none"
              style={{ bottom: `${(t / top) * 100}%` }}
            >
              {t}
            </span>
          ))}
        </div>
        <div className="relative h-44 flex-1">
          {ticks.map((t) => (
            <div
              key={t}
              aria-hidden
              className="absolute inset-x-0 border-t border-border"
              style={{ bottom: `${(t / top) * 100}%` }}
            />
          ))}
          <div
            aria-hidden
            className="absolute inset-x-0 border-t-2 border-dashed border-text-muted/60"
            style={{ bottom: `${goalPct}%` }}
          >
            <span className="absolute -top-7 right-0 rounded-pill bg-surface-2 px-2 py-0.5 text-xs font-bold text-text-muted">
              goal {goal}
            </span>
          </div>
          <div className="absolute inset-0 grid grid-cols-7 items-end gap-2.5">
            {data.map((d, i) => {
              const met = d.value >= goal;
              return (
                // The whole column is the hit area; the bar inside is only the picture.
                <button
                  key={d.day}
                  type="button"
                  onClick={() => onSelect?.(i)}
                  aria-label={`${d.full}: ${d.value} quarters${met ? ", goal met" : ""}`}
                  aria-pressed={selected === i}
                  className="flex h-full w-full items-end rounded-sm"
                >
                  <span
                    aria-hidden
                    className={cn(
                      "block w-full rounded-pill transition-[height] duration-(--t-duration-base)",
                      d.value === 0
                        ? "bg-border"
                        : met
                          ? "bg-text"
                          : "bg-slate",
                      selected === i &&
                        "outline-2 outline-offset-2 outline-focus",
                    )}
                    style={{
                      height:
                        d.value === 0
                          ? 8
                          : `max(12px, ${(d.value / top) * 100}%)`,
                    }}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <div
        aria-hidden
        className="ml-8 grid grid-cols-7 gap-2.5 text-center text-xs font-bold text-text-muted"
      >
        {data.map((d) => (
          <span key={d.day}>{d.day}</span>
        ))}
      </div>
      <figcaption className="sr-only">
        Quarters revised each day this week, against a goal of {goal}.
      </figcaption>
    </figure>
  );
}

export function DayRow({
  href = "#",
  date,
  done,
  target,
  juz,
  needsWork = 0,
  openLabel = "In progress",
  selected,
  onDelete,
}: {
  openLabel?: string;
  href?: string;
  date: string;
  done: number;
  target: number;
  juz: string;
  needsWork?: number;
  selected?: boolean;
  onDelete?: () => void;
}) {
  const met = done >= target;
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-lg border-2 bg-surface p-2 pl-2.5 shadow-card",
        selected ? "border-accent" : "border-transparent",
      )}
    >
      <Link
        href={href}
        aria-current={selected ? "date" : undefined}
        className="flex min-h-11 min-w-0 flex-1 items-center gap-3 rounded-sm"
      >
        <span
          className={cn(
            "grid size-13 shrink-0 place-items-center rounded-md font-mono text-base font-semibold text-ink",
            met ? "bg-sage" : "bg-sand",
          )}
        >
          {done}/{target}
        </span>
        <span className="min-w-0">
          <span className="block font-display text-base font-semibold text-text">
            {date}
          </span>
          <span className="flex flex-wrap items-center gap-2 text-xs text-text-muted">
            {met ? (
              <Badge tone="success" icon={<Trophy aria-hidden />}>
                Goal met
              </Badge>
            ) : (
              <Badge tone="neutral">{openLabel}</Badge>
            )}
            {juz}
            {needsWork > 0 && <Badge tone="danger">{needsWork} weak</Badge>}
          </span>
        </span>
        <ChevronRight
          aria-hidden
          className="ml-auto size-5 shrink-0 text-text-muted"
        />
      </Link>
      <IconButton label={`Delete log for ${date}`} onClick={onDelete}>
        <Trash2 aria-hidden />
      </IconButton>
    </div>
  );
}

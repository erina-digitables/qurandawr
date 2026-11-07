"use client";

import { AlertCircle, Check, Loader2 } from "lucide-react";
import { useId, useRef, type KeyboardEvent } from "react";
import { cn } from "@/lib/cn";
import { CodeTag } from "./badge";

export type Quality = "good" | "average" | "needs_work";

// Each rating owns a tone. Unpicked they show a dot of it; picked they fill with it.
const options: { value: Quality; label: string; on: string; dot: string }[] = [
  { value: "good", label: "Good", on: "bg-sage", dot: "bg-sage" },
  { value: "average", label: "Okay", on: "bg-sand", dot: "bg-sand" },
  { value: "needs_work", label: "Weak", on: "bg-clay", dot: "bg-clay" },
];

export function QualityGroup({
  quarterLabel,
  value,
  onChange,
  disabled,
  busy,
}: {
  quarterLabel: string;
  value: Quality | null;
  onChange: (q: Quality | null) => void;
  disabled?: boolean;
  /** Saving. Stays operable: disabling would throw keyboard focus off the card. */
  busy?: boolean;
}) {
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const focusIndex = Math.max(0, options.findIndex((o) => o.value === value));

  function onKey(e: KeyboardEvent, i: number) {
    const step = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const next = (i + step + options.length) % options.length;
    onChange(options[next].value);
    refs.current[next]?.focus();
  }

  return (
    <div className="flex flex-col gap-2">
      <div role="radiogroup" aria-label={`How did ${quarterLabel} go?`} aria-busy={busy || undefined} className="grid grid-cols-3 gap-2">
        {options.map((o, i) => {
          const checked = value === o.value;
          return (
            <button
              key={o.value}
              ref={(el) => {
                refs.current[i] = el;
              }}
              type="button"
              role="radio"
              aria-checked={checked}
              tabIndex={i === focusIndex ? 0 : -1}
              disabled={disabled}
              onClick={() => onChange(o.value)}
              onKeyDown={(e) => onKey(e, i)}
              className={cn(
                "inline-flex h-12 items-center justify-center gap-1.5 rounded-pill border-2 text-sm font-bold transition-colors duration-(--t-duration-fast) disabled:opacity-50",
                checked ? cn(o.on, "border-ink text-ink") : "border-transparent bg-surface-2 text-text hover:border-border-input",
              )}
            >
              {checked ? <Check aria-hidden className="size-4" /> : <span aria-hidden className={cn("size-2.5 rounded-pill", o.dot)} />}
              {o.label}
            </button>
          );
        })}
      </div>
      {value && (
        <button
          type="button"
          onClick={() => onChange(null)}
          disabled={disabled}
          className="relative min-h-6 self-start rounded-sm px-1 text-xs font-bold text-text-muted underline-offset-2 after:absolute after:-inset-x-2 after:-inset-y-2.5 after:content-[''] hover:text-text hover:underline"
        >
          Clear rating
        </button>
      )}
    </div>
  );
}

export function QuarterCard({
  title,
  subtitle,
  code,
  quality,
  onChange,
  saving,
  error,
}: {
  title: string;
  subtitle: string;
  code: string;
  quality: Quality | null;
  onChange: (q: Quality | null) => void;
  saving?: boolean;
  error?: boolean;
}) {
  const legendId = useId();
  const done = quality !== null;
  return (
    <fieldset
      aria-labelledby={legendId}
      className={cn(
        "flex min-w-0 flex-col gap-4 rounded-lg border-2 bg-surface p-4 shadow-card transition-colors duration-(--t-duration-base)",
        error ? "border-danger" : done ? "border-sage" : "border-transparent",
      )}
    >
      <div className="flex items-start gap-3">
        <span
          aria-hidden
          className={cn(
            "grid size-10 shrink-0 place-items-center rounded-pill border-2",
            done ? "border-ink bg-sage text-ink" : "border-border-input text-transparent",
          )}
        >
          {saving ? <Loader2 className="size-4 animate-spin text-text-muted" /> : <Check className="size-4" />}
        </span>
        <div className="min-w-0 flex-1">
          <legend id={legendId} className="font-display text-lg text-text">
            {title}
          </legend>
          <p className="text-sm text-text-muted">{subtitle}</p>
        </div>
        <CodeTag>{code}</CodeTag>
      </div>
      <QualityGroup quarterLabel={title} value={quality} onChange={onChange} busy={saving} />
      {error && (
        <p role="alert" className="flex items-center gap-1.5 text-xs font-bold text-danger">
          <AlertCircle aria-hidden className="size-4" /> Couldn&apos;t save. Tap a rating to try again.
        </p>
      )}
    </fieldset>
  );
}

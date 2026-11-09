"use client";

import { ArrowRight, Eraser, Search, Target, Wand2 } from "lucide-react";
import { useMemo, useState, useTransition } from "react";
import { savePlan, setDailyTarget, startReading } from "@/app/actions/revision";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/feedback";
import { JuzAccordion, PresetChips, TargetStepper } from "@/components/ui/target";
import { juzLabel, quarter, quarters, QUARTERS_PER_JUZ } from "@/lib/quarters";

const JUZ = Array.from({ length: 30 }, (_, i) => i + 1);

export function PlanBuilder({
  date,
  target: initialTarget,
  planned,
  done,
  locked,
  suggestion,
}: {
  date: string;
  target: number;
  planned: number[];
  done: number[];
  locked: boolean;
  suggestion: number[];
}) {
  const [target, setTarget] = useState(initialTarget);
  const [picked, setPicked] = useState(() => new Set(planned));
  const [query, setQuery] = useState("");
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const visibleJuz = useMemo(() => {
    const q = query.trim().toLowerCase().replace(/^juz\s*/, "");
    if (!q) return JUZ;
    return JUZ.filter((j) => String(j) === q || quarters.find((x) => x.juz === j)!.juzName.toLowerCase().includes(q));
  }, [query]);

  // Open the juz the user is working in, so the first screen is useful.
  const openJuz = useMemo(() => {
    const src = picked.size ? [...picked] : suggestion;
    return new Set(src.map((r) => quarter(r).juz));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function changeTarget(n: number) {
    setTarget(n);
    start(async () => {
      try {
        await setDailyTarget(n);
      } catch {
        setError("Couldn't save your target. Try again.");
      }
    });
  }

  function toggle(rub: number) {
    setPicked((s) => {
      const n = new Set(s);
      if (n.has(rub)) n.delete(rub);
      else n.add(rub);
      return n;
    });
  }

  function go() {
    setError(null);
    start(async () => {
      try {
        await startReading(date, [...picked].sort((a, b) => a - b));
      } catch (e) {
        // redirect() throws on success; only real failures land here
        if (!(e instanceof Error && e.message === "NEXT_REDIRECT")) setError("Couldn't save your plan. Try again.");
        else throw e;
      }
    });
  }

  function clearPlan() {
    setPicked(new Set());
    start(() => savePlan(date, [], false));
  }

  const count = picked.size;
  const diff = count - target;

  return (
    <div className="flex flex-col gap-5 pb-24">
      <section aria-labelledby="target-title" className="flex flex-col gap-5 rounded-xl bg-surface p-5 shadow-card sm:p-6">
        <div className="flex items-start gap-3">
          <span aria-hidden className="grid size-11 shrink-0 place-items-center rounded-pill bg-sand text-ink">
            <Target className="size-5" />
          </span>
          <div>
            <h2 id="target-title" className="font-display text-lg text-text">
              Daily goal
            </h2>
            <p className="text-sm text-text-muted">How many quarters a day keeps your streak going. Applies from today.</p>
          </div>
        </div>
        <TargetStepper value={target} onChange={changeTarget} />
        <PresetChips value={target} onChange={changeTarget} />
      </section>

      <section aria-labelledby="pick-title" className="flex flex-col gap-3">
        <div className="flex flex-col gap-1 px-1">
          <h2 id="pick-title" className="font-display text-lg text-text">
            Pick the quarters to read
          </h2>
          <p className="text-sm text-text-muted">Once you start, the checklist shows only these, so nothing else distracts you.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" size="sm" icon={<Wand2 aria-hidden className="size-4" />} onClick={() => setPicked(new Set(suggestion.slice(0, target)))}>
            Next {target} in order
          </Button>
          <Button variant="ghost" size="sm" icon={<Eraser aria-hidden className="size-4" />} onClick={() => setPicked(new Set())} disabled={!count}>
            Clear selection
          </Button>
        </div>
        <label className="relative block">
          <span className="sr-only">Find a juz by number or name</span>
          <Search aria-hidden className="pointer-events-none absolute left-5 top-1/2 size-4 -translate-y-1/2 text-text-muted" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find a juz: 12 or Wa Ma min"
            className="h-13 w-full rounded-pill border border-border-input bg-surface pl-11 pr-4 text-base text-text placeholder:text-text-muted focus-visible:bg-surface"
          />
        </label>
        {visibleJuz.length === 0 ? (
          <EmptyState icon={<Search />} title="No juz matches that" help="Try a number from 1 to 30, or part of the juz name." />
        ) : (
          <ul className="flex flex-col gap-2">
            {visibleJuz.map((j) => (
              <li key={j}>
                <JuzAccordion juz={j} name={quarters[(j - 1) * QUARTERS_PER_JUZ].juzName} selected={picked} onToggle={toggle} defaultOpen={openJuz.has(j) || visibleJuz.length === 1} />
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Selection bar: sticky so the main action is always one thumb away */}
      <div className="fixed inset-x-0 bottom-[84px] z-10 px-4 pb-[env(safe-area-inset-bottom)]">
        <div className="mx-auto flex max-w-(--container-column) items-center gap-3 rounded-pill bg-sand p-2 pl-5 text-ink shadow-pop">
          <p aria-live="polite" className="min-w-0 flex-1 text-sm">
            <span className="block font-bold">
              {count ? `${count} quarter${count === 1 ? "" : "s"} picked` : "Nothing picked yet"}
            </span>
            <span className="block text-xs text-ink/75">
              {count === 0
                ? `Your goal is ${target} (${juzLabel(target)})`
                : diff === 0
                  ? "Exactly your daily goal"
                  : diff > 0
                    ? `${diff} more than your goal`
                    : `${-diff} short of your goal`}
              {done.length > 0 && ` · ${done.length} already read`}
            </span>
          </p>
          {locked && !count ? (
            <Button variant="secondary" onClick={clearPlan} loading={pending} className="border-transparent bg-white text-ink hover:bg-white/90">
              Use suggestions
            </Button>
          ) : (
            <Button onClick={go} disabled={!count} loading={pending} className="bg-ink text-white hover:bg-ink/90" trailing={<ArrowRight aria-hidden className="size-4" />}>
              Start reading
            </Button>
          )}
        </div>
        {error && (
          <p role="alert" className="mx-auto mt-2 max-w-(--container-column) rounded-pill bg-surface px-4 py-2 text-sm font-bold text-danger shadow-card">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

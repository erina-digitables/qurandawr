import { ListChecks, SquareCheckBig } from "lucide-react";
import Link from "next/link";
import { WeekStrip } from "@/components/ui/progress";
import { cn } from "@/lib/cn";
import type { DaySummary } from "@/lib/data/types";
import { addDays, formatDay, weekStart, type ISODate } from "@/lib/dates";

/** Checklist / Plan for the same day. Links, because they are separate routes. */
export function DayTabs({ active, date }: { active: "today" | "plan"; date: string }) {
  const item = (href: string, label: string, Icon: typeof ListChecks, on: boolean) => (
    <Link
      href={href}
      aria-current={on ? "page" : undefined}
      className={cn(
        "flex min-h-11 flex-1 items-center justify-center gap-2 rounded-pill px-3 text-sm font-bold transition-colors",
        on ? "bg-accent text-on-accent" : "text-text-muted hover:text-text",
      )}
    >
      <Icon aria-hidden className="size-4" />
      {label}
    </Link>
  );
  return (
    <nav aria-label="Day" className="flex gap-1 rounded-pill bg-surface p-1 shadow-card">
      {item(`/today?date=${date}`, "Checklist", SquareCheckBig, active === "today")}
      {item(`/plan?date=${date}`, "Plan the day", ListChecks, active === "plan")}
    </nav>
  );
}

/** The Monday-to-Sunday week around `date`, as chips that open that day on `base`. */
export function DayWeek({ base, date, today, days }: { base: "/today" | "/plan"; date: ISODate; today: ISODate; days: DaySummary[] }) {
  const byDate = new Map(days.map((d) => [d.date, d]));
  const start = weekStart(date);
  return (
    <WeekStrip
      days={Array.from({ length: 7 }, (_, i) => {
        const d = addDays(start, i);
        const log = byDate.get(d);
        return {
          href: `${base}?date=${d}`,
          short: formatDay(d, { weekday: "short" }).slice(0, 2),
          num: Number(d.slice(8)),
          full: formatDay(d, { weekday: "long", day: "numeric", month: "long" }),
          selected: d === date,
          future: d > today,
          dot: log?.goalMet ? "met" : log && log.done > 0 ? "some" : undefined,
        };
      })}
    />
  );
}

import type { Metadata } from "next";
import { backend } from "@/lib/data";
import { requireUser, userToday } from "@/lib/session";
import { DayList } from "./day-list";

export const metadata: Metadata = { title: "History" };

export default async function HistoryPage() {
  const user = await requireUser();
  const days = await backend.listDays(user.id);
  const total = days.reduce((a, d) => a + d.done, 0);
  const met = days.filter((d) => d.goalMet).length;
  const juzCount = new Map<number, number>();
  for (const d of days) for (const j of d.juz) juzCount.set(j, (juzCount.get(j) ?? 0) + 1);
  const topJuz = [...juzCount.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];

  return (
    <section aria-labelledby="history-title" className="flex flex-col gap-5">
      <div className="px-1">
        <h1 id="history-title" className="font-display text-display text-text">
          History
        </h1>
        <p className="mt-1 text-sm text-text-muted">Every day you logged. Open one to see or change its ratings.</p>
      </div>
      <dl className="grid grid-cols-3 gap-2.5">
        {[
          ["Days", days.length, "bg-stone"],
          ["Goal met", met, "bg-sage"],
          ["Quarters", total, "bg-mist"],
        ].map(([k, v, bg]) => (
          <div key={k} className={`flex flex-col-reverse gap-1 rounded-lg px-3.5 py-4 text-ink ${bg}`}>
            <dt className="text-xs font-bold text-ink/75">{k}</dt>
            <dd className="font-display text-xl text-ink">{v}</dd>
          </div>
        ))}
      </dl>
      {topJuz && (
        <p className="flex items-center gap-2 px-1 text-sm text-text-muted">
          <span className="rounded-pill bg-sand px-3 py-1 text-xs font-bold text-ink">Most revised</span> Juz {topJuz}
        </p>
      )}
      <DayList days={days} today={userToday(user)} />
    </section>
  );
}

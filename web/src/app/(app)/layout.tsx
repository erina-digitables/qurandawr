import Link from "next/link";
import { backend } from "@/lib/data";
import { streak, streakAtRisk } from "@/lib/dawr";
import { requireUser, userToday } from "@/lib/session";
import { BottomNav, Chrome } from "./chrome";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const days = await backend.listDays(user.id);
  const today = userToday(user);
  return (
    <div className="mx-auto flex w-full max-w-(--container-column) flex-col gap-5 px-4 pb-32 pt-4 sm:pt-6">
      <Chrome email={user.isDemo || !user.email ? "Sample account" : user.email} streak={streak(days, today)} atRisk={streakAtRisk(days, today)} />
      <main id="main" className="flex flex-col gap-5">
        {children}
      </main>
      <footer className="pt-2 text-center text-xs text-text-muted">
        <Link className="underline underline-offset-2" href="/privacy">Privacy</Link> · Quarter start points: quran-meta (MIT) ·{" "}
        <a className="underline underline-offset-2" href="https://github.com/quran-center/quran-meta">
          source
        </a>
      </footer>
      <BottomNav />
    </div>
  );
}

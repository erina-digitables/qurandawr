import { redirect } from "next/navigation";
import { currentUser } from "@/lib/session";
import { ThemeButton } from "./theme-button";

/** Quiet shapes behind the headline, led by the rub el hizb star that marks quarters in the mushaf. Pure decoration. */
function Stickers() {
  return (
    <div aria-hidden className="pointer-events-none absolute -right-2 -top-4 h-36 w-44 select-none">
      <span className="absolute right-16 top-8 size-20 rotate-12 rounded-lg bg-sand" />
      <span className="absolute right-0 top-0 size-16 rounded-pill bg-slate" />
      <svg viewBox="0 0 100 100" className="absolute right-6 top-14 size-20 text-sage">
        <rect x="18" y="18" width="64" height="64" rx="6" fill="currentColor" />
        <rect x="18" y="18" width="64" height="64" rx="6" fill="currentColor" transform="rotate(45 50 50)" />
        <circle cx="50" cy="50" r="12" fill="none" stroke="#1a1c1a" strokeOpacity=".35" strokeWidth="3" />
      </svg>
    </div>
  );
}

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  if (await currentUser()) redirect("/today");
  return (
    <div className="relative mx-auto flex min-h-dvh w-full max-w-(--container-column) flex-col px-4 py-6">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2">
          <span aria-hidden className="grid size-11 place-items-center rounded-pill bg-forest font-display text-lg font-semibold text-white">
            م
          </span>
          <span className="font-display text-lg text-text">QMuraajah</span>
        </span>
        <ThemeButton />
      </div>
      <div className="relative mb-6 mt-10 px-1">
        <Stickers />
        <p className="relative max-w-[16rem] font-display text-display text-text">
          Keep your hifz <span className="font-normal text-text-muted">fresh,</span>
        </p>
        <p className="relative mt-2 text-sm text-text-muted">one quarter at a time.</p>
      </div>
      <main className="relative rounded-xl bg-surface p-5 shadow-card sm:p-6">{children}</main>
    </div>
  );
}

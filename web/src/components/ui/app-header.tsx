"use client";

import { LogOut, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { StreakPill } from "./badge";
import { IconButton } from "./button";

export function AppHeader({
  email,
  streak,
  atRisk,
  theme,
  onToggleTheme,
  signOutAction,
}: {
  email: string;
  streak: number;
  atRisk?: boolean;
  theme: "light" | "dark";
  onToggleTheme: () => void;
  /** Shown from tablet width up; on phones sign out is in Settings. */
  signOutAction?: () => void;
  active?: "history" | "settings";
}) {
  const initial = (email.trim()[0] ?? "D").toUpperCase();
  return (
    <header className="flex items-center gap-2 py-1">
      <Link href="/today" className="flex min-h-11 min-w-0 flex-1 items-center gap-3 rounded-pill">
        <span aria-hidden className="grid size-11 shrink-0 place-items-center rounded-pill bg-slate font-display text-lg font-semibold text-ink">
          {initial}
        </span>
        <span className="min-w-0">
          <span className="block text-xs text-text-muted">Assalamu alaikum</span>
          <span className="block truncate font-display text-base font-semibold text-text">{email}</span>
        </span>
      </Link>
      <StreakPill days={streak} atRisk={atRisk} />
      <IconButton label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"} onClick={onToggleTheme}>
        {theme === "dark" ? <Sun aria-hidden /> : <Moon aria-hidden />}
      </IconButton>
      {signOutAction && (
        <form action={signOutAction} className="hidden md:contents">
          <IconButton label="Sign out" type="submit">
            <LogOut aria-hidden />
          </IconButton>
        </form>
      )}
    </header>
  );
}

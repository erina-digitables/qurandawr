"use client";

import { BarChart3, History, House, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { signOut } from "@/app/actions/auth";
import { setTheme } from "@/app/actions/dawr";
import { AppHeader } from "@/components/ui/app-header";
import { cn } from "@/lib/cn";

function effectiveTheme(): "light" | "dark" {
  const set = document.documentElement.dataset.theme;
  if (set === "light" || set === "dark") return set;
  return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function Chrome({ email, streak, atRisk }: { email: string; streak: number; atRisk: boolean }) {
  const [theme, setLocal] = useState<"light" | "dark">("light");
  const [, start] = useTransition();
  useEffect(() => setLocal(effectiveTheme()), []);

  function toggle() {
    const next = effectiveTheme() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next; // instant; the action saves it
    setLocal(next);
    start(() => setTheme(next));
  }

  return <AppHeader email={email} streak={streak} atRisk={atRisk} theme={theme} onToggleTheme={toggle} signOutAction={signOut} />;
}

const links = [
  { href: "/today", label: "Today", icon: House, match: ["/today", "/plan"] },
  { href: "/stats", label: "Progress", icon: BarChart3, match: ["/stats"] },
  { href: "/history", label: "History", icon: History, match: ["/history"] },
  { href: "/settings", label: "Settings", icon: Settings, match: ["/settings"] },
];

/** Floating forest-green bar at the bottom: every screen is one thumb away. */
export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Main" className="fixed inset-x-0 bottom-0 z-20 px-4 pb-[max(12px,env(safe-area-inset-bottom))]">
      <ul className="mx-auto flex max-w-(--container-column) gap-1 rounded-pill bg-forest p-1.5 shadow-pop dark:bg-surface-2 dark:ring-1 dark:ring-white/10">
        {links.map(({ href, label, icon: Icon, match }) => {
          const on = match.some((m) => pathname.startsWith(m));
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={on ? "page" : undefined}
                className={cn(
                  "flex h-13 flex-col items-center justify-center gap-0.5 rounded-pill text-[11px] font-bold transition-colors duration-(--t-duration-fast) [&_svg]:size-5",
                  on ? "bg-white text-ink" : "text-white/75 hover:text-white",
                )}
              >
                <Icon aria-hidden />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

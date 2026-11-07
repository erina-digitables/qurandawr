"use client";

import { ArrowRight, PlayCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { startDemo } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

/** The browser's IANA time zone, so "today" matches the user's own calendar. */
export function TimezoneInput() {
  const [tz, setTz] = useState("UTC");
  useEffect(() => setTz(Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC"), []);
  return <input type="hidden" name="timezone" value={tz} />;
}

export function SubmitButton({ children, icon }: { children: React.ReactNode; icon?: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" block loading={pending} icon={icon} trailing={<ArrowRight aria-hidden className="size-4" />}>
      {children}
    </Button>
  );
}

export function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="rounded-lg bg-danger-soft px-4 py-3 text-sm font-semibold text-danger">
      {message}
    </p>
  );
}

export function AuthTabs({ active }: { active: "signin" | "signup" }) {
  const tab = (href: string, label: string, on: boolean) => (
    <Link
      href={href}
      aria-current={on ? "page" : undefined}
      className={cn(
        "flex min-h-11 flex-1 items-center justify-center rounded-pill text-sm font-bold transition-colors",
        on ? "bg-accent text-on-accent" : "text-text-muted hover:text-text",
      )}
    >
      {label}
    </Link>
  );
  return (
    <nav aria-label="Account" className="mb-6 flex gap-1 rounded-pill bg-surface-2 p-1">
      {tab("/signin", "Sign in", active === "signin")}
      {tab("/signup", "Create account", active === "signup")}
    </nav>
  );
}

function DemoSubmit() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="secondary" size="lg" block loading={pending} icon={<PlayCircle aria-hidden className="size-4" />} className="border-transparent bg-sand text-ink hover:bg-sand hover:brightness-95">
      Try it with sample data
    </Button>
  );
}

export function DemoForm() {
  return (
    <form action={startDemo} className="mt-6 flex flex-col gap-2 border-t-2 border-dashed border-border pt-6">
      <TimezoneInput />
      <DemoSubmit />
      <p className="text-center text-xs text-text-muted">Opens a private sandbox with two weeks of example revision. Nothing to sign up for.</p>
    </form>
  );
}

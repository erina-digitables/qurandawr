import { CheckCircle2, CircleAlert, Undo2 } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Button } from "./button";

export function Toast({ tone = "success", children, onUndo }: { tone?: "success" | "error"; children: ReactNode; onUndo?: () => void }) {
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className="flex w-full max-w-sm items-center gap-3 rounded-pill bg-ink p-2 pl-5 text-white shadow-pop"
    >
      {tone === "error" ? (
        <CircleAlert aria-hidden className="size-5 shrink-0 text-clay" />
      ) : (
        <CheckCircle2 aria-hidden className="size-5 shrink-0 text-sage" />
      )}
      <p className="flex-1 py-2 text-sm">{children}</p>
      {onUndo && (
        <Button size="sm" className="bg-white text-ink hover:bg-white/90" icon={<Undo2 aria-hidden className="size-4" />} onClick={onUndo}>
          Undo
        </Button>
      )}
    </div>
  );
}

export function EmptyState({ icon, title, help, action }: { icon: ReactNode; title: string; help: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-xl bg-surface px-6 py-12 text-center">
      <span aria-hidden className="grid size-16 place-items-center rounded-pill bg-sand text-ink [&_svg]:size-7">
        {icon}
      </span>
      <div>
        <p className="font-display text-lg text-text">{title}</p>
        <p className="mx-auto mt-1 max-w-xs text-sm text-text-muted">{help}</p>
      </div>
      {action}
    </div>
  );
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <section className={cn("rounded-xl bg-surface p-5 shadow-card sm:p-6", className)}>{children}</section>;
}

/** Section heading used across screens: a bold title, an optional one-line help. */
export function SectionTitle({ id, title, help, aside }: { id?: string; title: string; help?: string; aside?: ReactNode }) {
  return (
    <div className="flex items-end justify-between gap-3 px-1">
      <div className="min-w-0">
        <h2 id={id} className="font-display text-lg text-text">
          {title}
        </h2>
        {help && <p className="text-sm text-text-muted">{help}</p>}
      </div>
      {aside}
    </div>
  );
}

import { Loader2 } from "lucide-react";
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  // Ink pill: the one thing to do on a screen.
  primary: "bg-accent text-on-accent hover:bg-accent-hover",
  secondary: "bg-surface text-text border border-border hover:bg-surface-2",
  ghost: "bg-transparent text-text hover:bg-surface-2",
  danger: "bg-solid-danger text-on-solid hover:brightness-95",
};

const sizes: Record<Size, string> = {
  // 36px to look at, 44px to hit
  sm: "relative h-9 px-4 text-sm after:absolute after:-inset-1 after:content-['']",
  md: "h-11 px-5 text-sm",
  lg: "h-14 px-6 text-base",
};

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: ReactNode;
  /** Shown after the label, like the arrow on "Start →". */
  trailing?: ReactNode;
  block?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", loading, icon, trailing, block, className, children, disabled, type = "button", ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-pill font-bold select-none",
        "transition-[background-color,transform,filter] duration-(--t-duration-fast) active:scale-[.98]",
        "disabled:pointer-events-none disabled:opacity-40",
        variants[variant],
        sizes[size],
        block && "w-full",
        className,
      )}
      {...rest}
    >
      {loading ? <Loader2 aria-hidden className="size-4 animate-spin" /> : icon}
      {children}
      {trailing}
    </button>
  );
});

/** Round icon button: white circle on the canvas, ink when active. */
export const iconButtonClass = (active?: boolean) =>
  cn(
    "inline-grid size-11 shrink-0 place-items-center rounded-pill border transition-colors duration-(--t-duration-fast) [&_svg]:size-5",
    active ? "border-accent bg-accent text-on-accent" : "border-border bg-surface text-text hover:bg-surface-2",
  );

export function IconButton({
  label,
  active,
  className,
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { label: string; active?: boolean }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn(iconButtonClass(active), "disabled:pointer-events-none disabled:opacity-35", className)}
      {...rest}
    >
      {children}
    </button>
  );
}

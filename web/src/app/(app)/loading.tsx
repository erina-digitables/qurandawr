/** Skeleton shared by every signed-in screen while its data loads. */
export default function Loading() {
  return (
    // role=status so the label is allowed and announced (axe: aria-prohibited-attr on a bare div).
    <div role="status" aria-busy="true" aria-label="Loading" className="flex flex-col gap-5">
      <div className="h-24 animate-pulse rounded-xl bg-surface-2" />
      <div className="h-12 animate-pulse rounded-pill bg-surface-2" />
      <div className="h-48 animate-pulse rounded-xl bg-surface-2" />
      <div className="h-36 animate-pulse rounded-lg bg-surface-2" />
    </div>
  );
}

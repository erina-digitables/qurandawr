"use client";

import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ScreenError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div role="alert" className="flex flex-col items-start gap-3 rounded-xl bg-stone p-6 text-ink">
      <p className="font-display text-lg">This screen couldn&apos;t load</p>
      <p className="text-sm text-ink/75">Your saved revision is safe. Try again, and if it keeps happening, reload the page.</p>
      <Button className="bg-ink text-white hover:bg-ink/90" icon={<RotateCcw aria-hidden className="size-4" />} onClick={reset}>
        Try again
      </Button>
    </div>
  );
}

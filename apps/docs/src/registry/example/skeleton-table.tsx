import { Index } from "solid-js";

import { Skeleton } from "~/registry/ui/skeleton.tsx";

export default function SkeletonTable() {
  return (
    <div class="flex w-full max-w-sm flex-col gap-2">
      <Index each={Array.from({ length: 5 })}>
        {() => (
          <div class="flex gap-4">
            <Skeleton class="h-4 flex-1" />
            <Skeleton class="h-4 w-24" />
            <Skeleton class="h-4 w-20" />
          </div>
        )}
      </Index>
    </div>
  );
}

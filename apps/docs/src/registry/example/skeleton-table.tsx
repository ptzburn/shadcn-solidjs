import { Skeleton } from "~/registry/ui/skeleton.tsx";

import { Repeat } from "solid-js";

export default function SkeletonTable() {
  return (
    <div class="flex w-full max-w-sm flex-col gap-2">
      <Repeat count={5}>
        {() => (
          <div class="flex gap-4">
            <Skeleton class="h-4 flex-1" />
            <Skeleton class="h-4 w-24" />
            <Skeleton class="h-4 w-20" />
          </div>
        )}
      </Repeat>
    </div>
  );
}

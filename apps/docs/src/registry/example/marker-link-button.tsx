import { toast } from "solid-sonner";

import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";
import { Marker, MarkerContent, MarkerIcon } from "~/registry/ui/marker.tsx";

export default function MarkerLinkButtonDemo() {
  return (
    <div class="flex w-full max-w-sm flex-col gap-8 py-12">
      <Marker as="a" href="#links-and-buttons">
        <MarkerIcon>
          <IconPlaceholder
            lucide="git-branch"
            tabler="git-branch"
            ph="git-branch"
            ri="git-branch-line"
            hugeicons="git-branch"
          />
        </MarkerIcon>
        <MarkerContent>View the pull request</MarkerContent>
      </Marker>
      <Marker
        as="button"
        type="button"
        class="transition-colors hover:text-foreground"
        onClick={() => toast("You clicked the revert button")}
      >
        <MarkerIcon>
          <IconPlaceholder
            lucide="rotate-ccw"
            tabler="arrow-back-up"
            ph="arrow-counter-clockwise"
            ri="arrow-go-back-line"
            hugeicons="arrow-turn-backward"
          />
        </MarkerIcon>
        <MarkerContent>Revert this change</MarkerContent>
      </Marker>
    </div>
  );
}

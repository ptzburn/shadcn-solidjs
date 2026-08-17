import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";
import { Marker, MarkerContent, MarkerIcon } from "~/registry/ui/marker.tsx";
import { Spinner } from "~/registry/ui/spinner.tsx";

export default function MarkerDemo() {
  return (
    <div class="flex w-full max-w-sm flex-col gap-8 py-12">
      <Marker>
        <MarkerIcon>
          <IconPlaceholder
            lucide="git-branch"
            tabler="git-branch"
            ph="git-branch"
            ri="git-branch-line"
            hugeicons="git-branch"
          />
        </MarkerIcon>
        <MarkerContent>Switched to a new branch</MarkerContent>
      </Marker>
      <Marker role="status">
        <MarkerIcon>
          <Spinner />
        </MarkerIcon>
        <MarkerContent class="shimmer">Thinking...</MarkerContent>
      </Marker>
      <Marker variant="separator">
        <MarkerContent>Conversation compacted</MarkerContent>
      </Marker>
      <Marker>
        <MarkerIcon>
          <IconPlaceholder
            lucide="search"
            tabler="search"
            ph="magnifying-glass"
            ri="search-line"
            hugeicons="search-01"
          />
        </MarkerIcon>
        <MarkerContent>Explored 4 files</MarkerContent>
      </Marker>
    </div>
  );
}

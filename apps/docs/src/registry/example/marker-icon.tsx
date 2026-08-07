import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";
import { Marker, MarkerContent, MarkerIcon } from "~/registry/ui/marker.tsx";

export default function MarkerIconDemo() {
  return (
    <div class="flex w-full max-w-sm flex-col gap-12 py-12">
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
      <Marker variant="separator">
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
      <Marker class="flex-col">
        <MarkerIcon>
          <IconPlaceholder
            lucide="book-open-check"
            tabler="book"
            ph="book-open"
            ri="book-open-line"
            hugeicons="book-open-check"
          />
        </MarkerIcon>
        <MarkerContent>Syncing completed</MarkerContent>
      </Marker>
    </div>
  );
}

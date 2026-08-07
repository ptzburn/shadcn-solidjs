import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";
import { Marker, MarkerContent, MarkerIcon } from "~/registry/ui/marker.tsx";

export default function MarkerBorderDemo() {
  return (
    <div class="flex w-full max-w-sm flex-col gap-3 py-12">
      <Marker variant="border">
        <MarkerIcon>
          <IconPlaceholder
            lucide="git-branch"
            tabler="git-branch"
            ph="git-branch"
            ri="git-branch-line"
            hugeicons="git-branch"
          />
        </MarkerIcon>
        <MarkerContent>Switched to release-candidate</MarkerContent>
      </Marker>
      <Marker variant="border">
        <MarkerIcon>
          <IconPlaceholder
            lucide="search"
            tabler="search"
            ph="magnifying-glass"
            ri="search-line"
            hugeicons="search-01"
          />
        </MarkerIcon>
        <MarkerContent>Reviewed 8 related files</MarkerContent>
      </Marker>
      <Marker variant="border">
        <MarkerIcon>
          <IconPlaceholder
            lucide="file-text"
            tabler="file-text"
            ph="file-text"
            ri="file-text-line"
            hugeicons="file-02"
          />
        </MarkerIcon>
        <MarkerContent>Opened implementation notes</MarkerContent>
      </Marker>
    </div>
  );
}

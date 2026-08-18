import { GitHubLink } from "~/components/github-link.tsx";
import { MainNav } from "~/components/main-nav.tsx";
import { MobileNav } from "~/components/mobile-nav.tsx";
import { ModeSwitcher } from "~/components/mode-switcher.tsx";
import { Separator } from "~/registry/ui/separator.tsx";

// Reduced from main: SearchBar returns once it is re-ported onto the
// data-driven CommandDialog (main's version composed the old cmdk-solid
// API), and StyleSwitcher once the multi-style system is ported (this
// branch inlines the nova style only).
export function SiteHeader() {
  return (
    <header class="sticky top-0 z-50 w-full bg-background">
      <div class="container-wrapper px-6">
        <div class="**:data-[slot=separator]:self-center! flex h-(--header-height) items-center **:data-[slot=separator]:!h-4">
          <MobileNav class="flex lg:hidden" />
          <MainNav class="hidden lg:flex" />
          <div class="ml-auto flex items-center gap-2 md:flex-1 md:justify-end">
            <GitHubLink />
            <Separator orientation="vertical" />
            <ModeSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
}

import { GitHubLink } from "~/components/github-link.tsx";
import { MainNav } from "~/components/main-nav.tsx";
import { MobileNav } from "~/components/mobile-nav.tsx";
import { ModeSwitcher } from "~/components/mode-switcher.tsx";
import SearchBar from "~/components/search-bar.tsx";
import { Separator } from "~/registry/ui/separator.tsx";

export function SiteHeader() {
  return (
    <header class="sticky top-0 z-50 w-full bg-background">
      <div class="container-wrapper px-6">
        <div class="flex h-(--header-height) items-center **:data-[slot=separator]:self-center! **:data-[slot=separator]:!h-4">
          <MobileNav class="flex lg:hidden" />
          <MainNav class="hidden lg:flex" />
          <div class="ml-auto flex items-center gap-2 md:flex-1 md:justify-end">
            <div class="hidden w-full flex-1 md:flex md:w-auto md:flex-none">
              <SearchBar />
            </div>
            <Separator orientation="vertical" class="ml-2 hidden lg:block" />
            <GitHubLink />
            <Separator orientation="vertical" />
            <ModeSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
}

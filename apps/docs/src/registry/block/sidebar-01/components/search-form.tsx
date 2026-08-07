import type { ComponentProps } from "solid-js";

import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarInput,
} from "~/registry/ui/sidebar.tsx";

export function SearchForm(props: ComponentProps<"form">) {
  return (
    <form {...props}>
      <SidebarGroup class="py-0">
        <SidebarGroupContent class="relative">
          <label for="search" class="sr-only">
            Search
          </label>
          <SidebarInput
            id="search"
            placeholder="Search the docs..."
            class="pl-8"
          />
          <IconPlaceholder
            lucide="search"
            tabler="search"
            ph="magnifying-glass"
            ri="search-line"
            hugeicons="search-01"
            class="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 select-none opacity-50"
          />
        </SidebarGroupContent>
      </SidebarGroup>
    </form>
  );
}

import { createSignal, For } from "solid-js";

import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/registry/ui/dropdown-menu.tsx";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/registry/ui/sidebar.tsx";

export function VersionSwitcher(
  props: { versions: string[]; defaultVersion: string },
) {
  const [selectedVersion, setSelectedVersion] = createSignal(
    props.defaultVersion,
  );
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu placement="bottom-start">
          <DropdownMenuTrigger
            as={SidebarMenuButton}
            size="lg"
            class="data-expanded:bg-sidebar-accent data-expanded:text-sidebar-accent-foreground"
          >
            <div class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <IconPlaceholder
                lucide="file"
                tabler="file"
                ph="file"
                ri="file-line"
                hugeicons="file-01"
                class="size-4"
              />
            </div>
            <div class="flex flex-col gap-0.5 leading-none">
              <span class="font-semibold">Documentation</span>
              <span class="">v{selectedVersion()}</span>
            </div>
            <IconPlaceholder
              lucide="chevrons-up-down"
              tabler="selector"
              ph="caret-up-down"
              ri="expand-up-down-line"
              hugeicons="unfold-more"
              class="ml-auto"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent class="w-(--kb-popper-anchor-width)">
            <For each={props.versions}>
              {(version) => (
                <DropdownMenuItem onSelect={() => setSelectedVersion(version)}>
                  v{version} {version === selectedVersion() && (
                    <IconPlaceholder
                      lucide="check"
                      tabler="check"
                      ph="check"
                      ri="check-line"
                      hugeicons="tick-02"
                      class="ml-auto"
                    />
                  )}
                </DropdownMenuItem>
              )}
            </For>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

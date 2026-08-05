import { For, Show } from "solid-js";
import { A, useLocation } from "@solidjs/router";

import { docsConfig } from "~/config/docs.ts";
import { cn } from "~/lib/utils.ts";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/registry/ui/sidebar.tsx";

const menuButtonClass =
  "relative h-[30px] w-fit overflow-visible border border-transparent text-[0.8rem] font-medium after:absolute after:inset-x-0 after:-inset-y-1 after:z-0 after:rounded-md data-[active=true]:border-accent data-[active=true]:bg-accent";

export function DocsSidebar() {
  const location = useLocation();

  return (
    <Sidebar
      collapsible="none"
      class="sticky top-[calc(var(--header-height)+0.6rem)] z-30 hidden h-[calc(100svh-10rem)] overflow-hidden overscroll-none bg-transparent [--sidebar-menu-width:--spacing(56)] lg:flex"
    >
      <div class="absolute top-12 right-2 bottom-0 hidden h-full w-px bg-[linear-gradient(to_bottom,transparent_0%,var(--border)_10%,var(--border)_90%,transparent_100%)] lg:flex" />
      <SidebarContent
        data-docs-sidebar-content=""
        class="scroll-fade no-scrollbar w-(--sidebar-menu-width) overflow-x-hidden pl-2.5"
      >
        <For each={docsConfig.sidebarNav}>
          {(category, index) => (
            <SidebarGroup class={cn(index() === 0 && "pt-12")}>
              <SidebarGroupLabel class="font-medium text-muted-foreground">
                {category.title}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu class="gap-0.5">
                  <For each={category.items}>
                    {(item) => (
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          as={A}
                          href={item.href}
                          isActive={item.href === location.pathname}
                          class={menuButtonClass}
                        >
                          <span class="absolute inset-0 flex w-(--sidebar-menu-width) bg-transparent" />
                          {item.title}
                          <Show when={item.status}>
                            {(status) => (
                              <span
                                class="flex size-2 rounded-full bg-blue-500"
                                title={status()}
                              />
                            )}
                          </Show>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )}
                  </For>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )}
        </For>
      </SidebarContent>
    </Sidebar>
  );
}

import { docsConfig } from "~/config/docs.ts";

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
import { For } from "solid-js";

// The next-branch router stamps `data-active` (exact-or-prefix match, as a
// bare attribute) on every same-origin anchor itself and strips manual
// values on its sweeps, so the styles select on presence and no isActive
// bookkeeping is needed here.
const menuButtonClass =
  "relative h-[30px] w-fit overflow-visible border border-transparent text-[0.8rem] font-medium after:absolute after:inset-x-0 after:-inset-y-1 after:z-0 after:rounded-md data-active:border-accent data-active:bg-accent";

// Plain anchors instead of main's `A`: the next-branch router has no A
// component and intercepts every same-origin anchor click itself; external
// entries opt out with `rel="external"`.
export function DocsSidebar() {
  return (
    <Sidebar
      collapsible="none"
      class="[--sidebar-menu-width:--spacing(56)] sticky top-[calc(var(--header-height)+0.6rem)] z-30 hidden h-[calc(100svh-10rem)] overflow-hidden overscroll-none bg-transparent lg:flex"
    >
      <div class="absolute top-12 right-2 bottom-0 hidden h-full w-px bg-[linear-gradient(to_bottom,transparent_0%,var(--border)_10%,var(--border)_90%,transparent_100%)] lg:flex" />
      <SidebarContent
        data-docs-sidebar-content=""
        class="no-scrollbar scroll-fade w-(--sidebar-menu-width) overflow-x-hidden pl-2.5"
      >
        <SidebarGroup class="pt-12">
          <SidebarGroupLabel class="font-medium text-muted-foreground">
            Sections
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <For each={docsConfig.sectionsNav}>
                {(section) => (
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      as="a"
                      href={section.href}
                      class={menuButtonClass}
                    >
                      <span class="absolute inset-0 flex w-(--sidebar-menu-width) bg-transparent" />
                      {section.title}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
              </For>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <For each={docsConfig.sidebarNav}>
          {(category) => (
            <SidebarGroup>
              <SidebarGroupLabel class="font-medium text-muted-foreground">
                {category.title}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu class="gap-0.5">
                  <For each={category.items}>
                    {(item) => (
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          as="a"
                          href={item.href}
                          rel={item.external ? "external" : undefined}
                          class={menuButtonClass}
                        >
                          <span class="absolute inset-0 flex w-(--sidebar-menu-width) bg-transparent" />
                          {item.title}
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

import type { Component, ComponentProps } from "solid-js";
import { createSignal, For, Show } from "solid-js";
import { Dynamic } from "solid-js/web";

import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";
import { Avatar, AvatarFallback, AvatarImage } from "~/registry/ui/avatar.tsx";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/registry/ui/collapsible.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "~/registry/ui/dropdown-menu.tsx";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "~/registry/ui/sidebar.tsx";

type IconProps = ComponentProps<"svg">;

// The registry build rewrites every IconPlaceholder marker into a concrete
// icon import, so a marker has to be a literal tag. Wrapping each one in a
// tiny component is what lets the sample data below reference icons.
const GalleryVerticalEndIcon: Component<IconProps> = (props) => (
  <IconPlaceholder
    lucide="gallery-vertical-end"
    tabler="stack-2"
    ph="stack"
    ri="stack-line"
    hugeicons="layers-01"
    {...props}
  />
);

const AudioWaveformIcon: Component<IconProps> = (props) => (
  <IconPlaceholder
    lucide="audio-waveform"
    tabler="wave-sine"
    ph="wave-sine"
    ri="sound-module-line"
    hugeicons="audio-wave-01"
    {...props}
  />
);

const CommandIcon: Component<IconProps> = (props) => (
  <IconPlaceholder
    lucide="command"
    tabler="command"
    ph="command"
    ri="command-line"
    hugeicons="command"
    {...props}
  />
);

const SquareTerminalIcon: Component<IconProps> = (props) => (
  <IconPlaceholder
    lucide="square-terminal"
    tabler="terminal-2"
    ph="terminal-window"
    ri="terminal-box-line"
    hugeicons="computer-terminal-01"
    {...props}
  />
);

const BotIcon: Component<IconProps> = (props) => (
  <IconPlaceholder
    lucide="bot"
    tabler="robot"
    ph="robot"
    ri="robot-line"
    hugeicons="robotic"
    {...props}
  />
);

const BookOpenIcon: Component<IconProps> = (props) => (
  <IconPlaceholder
    lucide="book-open"
    tabler="book"
    ph="book-open"
    ri="book-open-line"
    hugeicons="book-open-01"
    {...props}
  />
);

const Settings2Icon: Component<IconProps> = (props) => (
  <IconPlaceholder
    lucide="settings-2"
    tabler="settings-2"
    ph="gear-fine"
    ri="settings-2-line"
    hugeicons="settings-02"
    {...props}
  />
);

const FrameIcon: Component<IconProps> = (props) => (
  <IconPlaceholder
    lucide="frame"
    tabler="frame"
    ph="frame-corners"
    ri="artboard-line"
    hugeicons="artboard"
    {...props}
  />
);

const PieChartIcon: Component<IconProps> = (props) => (
  <IconPlaceholder
    lucide="pie-chart"
    tabler="chart-pie"
    ph="chart-pie"
    ri="pie-chart-line"
    hugeicons="pie-chart"
    {...props}
  />
);

const MapIcon: Component<IconProps> = (props) => (
  <IconPlaceholder
    lucide="map"
    tabler="map"
    ph="map-trifold"
    ri="map-2-line"
    hugeicons="maps"
    {...props}
  />
);

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "https://github.com/shadcn.png",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEndIcon,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveformIcon,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: CommandIcon,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Playground",
      url: "#",
      icon: SquareTerminalIcon,
      isActive: true,
      items: [
        { title: "History", url: "#" },
        { title: "Starred", url: "#" },
        { title: "Settings", url: "#" },
      ],
    },
    {
      title: "Models",
      url: "#",
      icon: BotIcon,
      items: [
        { title: "Genesis", url: "#" },
        { title: "Explorer", url: "#" },
        { title: "Quantum", url: "#" },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpenIcon,
      items: [
        { title: "Introduction", url: "#" },
        { title: "Get Started", url: "#" },
        { title: "Tutorials", url: "#" },
        { title: "Changelog", url: "#" },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2Icon,
      items: [
        { title: "General", url: "#" },
        { title: "Team", url: "#" },
        { title: "Billing", url: "#" },
        { title: "Limits", url: "#" },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: FrameIcon,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChartIcon,
    },
    {
      name: "Travel",
      url: "#",
      icon: MapIcon,
    },
  ],
};

type Team = (typeof data.teams)[number];

function TeamSwitcher(props: { teams: Team[] }) {
  const { isMobile } = useSidebar();
  const [activeTeam, setActiveTeam] = createSignal<Team | undefined>(
    props.teams[0],
  );

  return (
    <Show when={activeTeam()}>
      {(team) => (
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu
              placement={isMobile() ? "bottom-start" : "right-start"}
            >
              <SidebarMenuButton
                as={DropdownMenuTrigger}
                size="lg"
                class="data-expanded:bg-sidebar-accent data-expanded:text-sidebar-accent-foreground"
              >
                <div class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Dynamic component={team().logo} class="size-4" />
                </div>
                <div class="grid flex-1 text-left text-sm leading-tight">
                  <span class="truncate font-medium">{team().name}</span>
                  <span class="truncate text-xs">{team().plan}</span>
                </div>
                <IconPlaceholder
                  lucide="chevrons-up-down"
                  tabler="selector"
                  ph="caret-up-down"
                  ri="expand-up-down-line"
                  hugeicons="unfold-more"
                  class="ml-auto"
                />
              </SidebarMenuButton>
              <DropdownMenuContent class="min-w-56 rounded-lg">
                <DropdownMenuGroup>
                  <DropdownMenuLabel class="text-xs text-muted-foreground">
                    Teams
                  </DropdownMenuLabel>
                  <For each={props.teams}>
                    {(item, index) => (
                      <DropdownMenuItem
                        onSelect={() => setActiveTeam(() => item)}
                        class="gap-2 p-2"
                      >
                        <div class="flex size-6 items-center justify-center rounded-md border">
                          <item.logo class="size-3.5 shrink-0" />
                        </div>
                        {item.name}
                        <DropdownMenuShortcut>
                          ⌘{index() + 1}
                        </DropdownMenuShortcut>
                      </DropdownMenuItem>
                    )}
                  </For>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem class="gap-2 p-2">
                    <div class="flex size-6 items-center justify-center rounded-md border bg-transparent">
                      <IconPlaceholder
                        lucide="plus"
                        tabler="plus"
                        ph="plus"
                        ri="add-line"
                        hugeicons="plus-sign"
                        class="size-4"
                      />
                    </div>
                    <div class="font-medium text-muted-foreground">
                      Add team
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      )}
    </Show>
  );
}

function NavMain(props: { items: typeof data.navMain }) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        <For each={props.items}>
          {(item) => (
            <SidebarMenuItem>
              <Collapsible
                class="group/collapsible"
                defaultOpen={item.isActive}
              >
                <SidebarMenuButton
                  as={CollapsibleTrigger}
                  tooltip={item.title}
                >
                  <item.icon />
                  <span>{item.title}</span>
                  <IconPlaceholder
                    lucide="chevron-right"
                    tabler="chevron-right"
                    ph="caret-right"
                    ri="arrow-right-s-line"
                    hugeicons="arrow-right-01"
                    class="ml-auto transition-transform duration-200 group-data-expanded/collapsible:rotate-90"
                  />
                </SidebarMenuButton>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    <For each={item.items}>
                      {(subItem) => (
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton href={subItem.url}>
                            <span>{subItem.title}</span>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      )}
                    </For>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </Collapsible>
            </SidebarMenuItem>
          )}
        </For>
      </SidebarMenu>
    </SidebarGroup>
  );
}

function NavProjects(props: { projects: typeof data.projects }) {
  const { isMobile } = useSidebar();

  return (
    <SidebarGroup class="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Projects</SidebarGroupLabel>
      <SidebarMenu>
        <For each={props.projects}>
          {(item) => (
            <SidebarMenuItem>
              <SidebarMenuButton as="a" href={item.url}>
                <item.icon />
                <span>{item.name}</span>
              </SidebarMenuButton>
              <DropdownMenu
                placement={isMobile() ? "bottom-end" : "right-start"}
              >
                <SidebarMenuAction as={DropdownMenuTrigger} showOnHover>
                  <IconPlaceholder
                    lucide="ellipsis"
                    tabler="dots"
                    ph="dots-three"
                    ri="more-line"
                    hugeicons="more-horizontal"
                  />
                  <span class="sr-only">More</span>
                </SidebarMenuAction>
                <DropdownMenuContent class="w-48 rounded-lg">
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <IconPlaceholder
                        lucide="folder"
                        tabler="folder"
                        ph="folder"
                        ri="folder-line"
                        hugeicons="folder-01"
                        class="text-muted-foreground"
                      />
                      <span>View Project</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <IconPlaceholder
                        lucide="forward"
                        tabler="arrow-forward-up"
                        ph="arrow-bend-up-right"
                        ri="share-forward-line"
                        hugeicons="forward-01"
                        class="text-muted-foreground"
                      />
                      <span>Share Project</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <IconPlaceholder
                        lucide="trash-2"
                        tabler="trash"
                        ph="trash"
                        ri="delete-bin-line"
                        hugeicons="delete-02"
                        class="text-muted-foreground"
                      />
                      <span>Delete Project</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          )}
        </For>
        <SidebarMenuItem>
          <SidebarMenuButton class="text-sidebar-foreground/70">
            <IconPlaceholder
              lucide="ellipsis"
              tabler="dots"
              ph="dots-three"
              ri="more-line"
              hugeicons="more-horizontal"
              class="text-sidebar-foreground/70"
            />
            <span>More</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}

function NavUser(props: { user: typeof data.user }) {
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu placement={isMobile() ? "bottom-end" : "right-end"}>
          <SidebarMenuButton
            as={DropdownMenuTrigger}
            size="lg"
            class="data-expanded:bg-sidebar-accent data-expanded:text-sidebar-accent-foreground"
          >
            <Avatar class="size-8 rounded-lg">
              <AvatarImage src={props.user.avatar} alt={props.user.name} />
              <AvatarFallback class="rounded-lg">CN</AvatarFallback>
            </Avatar>
            <div class="grid flex-1 text-left text-sm leading-tight">
              <span class="truncate font-medium">{props.user.name}</span>
              <span class="truncate text-xs">{props.user.email}</span>
            </div>
            <IconPlaceholder
              lucide="chevrons-up-down"
              tabler="selector"
              ph="caret-up-down"
              ri="expand-up-down-line"
              hugeicons="unfold-more"
              class="ml-auto size-4"
            />
          </SidebarMenuButton>
          <DropdownMenuContent class="min-w-56 rounded-lg">
            <DropdownMenuGroup>
              <DropdownMenuLabel class="p-0 font-normal">
                <div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar class="size-8 rounded-lg">
                    <AvatarImage
                      src={props.user.avatar}
                      alt={props.user.name}
                    />
                    <AvatarFallback class="rounded-lg">CN</AvatarFallback>
                  </Avatar>
                  <div class="grid flex-1 text-left text-sm leading-tight">
                    <span class="truncate font-medium">{props.user.name}</span>
                    <span class="truncate text-xs">{props.user.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <IconPlaceholder
                  lucide="sparkles"
                  tabler="sparkles"
                  ph="sparkle"
                  ri="sparkling-line"
                  hugeicons="sparkles"
                />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <IconPlaceholder
                  lucide="badge-check"
                  tabler="rosette-discount-check"
                  ph="seal-check"
                  ri="verified-badge-line"
                  hugeicons="checkmark-badge-02"
                />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconPlaceholder
                  lucide="credit-card"
                  tabler="credit-card"
                  ph="credit-card"
                  ri="bank-card-line"
                  hugeicons="credit-card"
                />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconPlaceholder
                  lucide="bell"
                  tabler="bell"
                  ph="bell"
                  ri="notification-3-line"
                  hugeicons="notification-01"
                />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <IconPlaceholder
                  lucide="log-out"
                  tabler="logout"
                  ph="sign-out"
                  ri="logout-box-r-line"
                  hugeicons="logout-01"
                />
                Log out
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

export default function SidebarDemo() {
  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <TeamSwitcher teams={data.teams} />
        </SidebarHeader>
        <SidebarContent>
          <NavMain items={data.navMain} />
          <NavProjects projects={data.projects} />
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={data.user} />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header class="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div class="flex items-center gap-2 px-4">
            <SidebarTrigger class="-ml-1" />
          </div>
        </header>
      </SidebarInset>
    </SidebarProvider>
  );
}

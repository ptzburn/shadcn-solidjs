import type { JSX } from "solid-js";
import { For } from "solid-js";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuDescription,
  NavigationMenuItem,
  NavigationMenuLabel,
  NavigationMenuLink,
  NavigationMenuTrigger,
} from "~/registry/ui/navigation-menu.tsx";

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Alert Dialog",
    href: "/docs/components/alert-dialog",
    description:
      "A modal dialog that interrupts the user with important content and expects a response.",
  },
  {
    title: "Hover Card",
    href: "/docs/components/hover-card",
    description:
      "For sighted users to preview content available behind a link.",
  },
  {
    title: "Progress",
    href: "/docs/components/progress",
    description:
      "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
  },
  {
    title: "Scroll-area",
    href: "/docs/components/scroll-area",
    description: "Visually or semantically separates content.",
  },
  {
    title: "Tabs",
    href: "/docs/components/tabs",
    description:
      "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
  },
  {
    title: "Tooltip",
    href: "/docs/components/tooltip",
    description:
      "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
  },
];

export default function NavigationMenuDemo() {
  return (
    <NavigationMenu>
      <NavigationMenuItem>
        <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
        <NavigationMenuContent class="w-96">
          <ListItem href="/docs" title="Introduction">
            Re-usable components built with Kobalte and Tailwind CSS.
          </ListItem>
          <ListItem href="/docs/installation/overview" title="Installation">
            How to install dependencies and structure your app.
          </ListItem>
          <ListItem href="/docs/dark-mode" title="Dark Mode">
            Adding dark mode to your site.
          </ListItem>
        </NavigationMenuContent>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuTrigger class="hidden md:inline-flex">
          Components
        </NavigationMenuTrigger>
        <NavigationMenuContent class="grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
          <For each={components}>
            {(component) => (
              <ListItem title={component.title} href={component.href}>
                {component.description}
              </ListItem>
            )}
          </For>
        </NavigationMenuContent>
      </NavigationMenuItem>
      <NavigationMenuTrigger as="a" href="/docs">
        Docs
      </NavigationMenuTrigger>
    </NavigationMenu>
  );
}

function ListItem(props: {
  title: string;
  href: string;
  children: JSX.Element;
}) {
  return (
    <NavigationMenuLink href={props.href}>
      <div class="flex flex-col gap-1 text-sm">
        <NavigationMenuLabel class="leading-none font-medium">
          {props.title}
        </NavigationMenuLabel>
        <NavigationMenuDescription class="line-clamp-2 text-muted-foreground">
          {props.children}
        </NavigationMenuDescription>
      </div>
    </NavigationMenuLink>
  );
}

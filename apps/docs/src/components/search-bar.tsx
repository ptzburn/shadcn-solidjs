import { useNavigate } from "@solidjs/router";
import { docsConfig } from "~/config/docs.ts";
import { Button } from "~/registry/ui/button.tsx";
import {
  CommandDialog,
  type CommandOption,
  type CommandOptionGroup,
} from "~/registry/ui/command.tsx";
import { createEffect, createSignal } from "solid-js";

import { IconArrowRight } from "./icons.tsx";

type NavItem = { title: string; href: string; external?: boolean };

const isEditableTarget = (target: EventTarget | null) =>
  target instanceof HTMLInputElement ||
  target instanceof HTMLTextAreaElement ||
  target instanceof HTMLSelectElement ||
  (target instanceof HTMLElement && target.isContentEditable);

const ComponentGlyph = () => (
  <div class="aspect-square size-4 rounded-full border border-dashed border-muted-foreground" />
);

const navigateOnSelect = (
  { href, external }: NavItem,
  navigate: ReturnType<typeof useNavigate>,
) => {
  if (external) {
    globalThis.location.assign(href);
  } else {
    navigate(href);
  }
};

export default function SearchBar() {
  const [open, setOpen] = createSignal(false);
  const navigate = useNavigate();

  createEffect(() => {}, () => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isToggle = event.key === "k" && (event.metaKey || event.ctrlKey);
      const isSlash = event.key === "/" && !isEditableTarget(event.target);
      if (!isToggle && !isSlash) return;
      event.preventDefault();
      setOpen((open) => !open);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  });

  const toOption = (item: NavItem, group: string): CommandOption => ({
    value: `${group}/${item.title}`,
    label: item.title,
    icon: () =>
      group === "Components" ? <ComponentGlyph /> : <IconArrowRight />,
    keywords: [group.toLowerCase()],
    onSelect: () => {
      setOpen(false);
      navigateOnSelect(item, navigate);
    },
  });

  const options: CommandOptionGroup[] = [
    {
      heading: "Pages",
      options: docsConfig.mainNav
        .filter((item) => !item.external)
        .map((item) => toOption(item, "Pages")),
    },
    ...docsConfig.sidebarNav.map((category) => ({
      heading: category.title,
      options: category.items.map((item) => toOption(item, category.title)),
    })),
  ];

  return (
    <>
      <Button
        variant="outline"
        class="relative h-8 w-full justify-start rounded-lg border-none bg-muted pl-3 text-foreground shadow-none transition-colors hover:bg-muted/50 md:w-48 lg:w-40 xl:w-64 dark:bg-card"
        onClick={() => setOpen(true)}
      >
        <span class="hidden xl:inline-flex">Search documentation...</span>
        <span class="inline-flex xl:hidden">Search...</span>
      </Button>
      <CommandDialog
        open={open()}
        onOpenChange={setOpen}
        title="Search documentation"
        description="Search for a page to open..."
        placeholder="Search documentation..."
        options={options}
      />
    </>
  );
}

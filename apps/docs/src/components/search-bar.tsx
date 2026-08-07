import { createEffect, createSignal, For, onCleanup } from "solid-js";
import { useNavigate } from "@solidjs/router";

import { docsConfig } from "~/config/docs.ts";
import { Button } from "~/registry/ui/button.tsx";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/registry/ui/command.tsx";

import { IconFile } from "./icons.tsx";

export default function SearchBar() {
  const [open, setOpen] = createSignal(false);

  createEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    onCleanup(() => document.removeEventListener("keydown", handleKeyDown));
  });

  const navigate = useNavigate();
  const redirect = (url: string) => {
    setOpen(false);
    navigate(url);
  };

  return (
    <>
      <Button
        id="search-trigger"
        variant="outline"
        class="relative h-8 w-full justify-start rounded-lg border-none bg-muted pl-3 font-normal text-foreground shadow-none transition-colors hover:bg-muted/50 md:w-48 lg:w-40 xl:w-64"
        onClick={() => setOpen(true)}
      >
        <span class="hidden xl:inline-flex">Search documentation...</span>
        <span class="inline-flex xl:hidden">Search...</span>
      </Button>
      <CommandDialog open={open()} onOpenChange={setOpen}>
        <Command>
          <CommandInput placeholder="Search documentation..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Links">
              <For each={docsConfig.mainNav.filter((item) => !item.external)}>
                {(item) => (
                  <CommandItem
                    value={item.title}
                    onSelect={() => redirect(item.href)}
                  >
                    <IconFile class="mr-2" />
                    {item.title}
                  </CommandItem>
                )}
              </For>
            </CommandGroup>
            <For each={docsConfig.sidebarNav}>
              {(category) => (
                <CommandGroup heading={category.title}>
                  <For each={category.items}>
                    {(item) => (
                      <CommandItem
                        value={item.title}
                        onSelect={() => redirect(item.href)}
                      >
                        <IconFile class="mr-2" />
                        {item.title}
                      </CommandItem>
                    )}
                  </For>
                </CommandGroup>
              )}
            </For>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}

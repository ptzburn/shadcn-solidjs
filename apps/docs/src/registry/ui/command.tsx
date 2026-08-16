import * as SearchPrimitive from "@kobalte/core/search";
import type { ComponentProps, JSX } from "@solidjs/web";
import { cn } from "~/lib/utils.ts";
import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";
import type { Component } from "solid-js";

import { createMemo, createSignal, omit, Show } from "solid-js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./dialog.tsx";

// Unlike upstream shadcn's compositional cmdk-based Command, this component
// is data-driven: items are passed as options and rendered by the Kobalte
// Search collection, which supplies filtering, keyboard navigation, and
// combobox semantics.
interface CommandOption {
  value: string;
  label?: string;
  icon?: () => JSX.Element;
  shortcut?: string;
  disabled?: boolean;
  keywords?: string[];
  onSelect?: (value: string) => void;
}

interface CommandOptionGroup {
  heading?: string;
  options: CommandOption[];
}

const commandFilter = (option: CommandOption, input: string) => {
  const needle = input.toLowerCase();
  return [option.label ?? option.value, ...(option.keywords ?? [])]
    .some((haystack) => haystack.toLowerCase().includes(needle));
};

const CommandItem: Component<
  SearchPrimitive.SearchRootItemComponentProps<CommandOption>
> = (props) => {
  return (
    <SearchPrimitive.Item
      item={props.item}
      data-slot="command-item"
      class="group/command-item relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden data-highlighted:*:[svg]:text-foreground [&_svg]:pointer-events-none data-disabled:pointer-events-none [&_svg]:shrink-0 in-data-[slot=dialog-content]:rounded-lg! data-highlighted:bg-muted data-highlighted:text-foreground data-disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4"
    >
      {props.item.rawValue.icon?.()}
      <SearchPrimitive.ItemLabel>
        {props.item.rawValue.label ?? props.item.rawValue.value}
      </SearchPrimitive.ItemLabel>
      <Show when={props.item.rawValue.shortcut}>
        <span
          data-slot="command-shortcut"
          class="ml-auto text-muted-foreground text-xs tracking-widest group-data-highlighted/command-item:text-foreground"
        >
          {props.item.rawValue.shortcut}
        </span>
      </Show>
    </SearchPrimitive.Item>
  );
};

const CommandSection: Component<
  SearchPrimitive.SearchRootSectionComponentProps<CommandOptionGroup>
> = (props) => {
  return (
    <Show when={props.section.rawValue.heading}>
      <SearchPrimitive.Section
        data-slot="command-group-heading"
        class="px-2 py-1.5 font-medium text-muted-foreground text-xs"
      >
        {props.section.rawValue.heading}
      </SearchPrimitive.Section>
    </Show>
  );
};

interface CommandProps {
  options: Array<CommandOption | CommandOptionGroup>;
  placeholder?: string;
  emptyMessage?: JSX.Element;
  onSelect?: (option: CommandOption) => void;
  filter?: (option: CommandOption, inputValue: string) => boolean;
  class?: string | undefined;
}

const Command: Component<CommandProps> = (props) => {
  const rest = omit(
    props,
    "options",
    "placeholder",
    "emptyMessage",
    "onSelect",
    "filter",
    "class",
  );
  // Search leaves filtering to the consumer (it targets async suggestions),
  // so the palette filters its own options; groups drop out when empty.
  const [query, setQuery] = createSignal("");
  const filtered = createMemo<Array<CommandOption | CommandOptionGroup>>(
    () => {
      const needle = query().trim();
      if (!needle) return props.options;
      const matches = props.filter ?? commandFilter;
      return props.options.flatMap(
        (entry): Array<CommandOption | CommandOptionGroup> => {
          if ("options" in entry) {
            const kept = entry.options.filter((option) =>
              matches(option, needle)
            );
            return kept.length ? [{ ...entry, options: kept }] : [];
          }
          return matches(entry, needle) ? [entry] : [];
        },
      );
    },
  );
  return (
    <SearchPrimitive.Root<CommandOption, CommandOptionGroup>
      data-slot="command"
      // The palette is an inline, always-open collection: selection executes
      // the item instead of persisting, so value stays pinned empty.
      open
      forceMount
      allowsEmptyCollection
      noResetInputOnBlur
      allowDuplicateSelectionEvents
      modal={false}
      closeOnSelection={false}
      value={null}
      onChange={(option) => {
        if (!option) return;
        option.onSelect?.(option.value);
        props.onSelect?.(option);
      }}
      itemComponent={CommandItem}
      sectionComponent={CommandSection}
      options={filtered()}
      onInputChange={setQuery}
      optionValue="value"
      optionTextValue={(option) => option.label ?? option.value}
      optionLabel={(option) => option.label ?? option.value}
      optionDisabled="disabled"
      optionGroupChildren="options"
      shouldFocusWrap
      class={cn(
        "flex size-full flex-col overflow-hidden rounded-xl! bg-popover p-1 text-popover-foreground",
        props.class,
      )}
      {...rest}
    >
      <div data-slot="command-input-wrapper" class="p-1 pb-0">
        <SearchPrimitive.Control class="flex h-8! items-center gap-2 rounded-lg! border border-input/30 bg-input/30 pl-2 shadow-none!">
          <IconPlaceholder
            lucide="search"
            tabler="search"
            ph="magnifying-glass"
            ri="search-line"
            hugeicons="search-01"
            class="size-4 shrink-0 opacity-50"
          />
          <SearchPrimitive.Input
            data-slot="command-input"
            placeholder={props.placeholder ?? "Type a command or search..."}
            class="w-full bg-transparent text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50"
          />
        </SearchPrimitive.Control>
      </div>
      <SearchPrimitive.Content
        data-slot="command-list"
        // Inline, not a popover: the important overrides beat Popper's
        // inline positioning styles.
        class="static! transform-none! w-full outline-none"
        onCloseAutoFocus={(event: Event) => event.preventDefault()}
      >
        <SearchPrimitive.Listbox class="no-scrollbar max-h-72 scroll-py-1 overflow-y-auto overflow-x-hidden p-1 outline-none" />
        <SearchPrimitive.NoResult
          data-slot="command-empty"
          class="py-6 text-center text-sm"
        >
          {props.emptyMessage ?? "No results found."}
        </SearchPrimitive.NoResult>
      </SearchPrimitive.Content>
    </SearchPrimitive.Root>
  );
};

type CommandDialogProps = ComponentProps<typeof Dialog> & CommandProps & {
  title?: string;
  description?: string;
};

const CommandDialog: Component<CommandDialogProps> = (props) => {
  const commandProps = () => ({
    options: props.options,
    placeholder: props.placeholder,
    emptyMessage: props.emptyMessage,
    onSelect: props.onSelect,
    filter: props.filter,
  });
  const dialogProps = omit(
    props,
    "title",
    "description",
    "options",
    "placeholder",
    "emptyMessage",
    "onSelect",
    "filter",
    "class",
  );
  return (
    <Dialog {...dialogProps}>
      <DialogHeader class="sr-only">
        <DialogTitle>{props.title ?? "Command Palette"}</DialogTitle>
        <DialogDescription>
          {props.description ?? "Search for a command to run..."}
        </DialogDescription>
      </DialogHeader>
      <DialogContent
        showCloseButton={false}
        class={cn(
          "top-1/3 translate-y-0 overflow-hidden rounded-xl! p-0",
          props.class,
        )}
      >
        <Command {...commandProps()} />
      </DialogContent>
    </Dialog>
  );
};

export { Command, CommandDialog, type CommandOption, type CommandOptionGroup };

import { useDialogContext } from "@kobalte/core/dialog";
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
import { InputGroup, InputGroupAddon } from "./input-group.tsx";

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

const keepInputFocus = (event: MouseEvent) => event.preventDefault();

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
      class="cn-command-item group/command-item [&_svg]:pointer-events-none data-disabled:pointer-events-none [&_svg]:shrink-0 data-disabled:opacity-50"
    >
      {props.item.rawValue.icon?.()}
      <SearchPrimitive.ItemLabel>
        {props.item.rawValue.label ?? props.item.rawValue.value}
      </SearchPrimitive.ItemLabel>
      <Show when={props.item.rawValue.shortcut}>
        <SearchPrimitive.ItemDescription
          as="span"
          data-slot="command-shortcut"
          class="cn-command-shortcut"
        >
          {props.item.rawValue.shortcut}
        </SearchPrimitive.ItemDescription>
      </Show>
    </SearchPrimitive.Item>
  );
};

const CommandSection: Component<
  SearchPrimitive.SearchRootSectionComponentProps<CommandOptionGroup>
> = (props) => {
  return (
    <>
      <Show when={props.section.index > 0}>
        <li
          role="separator"
          aria-orientation="horizontal"
          data-slot="command-separator"
          class="cn-command-separator my-1"
          onMouseDown={keepInputFocus}
        />
      </Show>
      <Show when={props.section.rawValue.heading}>
        <SearchPrimitive.Section
          data-slot="command-group-heading"
          cmdk-group-heading=""
          onMouseDown={keepInputFocus}
        >
          {props.section.rawValue.heading}
        </SearchPrimitive.Section>
      </Show>
    </>
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
  const [query, setQuery] = createSignal("");
  const filtered = createMemo<CommandOptionGroup[]>(() => {
    const needle = query().trim();
    const matches = props.filter ?? commandFilter;
    const keep = (option: CommandOption) => !needle || matches(option, needle);
    const groups: CommandOptionGroup[] = [];
    let loose: CommandOption[] | undefined;
    for (const entry of props.options) {
      if ("options" in entry) {
        loose = undefined;
        const kept = entry.options.filter(keep);
        if (kept.length) groups.push({ ...entry, options: kept });
      } else if (keep(entry)) {
        if (!loose) groups.push({ options: loose = [] });
        loose.push(entry);
      }
    }
    return groups;
  });
  return (
    <SearchPrimitive.Root<CommandOption, CommandOptionGroup>
      data-slot="command"
      open
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
      class={cn(
        "cn-command flex size-full flex-col overflow-hidden",
        props.class,
      )}
    >
      <SearchPrimitive.Control
        data-slot="command-input-wrapper"
        class="cn-command-input-wrapper"
      >
        <InputGroup class="cn-command-input-group">
          <SearchPrimitive.Input
            data-slot="command-input"
            placeholder={props.placeholder ?? "Type a command or search..."}
            class="cn-command-input outline-hidden disabled:cursor-not-allowed disabled:opacity-50"
          />
          <InputGroupAddon>
            <IconPlaceholder
              lucide="search"
              tabler="search"
              ph="magnifying-glass"
              ri="search-line"
              hugeicons="search-01"
              class="cn-command-input-icon"
            />
          </InputGroupAddon>
        </InputGroup>
      </SearchPrimitive.Control>
      <SearchPrimitive.Listbox
        data-slot="command-list"
        class="cn-command-group cn-command-list overflow-y-auto overflow-x-hidden empty:p-0"
      />
      <SearchPrimitive.NoResult
        data-slot="command-empty"
        class="cn-command-empty"
        onMouseDown={keepInputFocus}
      >
        {props.emptyMessage ?? "No results found."}
      </SearchPrimitive.NoResult>
    </SearchPrimitive.Root>
  );
};

type CommandDialogProps =
  & Omit<ComponentProps<typeof Dialog>, "children">
  & CommandProps
  & {
    title?: string;
    description?: string;
    showCloseButton?: boolean;
  };

const CommandDialogContent: Component<
  Pick<CommandDialogProps, "class" | "showCloseButton"> & {
    children: JSX.Element;
  }
> = (props) => {
  const dialog = useDialogContext();
  return (
    <DialogContent
      showCloseButton={props.showCloseButton ?? false}
      class={cn(
        "cn-command-dialog top-1/3 translate-y-0 overflow-hidden p-0",
        props.class,
      )}
      onEscapeKeyDown={(event) => {
        if (event.defaultPrevented) dialog.close();
      }}
    >
      {props.children}
    </DialogContent>
  );
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
    "showCloseButton",
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
      <CommandDialogContent
        showCloseButton={props.showCloseButton}
        class={props.class}
      >
        <Command {...commandProps()} />
      </CommandDialogContent>
    </Dialog>
  );
};

export { Command, CommandDialog, type CommandOption, type CommandOptionGroup };

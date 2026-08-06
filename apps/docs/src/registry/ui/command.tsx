import type { DialogRootProps } from "@kobalte/core/dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./dialog.tsx";
import { InputGroup, InputGroupAddon } from "./input-group.tsx";

import { cn } from "~/lib/utils.ts";
import * as CommandPrimitive from "cmdk-solid";

import type {
  Component,
  ComponentProps,
  ParentProps,
  VoidProps,
} from "solid-js";
import { mergeProps, splitProps } from "solid-js";
import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";

const Command: Component<ParentProps<CommandPrimitive.CommandRootProps>> = (
  props,
) => {
  const [local, others] = splitProps(props, ["class"]);

  return (
    <CommandPrimitive.CommandRoot
      data-slot="command"
      class={cn(
        "cn-command flex size-full flex-col overflow-hidden",
        local.class,
      )}
      {...others}
    />
  );
};

type CommandDialogProps = ParentProps<DialogRootProps> & {
  title?: string;
  description?: string;
  class?: string;
  showCloseButton?: boolean;
};

const CommandDialog: Component<CommandDialogProps> = (rawProps) => {
  const props = mergeProps(
    {
      title: "Command Palette",
      description: "Search for a command to run...",
      showCloseButton: false,
    },
    rawProps,
  );
  const [local, others] = splitProps(props, [
    "title",
    "description",
    "children",
    "class",
    "showCloseButton",
  ]);

  return (
    <Dialog {...others}>
      <DialogHeader class="sr-only">
        <DialogTitle>{local.title}</DialogTitle>
        <DialogDescription>{local.description}</DialogDescription>
      </DialogHeader>
      <DialogContent
        class={cn(
          "cn-command-dialog top-1/3 translate-y-0 overflow-hidden p-0",
          local.class,
        )}
        showCloseButton={local.showCloseButton}
      >
        {local.children}
      </DialogContent>
    </Dialog>
  );
};

const CommandInput: Component<VoidProps<CommandPrimitive.CommandInputProps>> = (
  props,
) => {
  const [local, others] = splitProps(props, ["class"]);

  return (
    <div data-slot="command-input-wrapper" class="cn-command-input-wrapper">
      <InputGroup class="cn-command-input-group">
        <CommandPrimitive.CommandInput
          data-slot="command-input"
          class={cn(
            "cn-command-input outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
            local.class,
          )}
          {...others}
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
    </div>
  );
};

const CommandList: Component<ParentProps<CommandPrimitive.CommandListProps>> = (
  props,
) => {
  const [local, others] = splitProps(props, ["class"]);

  return (
    <CommandPrimitive.CommandList
      data-slot="command-list"
      class={cn(
        "cn-command-list overflow-y-auto overflow-x-hidden",
        local.class,
      )}
      {...others}
    />
  );
};

const CommandEmpty: Component<ParentProps<CommandPrimitive.CommandEmptyProps>> =
  (props) => {
    const [local, others] = splitProps(props, ["class"]);

    return (
      <CommandPrimitive.CommandEmpty
        data-slot="command-empty"
        class={cn("cn-command-empty", local.class)}
        {...others}
      />
    );
  };

const CommandGroup: Component<ParentProps<CommandPrimitive.CommandGroupProps>> =
  (props) => {
    const [local, others] = splitProps(props, ["class"]);

    return (
      <CommandPrimitive.CommandGroup
        data-slot="command-group"
        class={cn(
          "cn-command-group",
          local.class,
        )}
        {...others}
      />
    );
  };

const CommandSeparator: Component<
  VoidProps<CommandPrimitive.CommandSeparatorProps>
> = (props) => {
  const [local, others] = splitProps(props, ["class"]);

  return (
    <CommandPrimitive.CommandSeparator
      data-slot="command-separator"
      class={cn("cn-command-separator", local.class)}
      {...others}
    />
  );
};

const CommandItem: Component<ParentProps<CommandPrimitive.CommandItemProps>> = (
  props,
) => {
  const [local, others] = splitProps(props, ["class", "children"]);

  return (
    <CommandPrimitive.CommandItem
      data-slot="command-item"
      class={cn(
        "cn-command-item group/command-item [&_svg]:pointer-events-none data-[disabled=true]:pointer-events-none [&_svg]:shrink-0 data-[disabled=true]:opacity-50",
        local.class,
      )}
      {...others}
    >
      {local.children}
      <IconPlaceholder
        lucide="check"
        tabler="check"
        ph="check"
        ri="check-line"
        hugeicons="tick-02"
        class="cn-command-item-indicator ml-auto opacity-0 group-has-data-[slot=command-shortcut]/command-item:hidden group-data-[checked=true]/command-item:opacity-100"
      />
    </CommandPrimitive.CommandItem>
  );
};

const CommandShortcut: Component<ComponentProps<"span">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);

  return (
    <span
      data-slot="command-shortcut"
      class={cn(
        "cn-command-shortcut",
        local.class,
      )}
      {...others}
    />
  );
};

export {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
};

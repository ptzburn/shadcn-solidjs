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
        "flex size-full flex-col overflow-hidden rounded-xl! bg-popover p-1 text-popover-foreground",
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
          "top-1/3 translate-y-0 overflow-hidden rounded-xl! p-0",
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
    <div data-slot="command-input-wrapper" class="p-1 pb-0">
      <InputGroup class="h-8! rounded-lg! border-input/30 bg-input/30 shadow-none! *:data-[slot=input-group-addon]:pl-2!">
        <CommandPrimitive.CommandInput
          data-slot="command-input"
          class={cn(
            "w-full text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
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
            class="size-4 shrink-0 opacity-50"
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
        "no-scrollbar max-h-72 scroll-py-1 overflow-y-auto overflow-x-hidden outline-none",
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
        class={cn("py-6 text-center text-sm", local.class)}
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
          "overflow-hidden p-1 text-foreground **:[[cmdk-group-heading]]:px-2 **:[[cmdk-group-heading]]:py-1.5 **:[[cmdk-group-heading]]:font-medium **:[[cmdk-group-heading]]:text-muted-foreground **:[[cmdk-group-heading]]:text-xs",
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
      class={cn("-mx-1 h-px bg-border", local.class)}
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
        "group/command-item relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden data-[selected=true]:*:[svg]:text-foreground [&_svg]:pointer-events-none data-[disabled=true]:pointer-events-none [&_svg]:shrink-0 in-data-[slot=dialog-content]:rounded-lg! data-[selected=true]:bg-muted data-[selected=true]:text-foreground data-[disabled=true]:opacity-50 [&_svg:not([class*='size-'])]:size-4",
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
        class="ml-auto opacity-0 group-has-data-[slot=command-shortcut]/command-item:hidden group-data-[checked=true]/command-item:opacity-100"
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
        "ml-auto text-muted-foreground text-xs tracking-widest group-data-[selected=true]/command-item:text-foreground",
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

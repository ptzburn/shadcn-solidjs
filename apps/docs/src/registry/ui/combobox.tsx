import * as ComboboxPrimitive from "@kobalte/core/combobox";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";

import { Button } from "./button.tsx";
import { cn } from "~/lib/utils.ts";
import type { Component, ComponentProps, JSX, ValidComponent } from "solid-js";

import { Show, splitProps } from "solid-js";
import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";

const Combobox = ComboboxPrimitive.Root;
const ComboboxItemLabel = ComboboxPrimitive.ItemLabel;
const ComboboxHiddenSelect = ComboboxPrimitive.HiddenSelect;

type ComboboxControlProps<U, T extends ValidComponent = "div"> =
  & ComboboxPrimitive.ComboboxControlProps<U, T>
  & { class?: string | undefined };

const ComboboxControl = <T, U extends ValidComponent = "div">(
  props: PolymorphicProps<U, ComboboxControlProps<T>>,
) => {
  const [local, others] = splitProps(props as ComboboxControlProps<T>, [
    "class",
  ]);
  return (
    <ComboboxPrimitive.Control
      data-slot="combobox-control"
      class={cn(
        "flex min-h-8 w-full flex-wrap items-center gap-1 rounded-lg border border-input bg-clip-padding bg-transparent px-2.5 py-1 text-sm transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 dark:bg-input/30 dark:has-aria-invalid:border-destructive/50 dark:has-aria-invalid:ring-destructive/40 has-aria-invalid:border-destructive has-aria-invalid:ring-3 has-aria-invalid:ring-destructive/20",
        local.class,
      )}
      {...others}
    />
  );
};

type ComboboxInputProps<T extends ValidComponent = "input"> =
  & ComboboxPrimitive.ComboboxInputProps<T>
  & { class?: string | undefined };

const ComboboxInput = <T extends ValidComponent = "input">(
  props: PolymorphicProps<T, ComboboxInputProps<T>>,
) => {
  const [local, others] = splitProps(props as ComboboxInputProps, ["class"]);
  return (
    <ComboboxPrimitive.Input
      data-slot="combobox-input"
      class={cn(
        "min-w-16 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
        local.class,
      )}
      {...others}
    />
  );
};

type ComboboxTriggerProps<T extends ValidComponent = "button"> =
  & ComboboxPrimitive.ComboboxTriggerProps<T>
  & {
    class?: string | undefined;
    children?: JSX.Element;
  };

const ComboboxTrigger = <T extends ValidComponent = "button">(
  props: PolymorphicProps<T, ComboboxTriggerProps<T>>,
) => {
  const [local, others] = splitProps(props as ComboboxTriggerProps, [
    "class",
    "children",
  ]);
  return (
    <ComboboxPrimitive.Trigger
      data-slot="combobox-trigger"
      class={cn(
        "flex items-center justify-center [&_svg:not([class*='size-'])]:size-4",
        local.class,
      )}
      {...others}
    >
      <ComboboxPrimitive.Icon>
        <Show
          when={local.children}
          fallback={
            <IconPlaceholder
              lucide="chevron-down"
              tabler="chevron-down"
              ph="caret-down"
              ri="arrow-down-s-line"
              hugeicons="arrow-down-01"
              class="pointer-events-none size-4 text-muted-foreground"
            />
          }
        >
          {(children) => children()}
        </Show>
      </ComboboxPrimitive.Icon>
    </ComboboxPrimitive.Trigger>
  );
};

type ComboboxClearProps = ComponentProps<"button">;

const ComboboxClear: Component<ComboboxClearProps> = (props) => {
  const [local, others] = splitProps(props, ["class", "children"]);
  return (
    <Button
      data-slot="combobox-clear"
      type="button"
      variant="ghost"
      size="icon-xs"
      class={local.class}
      {...others}
    >
      <Show
        when={local.children}
        fallback={
          <IconPlaceholder
            lucide="x"
            tabler="x"
            ph="x"
            ri="close-line"
            hugeicons="cancel-01"
            class="pointer-events-none"
          />
        }
      >
        {local.children}
      </Show>
    </Button>
  );
};

type ComboboxChipProps = ComponentProps<"span"> & {
  showRemove?: boolean;
  onRemove?: () => void;
};

const ComboboxChip: Component<ComboboxChipProps> = (props) => {
  const [local, others] = splitProps(props, [
    "class",
    "children",
    "showRemove",
    "onRemove",
  ]);
  return (
    <span
      data-slot="combobox-chip"
      class={cn(
        "flex h-[calc(--spacing(5.25))] w-fit items-center justify-center gap-1 whitespace-nowrap rounded-sm bg-muted px-1.5 font-medium text-foreground text-xs has-disabled:pointer-events-none has-disabled:cursor-not-allowed has-data-[slot=combobox-chip-remove]:pr-0 has-disabled:opacity-50",
        local.class,
      )}
      {...others}
    >
      {local.children}
      <Show when={local.showRemove ?? true}>
        <Button
          data-slot="combobox-chip-remove"
          type="button"
          variant="ghost"
          size="icon-xs"
          class="-ml-1 opacity-50 hover:opacity-100"
          onClick={() => local.onRemove?.()}
        >
          <IconPlaceholder
            lucide="x"
            tabler="x"
            ph="x"
            ri="close-line"
            hugeicons="cancel-01"
            class="pointer-events-none"
          />
        </Button>
      </Show>
    </span>
  );
};

const ComboboxEmpty: Component<ComponentProps<"div">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <div
      data-slot="combobox-empty"
      class={cn(
        "flex w-full justify-center py-2 text-center text-muted-foreground text-sm",
        local.class,
      )}
      {...others}
    />
  );
};

type ComboboxSectionProps<T extends ValidComponent = "li"> =
  & ComboboxPrimitive.ComboboxSectionProps<T>
  & { class?: string | undefined };

const ComboboxSection = <T extends ValidComponent = "li">(
  props: PolymorphicProps<T, ComboboxSectionProps<T>>,
) => {
  const [local, others] = splitProps(props as ComboboxSectionProps, ["class"]);
  return (
    <ComboboxPrimitive.Section
      data-slot="combobox-label"
      class={cn("px-2 py-1.5 text-muted-foreground text-xs", local.class)}
      {...others}
    />
  );
};

type ComboboxItemProps<T extends ValidComponent = "li"> =
  & ComboboxPrimitive.ComboboxItemProps<T>
  & {
    class?: string | undefined;
    children?: JSX.Element;
  };

const ComboboxItem = <T extends ValidComponent = "li">(
  props: PolymorphicProps<T, ComboboxItemProps<T>>,
) => {
  const [local, others] = splitProps(props as ComboboxItemProps, [
    "class",
    "children",
  ]);
  return (
    <ComboboxPrimitive.Item
      data-slot="combobox-item"
      class={cn(
        "relative flex w-full cursor-default select-none items-center gap-2 rounded-md py-1 pr-8 pl-1.5 text-sm outline-hidden [&_svg]:pointer-events-none data-disabled:pointer-events-none [&_svg]:shrink-0 data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4",
        local.class,
      )}
      {...others}
    >
      {local.children}
      <ComboboxPrimitive.ItemIndicator class="pointer-events-none absolute right-2 flex size-4 items-center justify-center">
        <IconPlaceholder
          lucide="check"
          tabler="check"
          ph="check"
          ri="check-line"
          hugeicons="tick-02"
          class="pointer-events-none"
        />
      </ComboboxPrimitive.ItemIndicator>
    </ComboboxPrimitive.Item>
  );
};

type ComboboxContentProps<T extends ValidComponent = "div"> =
  & ComboboxPrimitive.ComboboxContentProps<T>
  & { class?: string | undefined };

const ComboboxContent = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, ComboboxContentProps<T>>,
) => {
  const [local, others] = splitProps(props as ComboboxContentProps, ["class"]);
  return (
    <ComboboxPrimitive.Portal>
      <ComboboxPrimitive.Content
        data-slot="combobox-content"
        class={cn(
          "data-closed:fade-out-0 data-closed:zoom-out-95 data-expanded:fade-in-0 data-expanded:zoom-in-95 group/combobox-content relative z-50 min-w-32 origin-(--kb-combobox-content-transform-origin) overflow-hidden rounded-lg bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 data-closed:animate-out data-expanded:animate-in",
          local.class,
        )}
        {...others}
      >
        <ComboboxPrimitive.Listbox
          data-slot="combobox-list"
          class="no-scrollbar max-h-72 scroll-py-1 overflow-y-auto overscroll-contain p-1"
        />
      </ComboboxPrimitive.Content>
    </ComboboxPrimitive.Portal>
  );
};

export {
  Combobox,
  ComboboxChip,
  ComboboxClear,
  ComboboxContent,
  ComboboxControl,
  ComboboxEmpty,
  ComboboxHiddenSelect,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemLabel,
  ComboboxSection,
  ComboboxTrigger,
};

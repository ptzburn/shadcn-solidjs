import * as ComboboxPrimitive from "@kobalte/core/combobox";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import type { ComponentProps, JSX, ValidComponent } from "@solidjs/web";
import { cn } from "~/lib/utils.ts";

import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";
import type { Component } from "solid-js";
import { omit, Show } from "solid-js";

import { Button } from "./button.tsx";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "./input-group.tsx";

const Combobox = <Option, OptGroup = never, T extends ValidComponent = "div">(
  props: PolymorphicProps<
    T,
    ComboboxPrimitive.ComboboxRootProps<Option, OptGroup, T>
  >,
) => (
  <ComboboxPrimitive.Root
    triggerMode="focus"
    placement="bottom-start"
    {...(props as ComboboxPrimitive.ComboboxRootProps<Option, OptGroup>)}
  />
);
const ComboboxItemLabel = ComboboxPrimitive.ItemLabel;
const ComboboxHiddenSelect = ComboboxPrimitive.HiddenSelect;

type ComboboxTriggerProps<T extends ValidComponent = "button"> =
  & ComboboxPrimitive.ComboboxTriggerProps<T>
  & {
    class?: string | undefined;
    children?: JSX.Element;
  };

const ComboboxTrigger = <T extends ValidComponent = "button">(
  props: PolymorphicProps<T, ComboboxTriggerProps<T>>,
) => {
  const local = props as ComboboxTriggerProps;
  const others = omit(local, "class", "children");
  return (
    <ComboboxPrimitive.Trigger
      data-slot="combobox-trigger"
      class={cn("[&_svg:not([class*='size-'])]:size-4", local.class)}
      {...others}
    >
      {local.children}
      <IconPlaceholder
        lucide="chevron-down"
        tabler="chevron-down"
        ph="caret-down"
        ri="arrow-down-s-line"
        hugeicons="arrow-down-01"
        class="pointer-events-none size-4 text-muted-foreground"
      />
    </ComboboxPrimitive.Trigger>
  );
};

type ComboboxClearProps =
  & Omit<ComponentProps<"button">, "disabled" | "type" | "tabindex">
  & {
    disabled?: boolean;
    type?: string;
    tabindex?: number | string;
  };

const ComboboxClear: Component<ComboboxClearProps> = (props) => {
  const context = ComboboxPrimitive.useComboboxContext();
  const others = omit(props, "class");
  return (
    <InputGroupButton
      data-slot="combobox-clear"
      variant="ghost"
      size="icon-xs"
      aria-label="Clear"
      disabled={context.isDisabled()}
      class={cn(props.class)}
      {...others}
    >
      <IconPlaceholder
        lucide="x"
        tabler="x"
        ph="x"
        ri="close-line"
        hugeicons="cancel-01"
        class="pointer-events-none"
      />
    </InputGroupButton>
  );
};

type ComboboxInputProps<T extends ValidComponent = "input"> =
  & ComboboxPrimitive.ComboboxInputProps<T>
  & {
    class?: string | undefined;
    children?: JSX.Element;
    placeholder?: string;
    "aria-invalid"?: boolean | "true" | "false";
    showTrigger?: boolean;
    showClear?: boolean;
  };

const ComboboxInput = <T extends ValidComponent = "input">(
  props: PolymorphicProps<T, ComboboxInputProps<T>>,
) => {
  const local = props as ComboboxInputProps;
  const others = omit(local, "class", "children", "showTrigger", "showClear");
  return (
    <ComboboxPrimitive.Control
      as={InputGroup}
      class={cn("w-auto", local.class)}
    >
      {(state) => (
        <>
          <ComboboxPrimitive.Input as={InputGroupInput} {...others} />
          <InputGroupAddon align="inline-end">
            <Show when={local.showTrigger ?? true}>
              <ComboboxTrigger
                as={InputGroupButton}
                size="icon-xs"
                variant="ghost"
                class="group-has-data-[slot=combobox-clear]/input-group:hidden"
              />
            </Show>
            <Show when={local.showClear && state.selectedOptions().length > 0}>
              <ComboboxClear onClick={() => state.clear()} />
            </Show>
          </InputGroupAddon>
          {local.children}
        </>
      )}
    </ComboboxPrimitive.Control>
  );
};

type ComboboxChipsProps<Option, T extends ValidComponent = "div"> =
  & ComboboxPrimitive.ComboboxControlProps<Option, T>
  & { class?: string | undefined };

const ComboboxChips = <Option, T extends ValidComponent = "div">(
  props: PolymorphicProps<T, ComboboxChipsProps<Option, T>>,
) => {
  const local = props as ComboboxChipsProps<Option>;
  const others = omit(local, "class");
  return (
    <ComboboxPrimitive.Control
      data-slot="combobox-chips"
      class={cn(
        "flex min-h-8 flex-wrap items-center gap-1 rounded-lg border border-input bg-clip-padding bg-transparent px-2.5 py-1 text-sm transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 dark:bg-input/30 dark:has-aria-invalid:border-destructive/50 dark:has-aria-invalid:ring-destructive/40 has-aria-invalid:border-destructive has-data-[slot=combobox-chip]:px-1 has-aria-invalid:ring-3 has-aria-invalid:ring-destructive/20",
        local.class,
      )}
      {...others}
    />
  );
};

type ComboboxChipProps = ComponentProps<"span"> & {
  showRemove?: boolean;
  onRemove?: () => void;
};

const ComboboxChip: Component<ComboboxChipProps> = (props) => {
  const context = ComboboxPrimitive.useComboboxContext();
  const others = omit(props, "class", "children", "showRemove", "onRemove");
  return (
    <span
      data-slot="combobox-chip"
      class={cn(
        "flex h-[calc(--spacing(5.25))] w-fit items-center justify-center gap-1 whitespace-nowrap rounded-sm bg-muted px-1.5 font-medium text-foreground text-xs has-disabled:pointer-events-none has-disabled:cursor-not-allowed has-data-[slot=combobox-chip-remove]:pr-0 has-disabled:opacity-50",
        props.class,
      )}
      {...others}
    >
      {props.children}
      <Show when={props.showRemove ?? true}>
        <Button
          data-slot="combobox-chip-remove"
          type="button"
          variant="ghost"
          size="icon-xs"
          disabled={context.isDisabled()}
          class="-ml-1 opacity-50 hover:opacity-100"
          onClick={() => props.onRemove?.()}
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

type ComboboxChipsInputProps<T extends ValidComponent = "input"> =
  & ComboboxPrimitive.ComboboxInputProps<T>
  & { class?: string | undefined };

const ComboboxChipsInput = <T extends ValidComponent = "input">(
  props: PolymorphicProps<T, ComboboxChipsInputProps<T>>,
) => {
  const local = props as ComboboxChipsInputProps;
  const others = omit(local, "class");
  return (
    <ComboboxPrimitive.Input
      data-slot="combobox-chip-input"
      class={cn(
        "min-w-16 flex-1 outline-none",
        local.class,
      )}
      {...others}
    />
  );
};

const ComboboxEmpty: Component<ComponentProps<"div">> = (props) => {
  const others = omit(props, "class");
  return (
    <div
      data-slot="combobox-empty"
      class={cn(
        "hidden w-full justify-center py-2 text-center text-muted-foreground text-sm group-has-[[data-slot=combobox-list]:empty]/combobox-content:flex",
        props.class,
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
  const local = props as ComboboxSectionProps;
  const others = omit(local, "class");
  return (
    <ComboboxPrimitive.Section
      data-slot="combobox-label"
      class={cn("px-2 py-1.5 text-muted-foreground text-xs", local.class)}
      {...others}
    />
  );
};

const ComboboxSeparator: Component<ComponentProps<"li">> = (props) => {
  const others = omit(props, "class");
  return (
    <li
      data-slot="combobox-separator"
      role="separator"
      aria-orientation="horizontal"
      class={cn("-mx-1 my-1 h-px bg-border", props.class)}
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
  const local = props as ComboboxItemProps;
  const others = omit(local, "class", "children");
  return (
    <ComboboxPrimitive.Item
      data-slot="combobox-item"
      class={cn(
        "relative flex w-full cursor-default select-none items-center gap-2 rounded-md py-1 pr-8 pl-1.5 text-sm outline-hidden [&_svg]:pointer-events-none data-disabled:pointer-events-none [&_svg]:shrink-0 data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4 not-data-[variant=destructive]:data-highlighted:**:text-accent-foreground",
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
  & {
    class?: string | undefined;
    children?: JSX.Element;
  };

const ComboboxContent = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, ComboboxContentProps<T>>,
) => {
  const local = props as ComboboxContentProps;
  const others = omit(local, "class");
  return (
    <ComboboxPrimitive.Portal>
      <ComboboxPrimitive.Content
        data-slot="combobox-content"
        class={cn(
          "data-closed:fade-out-0 data-closed:zoom-out-95 data-expanded:fade-in-0 data-expanded:zoom-in-95 group/combobox-content relative z-50 max-h-(--kb-popper-content-available-height) min-w-(--kb-popper-anchor-width) max-w-(--kb-popper-content-available-width) origin-(--kb-combobox-content-transform-origin) overflow-hidden rounded-lg bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 *:data-[slot=input-group]:m-1 *:data-[slot=input-group]:mb-0 *:data-[slot=input-group]:h-8 *:data-[slot=input-group]:border-input/30 *:data-[slot=input-group]:bg-input/30 *:data-[slot=input-group]:shadow-none data-closed:animate-out data-expanded:animate-in",
          local.class,
        )}
        {...others}
      />
    </ComboboxPrimitive.Portal>
  );
};

type ComboboxListProps<
  Option,
  OptGroup = never,
  T extends ValidComponent = "ul",
> =
  & ComboboxPrimitive.ComboboxListboxProps<Option, OptGroup, T>
  & { class?: string | undefined };

const ComboboxList = <
  Option,
  OptGroup = never,
  T extends ValidComponent = "ul",
>(
  props: PolymorphicProps<T, ComboboxListProps<Option, OptGroup, T>>,
) => {
  const local = props as ComboboxListProps<Option, OptGroup>;
  const others = omit(local, "class");
  return (
    <ComboboxPrimitive.Listbox
      data-slot="combobox-list"
      class={cn(
        "no-scrollbar max-h-[min(calc(--spacing(72)---spacing(9)),calc(var(--kb-popper-content-available-height)---spacing(9)))] scroll-py-1 overflow-y-auto overscroll-contain p-1 empty:p-0",
        local.class,
      )}
      {...others}
    />
  );
};

export {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxHiddenSelect,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemLabel,
  ComboboxList,
  ComboboxSection,
  ComboboxSeparator,
  ComboboxTrigger,
};

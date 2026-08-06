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
        "cn-combobox-chips w-full",
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
        "cn-combobox-trigger flex items-center justify-center",
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
              class="cn-combobox-trigger-icon pointer-events-none"
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
            class="cn-combobox-clear-icon pointer-events-none"
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
        "cn-combobox-chip has-disabled:pointer-events-none has-disabled:cursor-not-allowed has-disabled:opacity-50",
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
          class="cn-combobox-chip-remove"
          onClick={() => local.onRemove?.()}
        >
          <IconPlaceholder
            lucide="x"
            tabler="x"
            ph="x"
            ri="close-line"
            hugeicons="cancel-01"
            class="cn-combobox-chip-indicator-icon pointer-events-none"
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
        "cn-combobox-empty",
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
      class={cn("cn-combobox-label", local.class)}
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
        "cn-combobox-item relative flex w-full cursor-default select-none items-center outline-hidden [&_svg]:pointer-events-none data-disabled:pointer-events-none [&_svg]:shrink-0 data-disabled:opacity-50",
        local.class,
      )}
      {...others}
    >
      {local.children}
      <ComboboxPrimitive.ItemIndicator class="cn-combobox-item-indicator">
        <IconPlaceholder
          lucide="check"
          tabler="check"
          ph="check"
          ri="check-line"
          hugeicons="tick-02"
          class="cn-combobox-item-indicator-icon pointer-events-none"
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
          "cn-combobox-content group/combobox-content relative z-50 origin-(--kb-combobox-content-transform-origin)",
          local.class,
        )}
        {...others}
      >
        <ComboboxPrimitive.Listbox
          data-slot="combobox-list"
          class="cn-combobox-list overflow-y-auto overscroll-contain"
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

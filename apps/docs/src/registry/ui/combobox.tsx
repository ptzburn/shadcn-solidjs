import * as ComboboxPrimitive from "@kobalte/core/combobox";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";

import { Button } from "./button.tsx";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "./input-group.tsx";
import { cn } from "~/lib/utils.ts";
import type { Component, ComponentProps, JSX, ValidComponent } from "solid-js";

import { Show, splitProps } from "solid-js";
import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";

// Kobalte's default triggerMode="input" only opens the popup once the
// user types; upstream's base-ui combobox opens it when the input is
// clicked. triggerMode="focus" is the closest match: clicking the input
// opens the popup (it also opens on keyboard focus, which upstream does
// not do — the smaller mismatch). placement="bottom-start" mirrors
// upstream ComboboxContent's side/align defaults; Kobalte only accepts
// it on the root. Consumers can override both.
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
  const [local, others] = splitProps(props as ComboboxTriggerProps, [
    "class",
    "children",
  ]);
  return (
    <ComboboxPrimitive.Trigger
      data-slot="combobox-trigger"
      class={cn("cn-combobox-trigger", local.class)}
      {...others}
    >
      {local.children}
      <IconPlaceholder
        lucide="chevron-down"
        tabler="chevron-down"
        ph="caret-down"
        ri="arrow-down-s-line"
        hugeicons="arrow-down-01"
        class="cn-combobox-trigger-icon pointer-events-none"
      />
    </ComboboxPrimitive.Trigger>
  );
};

type ComboboxClearProps = ComponentProps<"button">;

const ComboboxClear: Component<ComboboxClearProps> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <InputGroupButton
      data-slot="combobox-clear"
      variant="ghost"
      size="icon-xs"
      aria-label="Clear"
      class={cn("cn-combobox-clear", local.class)}
      {...others}
    >
      <IconPlaceholder
        lucide="x"
        tabler="x"
        ph="x"
        ri="close-line"
        hugeicons="cancel-01"
        class="cn-combobox-clear-icon pointer-events-none"
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
  const [local, others] = splitProps(props as ComboboxInputProps, [
    "class",
    "children",
    "disabled",
    "showTrigger",
    "showClear",
  ]);
  return (
    <ComboboxPrimitive.Control
      as={InputGroup}
      class={cn("cn-combobox-input w-auto", local.class)}
    >
      {(state) => (
        <>
          <ComboboxPrimitive.Input
            as={InputGroupInput}
            disabled={local.disabled}
            {...others}
          />
          <InputGroupAddon align="inline-end">
            <Show when={local.showTrigger ?? true}>
              <ComboboxTrigger
                as={InputGroupButton}
                size="icon-xs"
                variant="ghost"
                class="group-has-data-[slot=combobox-clear]/input-group:hidden"
                disabled={local.disabled}
              />
            </Show>
            <Show when={local.showClear && state.selectedOptions().length > 0}>
              <ComboboxClear
                disabled={local.disabled}
                onClick={() => state.clear()}
              />
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
  const [local, others] = splitProps(props as ComboboxChipsProps<Option>, [
    "class",
  ]);
  return (
    <ComboboxPrimitive.Control
      data-slot="combobox-chips"
      class={cn("cn-combobox-chips", local.class)}
      {...others}
    />
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

type ComboboxChipsInputProps<T extends ValidComponent = "input"> =
  & ComboboxPrimitive.ComboboxInputProps<T>
  & { class?: string | undefined };

const ComboboxChipsInput = <T extends ValidComponent = "input">(
  props: PolymorphicProps<T, ComboboxChipsInputProps<T>>,
) => {
  const [local, others] = splitProps(props as ComboboxChipsInputProps, [
    "class",
  ]);
  return (
    <ComboboxPrimitive.Input
      data-slot="combobox-chip-input"
      class={cn(
        "cn-combobox-chip-input min-w-16 flex-1 outline-none",
        local.class,
      )}
      {...others}
    />
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

// an li, not a div: the listbox is a ul, which may only own list items
const ComboboxSeparator: Component<ComponentProps<"li">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <li
      data-slot="combobox-separator"
      role="separator"
      aria-orientation="horizontal"
      class={cn("cn-combobox-separator", local.class)}
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
        "cn-combobox-item relative flex w-full cursor-default items-center outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
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
  & {
    class?: string | undefined;
    children?: JSX.Element;
  };

const ComboboxContent = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, ComboboxContentProps<T>>,
) => {
  const [local, others] = splitProps(props as ComboboxContentProps, ["class"]);
  return (
    <ComboboxPrimitive.Portal>
      <ComboboxPrimitive.Content
        data-slot="combobox-content"
        class={cn(
          // Upstream's min-w-[calc(var(--anchor-width)+--spacing(7))]
          // widens the popup past its anchor (the inner input element) by
          // the 28px trailing chevron addon. Kobalte anchors to the whole
          // control (input + addons), so the +28 is already included:
          // min-w-(--kb-popper-anchor-width) computes the same width, and
          // upstream's data-chips exact-width exception collapses into it.
          "cn-combobox-content group/combobox-content relative z-50 max-h-(--kb-popper-content-available-height) max-w-(--kb-popper-content-available-width) min-w-(--kb-popper-anchor-width) origin-(--kb-combobox-content-transform-origin)",
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
  const [local, others] = splitProps(
    props as ComboboxListProps<Option, OptGroup>,
    ["class"],
  );
  return (
    <ComboboxPrimitive.Listbox
      data-slot="combobox-list"
      class={cn(
        "cn-combobox-list overflow-y-auto overscroll-contain",
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

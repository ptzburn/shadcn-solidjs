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
      class={cn("cn-combobox-clear", props.class)}
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
  const local = props as ComboboxInputProps;
  const others = omit(local, "class", "children", "showTrigger", "showClear");
  return (
    <ComboboxPrimitive.Control
      as={InputGroup}
      class={cn("cn-combobox-input w-auto", local.class)}
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
        "cn-combobox-chips",
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
        "cn-combobox-chip has-disabled:pointer-events-none has-disabled:cursor-not-allowed has-disabled:opacity-50",
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
          class="cn-combobox-chip-remove"
          onClick={() => props.onRemove?.()}
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
  const local = props as ComboboxChipsInputProps;
  const others = omit(local, "class");
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
  const others = omit(props, "class");
  return (
    <div
      data-slot="combobox-empty"
      class={cn(
        "cn-combobox-empty",
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
      class={cn("cn-combobox-label", local.class)}
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
      class={cn("cn-combobox-separator", props.class)}
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
          "cn-combobox-content group/combobox-content relative z-50 max-h-(--kb-popper-content-available-height) min-w-(--kb-popper-anchor-width) max-w-(--kb-popper-content-available-width) origin-(--kb-combobox-content-transform-origin)",
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

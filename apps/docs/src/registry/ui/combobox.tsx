import type { JSX, ValidComponent } from "solid-js";
import { Show, splitProps } from "solid-js";

import * as ComboboxPrimitive from "@kobalte/core/combobox";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";

import { cn } from "~/lib/utils.ts";
import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";

const Combobox = ComboboxPrimitive.Root;
const ComboboxItemLabel = ComboboxPrimitive.ItemLabel;
const ComboboxHiddenSelect = ComboboxPrimitive.HiddenSelect;

type ComboboxItemProps<T extends ValidComponent = "li"> =
  & ComboboxPrimitive.ComboboxItemProps<T>
  & {
    class?: string | undefined;
  };

const ComboboxItem = <T extends ValidComponent = "li">(
  props: PolymorphicProps<T, ComboboxItemProps<T>>,
) => {
  const [local, others] = splitProps(props as ComboboxItemProps, ["class"]);
  return (
    <ComboboxPrimitive.Item
      class={cn(
        "relative flex cursor-default select-none items-center justify-between rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:opacity-50",
        local.class,
      )}
      {...others}
    />
  );
};

type ComboboxItemIndicatorProps<T extends ValidComponent = "div"> =
  & ComboboxPrimitive.ComboboxItemIndicatorProps<T>
  & {
    children?: JSX.Element;
  };

const ComboboxItemIndicator = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, ComboboxItemIndicatorProps<T>>,
) => {
  const [local, others] = splitProps(props as ComboboxItemIndicatorProps, [
    "children",
  ]);
  return (
    <ComboboxPrimitive.ItemIndicator {...others}>
      <Show
        when={local.children}
        fallback={
          <IconPlaceholder
            lucide="check"
            tabler="check"
            ph="check"
            ri="check-line"
            hugeicons="tick-02"
            class="size-4"
          />
        }
      >
        {(children) => children()}
      </Show>
    </ComboboxPrimitive.ItemIndicator>
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
      class={cn(
        "overflow-hidden p-1 px-2 py-1.5 text-xs font-medium text-muted-foreground ",
        local.class,
      )}
      {...others}
    />
  );
};

type ComboboxControlProps<
  U,
  T extends ValidComponent = "div",
> = ComboboxPrimitive.ComboboxControlProps<U, T> & {
  class?: string | undefined;
};

const ComboboxControl = <T, U extends ValidComponent = "div">(
  props: PolymorphicProps<U, ComboboxControlProps<T>>,
) => {
  const [local, others] = splitProps(props as ComboboxControlProps<T>, [
    "class",
  ]);
  return (
    <ComboboxPrimitive.Control
      class={cn("flex h-10 items-center rounded-md border px-3", local.class)}
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
      class={cn(
        "flex size-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
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
      class={cn("size-4 opacity-50", local.class)}
      {...others}
    >
      <ComboboxPrimitive.Icon>
        <Show
          when={local.children}
          fallback={
            <IconPlaceholder
              lucide="chevrons-up-down"
              tabler="selector"
              ph="caret-up-down"
              ri="expand-up-down-line"
              hugeicons="unfold-more"
              class="size-4"
            />
          }
        >
          {(children) => children()}
        </Show>
      </ComboboxPrimitive.Icon>
    </ComboboxPrimitive.Trigger>
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
        class={cn(
          "relative z-50 min-w-32 overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-80",
          local.class,
        )}
        {...others}
      >
        <ComboboxPrimitive.Listbox class="m-0 p-1" />
      </ComboboxPrimitive.Content>
    </ComboboxPrimitive.Portal>
  );
};

export {
  Combobox,
  ComboboxContent,
  ComboboxControl,
  ComboboxHiddenSelect,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxItemLabel,
  ComboboxSection,
  ComboboxTrigger,
};

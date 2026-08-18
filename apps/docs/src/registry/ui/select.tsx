import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import * as SelectPrimitive from "@kobalte/core/select";
import type { ComponentProps, JSX, ValidComponent } from "@solidjs/web";
import { cn } from "~/lib/utils.ts";

import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";
import type { Component } from "solid-js";
import { merge, omit } from "solid-js";

const Select = <Option, OptGroup = never, T extends ValidComponent = "div">(
  props: PolymorphicProps<
    T,
    SelectPrimitive.SelectRootProps<Option, OptGroup, T>
  >,
) => (
  <SelectPrimitive.Root
    data-slot="select"
    {...(props as SelectPrimitive.SelectRootProps<Option, OptGroup>)}
  />
);

const SelectHiddenSelect = SelectPrimitive.HiddenSelect;

type SelectValueProps<Option, T extends ValidComponent = "span"> =
  SelectPrimitive.SelectValueProps<Option, T>;

const SelectValue = <Option, T extends ValidComponent = "span">(
  props: PolymorphicProps<T, SelectValueProps<Option, T>>,
) => (
  <SelectPrimitive.Value
    data-slot="select-value"
    {...(props as SelectValueProps<Option>)}
  />
);

type SelectTriggerProps<T extends ValidComponent = "button"> =
  & SelectPrimitive.SelectTriggerProps<T>
  & {
    class?: string | undefined;
    children?: JSX.Element;
    size?: "sm" | "default";
  };

const SelectTrigger = <T extends ValidComponent = "button">(
  rawProps: PolymorphicProps<T, SelectTriggerProps<T>>,
) => {
  const props = merge(
    { size: "default" as const },
    rawProps as SelectTriggerProps,
  );
  const others = omit(props, "class", "children", "size");
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={props.size}
      class={cn(
        "flex w-fit select-none items-center justify-between gap-1.5 whitespace-nowrap rounded-lg border border-input bg-transparent py-2 pr-2 pl-2.5 text-sm outline-none transition-colors *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-1.5 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30 dark:hover:bg-input/50 dark:aria-invalid:border-destructive/50 dark:data-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 dark:data-invalid:ring-destructive/40 [&_svg]:pointer-events-none data-[size=default]:h-8 data-[size=sm]:h-7 [&_svg]:shrink-0 data-disabled:cursor-not-allowed data-[size=sm]:rounded-[min(var(--radius-md),10px)] aria-invalid:border-destructive data-invalid:border-destructive has-data-placeholder-shown:text-muted-foreground data-disabled:opacity-50 aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-invalid:ring-3 data-invalid:ring-destructive/20 [&_svg:not([class*='size-'])]:size-4",
        props.class,
      )}
      {...others}
    >
      {props.children}
      <SelectPrimitive.Icon>
        <IconPlaceholder
          lucide="chevron-down"
          tabler="selector"
          ph="caret-down"
          ri="arrow-down-s-line"
          hugeicons="unfold-more"
          class="pointer-events-none size-4 text-muted-foreground"
        />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
};

type SelectContentProps<T extends ValidComponent = "div"> =
  & SelectPrimitive.SelectContentProps<T>
  & { class?: string | undefined };

const SelectContent = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, SelectContentProps<T>>,
) => {
  const local = props as SelectContentProps;
  const others = omit(local, "class");
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        class={cn(
          "data-closed:fade-out-0 data-closed:zoom-out-95 data-expanded:fade-in-0 data-expanded:zoom-in-95 relative z-50 min-w-36 origin-(--kb-select-content-transform-origin) overflow-hidden rounded-lg bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 data-closed:animate-out data-expanded:animate-in",
          local.class,
        )}
        {...others}
      >
        <SelectPrimitive.Listbox
          data-slot="select-list"
          class="max-h-(--kb-popper-content-available-height) scroll-py-1 overflow-y-auto overscroll-contain p-1"
        />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
};

type SelectSectionProps<T extends ValidComponent = "li"> =
  & SelectPrimitive.SelectSectionProps<T>
  & { class?: string | undefined };

const SelectSection = <T extends ValidComponent = "li">(
  props: PolymorphicProps<T, SelectSectionProps<T>>,
) => {
  const local = props as SelectSectionProps;
  const others = omit(local, "class");
  return (
    <SelectPrimitive.Section
      data-slot="select-label"
      class={cn("px-1.5 py-1 text-muted-foreground text-xs", local.class)}
      {...others}
    />
  );
};

const SelectSeparator: Component<ComponentProps<"li">> = (props) => {
  const others = omit(props, "class");
  return (
    <li
      data-slot="select-separator"
      role="separator"
      aria-orientation="horizontal"
      class={cn("pointer-events-none -mx-1 my-1 h-px bg-border", props.class)}
      {...others}
    />
  );
};

type SelectItemProps<T extends ValidComponent = "li"> =
  & SelectPrimitive.SelectItemProps<T>
  & {
    class?: string | undefined;
    children?: JSX.Element;
  };

const SelectItem = <T extends ValidComponent = "li">(
  props: PolymorphicProps<T, SelectItemProps<T>>,
) => {
  const local = props as SelectItemProps;
  const others = omit(local, "class", "children");
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      class={cn(
        "relative flex w-full cursor-default select-none items-center gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm outline-hidden *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2 [&_svg]:pointer-events-none data-disabled:pointer-events-none [&_svg]:shrink-0 data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4 not-data-[variant=destructive]:data-highlighted:**:text-accent-foreground",
        local.class,
      )}
      {...others}
    >
      <span class="pointer-events-none absolute right-2 flex size-4 items-center justify-center">
        <SelectPrimitive.ItemIndicator as="span">
          <IconPlaceholder
            lucide="check"
            tabler="check"
            ph="check"
            ri="check-line"
            hugeicons="tick-02"
            class="pointer-events-none"
          />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemLabel as="span">
        {local.children}
      </SelectPrimitive.ItemLabel>
    </SelectPrimitive.Item>
  );
};

export {
  Select,
  SelectContent,
  SelectHiddenSelect,
  SelectItem,
  SelectSection,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};

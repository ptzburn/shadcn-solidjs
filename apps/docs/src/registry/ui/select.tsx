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
        "cn-select-trigger flex w-fit items-center justify-between whitespace-nowrap outline-none *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center [&_svg]:pointer-events-none [&_svg]:shrink-0 data-disabled:cursor-not-allowed data-disabled:opacity-50",
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
          class="cn-select-trigger-icon pointer-events-none"
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
          "cn-select-content relative z-50 origin-(--kb-select-content-transform-origin) overflow-hidden",
          local.class,
        )}
        {...others}
      >
        <SelectPrimitive.Listbox
          data-slot="select-list"
          class="cn-select-list"
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
      class={cn("cn-select-label", local.class)}
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
      class={cn("cn-select-separator pointer-events-none", props.class)}
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
        "cn-select-item relative flex w-full cursor-default select-none items-center outline-hidden [&_svg]:pointer-events-none data-disabled:pointer-events-none [&_svg]:shrink-0 data-disabled:opacity-50",
        local.class,
      )}
      {...others}
    >
      <span class="cn-select-item-indicator">
        <SelectPrimitive.ItemIndicator as="span">
          <IconPlaceholder
            lucide="check"
            tabler="check"
            ph="check"
            ri="check-line"
            hugeicons="tick-02"
            class="cn-select-item-indicator-icon pointer-events-none"
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

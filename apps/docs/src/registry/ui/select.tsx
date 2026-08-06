import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import * as SelectPrimitive from "@kobalte/core/select";

import { cn } from "~/lib/utils.ts";
import { cva } from "class-variance-authority";

import type { JSX, ValidComponent } from "solid-js";
import { mergeProps, splitProps } from "solid-js";
import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";

const Select = SelectPrimitive.Root;
const SelectValue = SelectPrimitive.Value;
const SelectHiddenSelect = SelectPrimitive.HiddenSelect;

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
  const props = mergeProps(
    { size: "default" as const },
    rawProps as SelectTriggerProps,
  );
  const [local, others] = splitProps(props, ["class", "children", "size"]);
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={local.size}
      class={cn(
        "cn-select-trigger flex w-fit items-center justify-between whitespace-nowrap outline-none data-disabled:cursor-not-allowed data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        local.class,
      )}
      {...others}
    >
      {local.children}
      <SelectPrimitive.Icon>
        <IconPlaceholder
          lucide="chevron-down"
          tabler="chevron-down"
          ph="caret-down"
          ri="arrow-down-s-line"
          hugeicons="arrow-down-01"
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
  const [local, others] = splitProps(props as SelectContentProps, ["class"]);
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
          class="max-h-(--kb-popper-content-available-height) scroll-py-1 overflow-y-auto overscroll-contain p-1"
        />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
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
  const [local, others] = splitProps(props as SelectItemProps, [
    "class",
    "children",
  ]);
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      class={cn(
        "cn-select-item relative flex w-full cursor-default select-none items-center outline-hidden [&_svg]:pointer-events-none data-disabled:pointer-events-none [&_svg]:shrink-0 data-disabled:opacity-50",
        local.class,
      )}
      {...others}
    >
      <SelectPrimitive.ItemLabel>{local.children}</SelectPrimitive.ItemLabel>
      <SelectPrimitive.ItemIndicator
        data-slot="select-item-indicator"
        class="cn-select-item-indicator"
      >
        <IconPlaceholder
          lucide="check"
          tabler="check"
          ph="check"
          ri="check-line"
          hugeicons="tick-02"
          class="cn-select-item-indicator-icon pointer-events-none"
        />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  );
};

type SelectSectionProps<T extends ValidComponent = "li"> =
  & SelectPrimitive.SelectSectionProps<T>
  & { class?: string | undefined };

const SelectSection = <T extends ValidComponent = "li">(
  props: PolymorphicProps<T, SelectSectionProps<T>>,
) => {
  const [local, others] = splitProps(props as SelectSectionProps, ["class"]);
  return (
    <SelectPrimitive.Section
      data-slot="select-label"
      class={cn("cn-select-label", local.class)}
      {...others}
    />
  );
};

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
  {
    variants: {
      variant: {
        label: "data-[invalid]:text-destructive",
        description: "font-normal text-muted-foreground",
        error: "text-xs text-destructive",
      },
    },
    defaultVariants: {
      variant: "label",
    },
  },
);

type SelectLabelProps<T extends ValidComponent = "label"> =
  & SelectPrimitive.SelectLabelProps<T>
  & {
    class?: string | undefined;
  };

const SelectLabel = <T extends ValidComponent = "label">(
  props: PolymorphicProps<T, SelectLabelProps<T>>,
) => {
  const [local, others] = splitProps(props as SelectLabelProps, ["class"]);
  return (
    <SelectPrimitive.Label
      class={cn(labelVariants(), local.class)}
      {...others}
    />
  );
};

type SelectDescriptionProps<T extends ValidComponent = "div"> =
  & SelectPrimitive.SelectDescriptionProps<T>
  & {
    class?: string | undefined;
  };

const SelectDescription = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, SelectDescriptionProps<T>>,
) => {
  const [local, others] = splitProps(props as SelectDescriptionProps, [
    "class",
  ]);
  return (
    <SelectPrimitive.Description
      class={cn(labelVariants({ variant: "description" }), local.class)}
      {...others}
    />
  );
};

type SelectErrorMessageProps<T extends ValidComponent = "div"> =
  & SelectPrimitive.SelectErrorMessageProps<T>
  & {
    class?: string | undefined;
  };

const SelectErrorMessage = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, SelectErrorMessageProps<T>>,
) => {
  const [local, others] = splitProps(props as SelectErrorMessageProps, [
    "class",
  ]);
  return (
    <SelectPrimitive.ErrorMessage
      class={cn(labelVariants({ variant: "error" }), local.class)}
      {...others}
    />
  );
};

export {
  Select,
  SelectContent,
  SelectDescription,
  SelectErrorMessage,
  SelectHiddenSelect,
  SelectItem,
  SelectLabel,
  SelectSection,
  SelectTrigger,
  SelectValue,
};

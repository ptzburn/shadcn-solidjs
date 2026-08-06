import * as DropdownMenuPrimitive from "@kobalte/core/dropdown-menu";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";

import { cn } from "~/lib/utils.ts";
import type { Component, ComponentProps, JSX, ValidComponent } from "solid-js";

import { mergeProps, splitProps } from "solid-js";
import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";

const DropdownMenuPortal = DropdownMenuPrimitive.Portal;
const DropdownMenuSub = DropdownMenuPrimitive.Sub;

const DropdownMenu: Component<DropdownMenuPrimitive.DropdownMenuRootProps> = (
  props,
) => {
  return <DropdownMenuPrimitive.Root gutter={4} {...props} />;
};

type DropdownMenuTriggerProps<T extends ValidComponent = "button"> =
  & DropdownMenuPrimitive.DropdownMenuTriggerProps<T>
  & { class?: string | undefined };

const DropdownMenuTrigger = <T extends ValidComponent = "button">(
  props: PolymorphicProps<T, DropdownMenuTriggerProps<T>>,
) => {
  return (
    <DropdownMenuPrimitive.Trigger
      data-slot="dropdown-menu-trigger"
      {...(props as DropdownMenuTriggerProps)}
    />
  );
};

type DropdownMenuGroupProps<T extends ValidComponent = "div"> =
  & DropdownMenuPrimitive.DropdownMenuGroupProps<T>
  & { class?: string | undefined };

const DropdownMenuGroup = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, DropdownMenuGroupProps<T>>,
) => {
  return (
    <DropdownMenuPrimitive.Group
      data-slot="dropdown-menu-group"
      {...(props as DropdownMenuGroupProps)}
    />
  );
};

type DropdownMenuRadioGroupProps<T extends ValidComponent = "div"> =
  & DropdownMenuPrimitive.DropdownMenuRadioGroupProps<T>
  & { class?: string | undefined };

const DropdownMenuRadioGroup = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, DropdownMenuRadioGroupProps<T>>,
) => {
  return (
    <DropdownMenuPrimitive.RadioGroup
      data-slot="dropdown-menu-radio-group"
      {...(props as DropdownMenuRadioGroupProps)}
    />
  );
};

type DropdownMenuContentProps<T extends ValidComponent = "div"> =
  & DropdownMenuPrimitive.DropdownMenuContentProps<T>
  & { class?: string | undefined };

const DropdownMenuContent = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, DropdownMenuContentProps<T>>,
) => {
  const [local, rest] = splitProps(props as DropdownMenuContentProps, [
    "class",
  ]);
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        data-slot="dropdown-menu-content"
        class={cn(
          "cn-dropdown-menu-content z-50 max-h-(--kb-popper-content-available-height) w-(--kb-popper-anchor-width) origin-(--kb-menu-content-transform-origin) overflow-x-hidden overflow-y-auto data-closed:overflow-hidden",
          local.class,
        )}
        {...rest}
      />
    </DropdownMenuPrimitive.Portal>
  );
};

type DropdownMenuItemProps<T extends ValidComponent = "div"> =
  & DropdownMenuPrimitive.DropdownMenuItemProps<T>
  & {
    class?: string | undefined;
    inset?: boolean;
    variant?: "default" | "destructive";
  };

const DropdownMenuItem = <T extends ValidComponent = "div">(
  rawProps: PolymorphicProps<T, DropdownMenuItemProps<T>>,
) => {
  const props = mergeProps(
    { variant: "default" as const },
    rawProps as DropdownMenuItemProps,
  );
  const [local, rest] = splitProps(props, ["class", "inset", "variant"]);
  return (
    <DropdownMenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-inset={local.inset}
      data-variant={local.variant}
      class={cn(
        "cn-dropdown-menu-item group/dropdown-menu-item relative flex cursor-default select-none items-center outline-hidden [&_svg]:pointer-events-none data-disabled:pointer-events-none [&_svg]:shrink-0 data-disabled:opacity-50",
        local.class,
      )}
      {...rest}
    />
  );
};

type DropdownMenuCheckboxItemProps<T extends ValidComponent = "div"> =
  & DropdownMenuPrimitive.DropdownMenuCheckboxItemProps<T>
  & {
    class?: string | undefined;
    children?: JSX.Element;
    inset?: boolean;
  };

const DropdownMenuCheckboxItem = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, DropdownMenuCheckboxItemProps<T>>,
) => {
  const [local, rest] = splitProps(props as DropdownMenuCheckboxItemProps, [
    "class",
    "children",
    "inset",
  ]);
  return (
    <DropdownMenuPrimitive.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      data-inset={local.inset}
      class={cn(
        "cn-dropdown-menu-checkbox-item relative flex cursor-default select-none items-center outline-hidden [&_svg]:pointer-events-none data-disabled:pointer-events-none [&_svg]:shrink-0 data-disabled:opacity-50",
        local.class,
      )}
      {...rest}
    >
      <span
        class="cn-dropdown-menu-item-indicator pointer-events-none"
        data-slot="dropdown-menu-checkbox-item-indicator"
      >
        <DropdownMenuPrimitive.ItemIndicator>
          <IconPlaceholder
            lucide="check"
            tabler="check"
            ph="check"
            ri="check-line"
            hugeicons="tick-02"
          />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {local.children}
    </DropdownMenuPrimitive.CheckboxItem>
  );
};

type DropdownMenuRadioItemProps<T extends ValidComponent = "div"> =
  & DropdownMenuPrimitive.DropdownMenuRadioItemProps<T>
  & {
    class?: string | undefined;
    children?: JSX.Element;
    inset?: boolean;
  };

const DropdownMenuRadioItem = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, DropdownMenuRadioItemProps<T>>,
) => {
  const [local, rest] = splitProps(props as DropdownMenuRadioItemProps, [
    "class",
    "children",
    "inset",
  ]);
  return (
    <DropdownMenuPrimitive.RadioItem
      data-slot="dropdown-menu-radio-item"
      data-inset={local.inset}
      class={cn(
        "cn-dropdown-menu-radio-item relative flex cursor-default select-none items-center outline-hidden [&_svg]:pointer-events-none data-disabled:pointer-events-none [&_svg]:shrink-0 data-disabled:opacity-50",
        local.class,
      )}
      {...rest}
    >
      <span
        class="cn-dropdown-menu-item-indicator pointer-events-none"
        data-slot="dropdown-menu-radio-item-indicator"
      >
        <DropdownMenuPrimitive.ItemIndicator>
          <IconPlaceholder
            lucide="check"
            tabler="check"
            ph="check"
            ri="check-line"
            hugeicons="tick-02"
          />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {local.children}
    </DropdownMenuPrimitive.RadioItem>
  );
};

const DropdownMenuLabel: Component<
  ComponentProps<"div"> & { inset?: boolean }
> = (props) => {
  const [local, rest] = splitProps(props, ["class", "inset"]);
  return (
    <div
      data-slot="dropdown-menu-label"
      data-inset={local.inset}
      class={cn(
        "cn-dropdown-menu-label",
        local.class,
      )}
      {...rest}
    />
  );
};

type DropdownMenuGroupLabelProps<T extends ValidComponent = "span"> =
  & DropdownMenuPrimitive.DropdownMenuGroupLabelProps<T>
  & { class?: string | undefined };

const DropdownMenuGroupLabel = <T extends ValidComponent = "span">(
  props: PolymorphicProps<T, DropdownMenuGroupLabelProps<T>>,
) => {
  const [local, rest] = splitProps(props as DropdownMenuGroupLabelProps, [
    "class",
  ]);
  return (
    <DropdownMenuPrimitive.GroupLabel
      data-slot="dropdown-menu-group-label"
      class={cn(
        "px-1.5 py-1 font-medium text-muted-foreground text-xs",
        local.class,
      )}
      {...rest}
    />
  );
};

type DropdownMenuSeparatorProps<T extends ValidComponent = "hr"> =
  & DropdownMenuPrimitive.DropdownMenuSeparatorProps<T>
  & { class?: string | undefined };

const DropdownMenuSeparator = <T extends ValidComponent = "hr">(
  props: PolymorphicProps<T, DropdownMenuSeparatorProps<T>>,
) => {
  const [local, rest] = splitProps(props as DropdownMenuSeparatorProps, [
    "class",
  ]);
  return (
    <DropdownMenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      class={cn("cn-dropdown-menu-separator", local.class)}
      {...rest}
    />
  );
};

const DropdownMenuShortcut: Component<ComponentProps<"span">> = (props) => {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      class={cn(
        "cn-dropdown-menu-shortcut",
        local.class,
      )}
      {...rest}
    />
  );
};

type DropdownMenuSubTriggerProps<T extends ValidComponent = "div"> =
  & DropdownMenuPrimitive.DropdownMenuSubTriggerProps<T>
  & {
    class?: string | undefined;
    children?: JSX.Element;
    inset?: boolean;
  };

const DropdownMenuSubTrigger = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, DropdownMenuSubTriggerProps<T>>,
) => {
  const [local, rest] = splitProps(props as DropdownMenuSubTriggerProps, [
    "class",
    "children",
    "inset",
  ]);
  return (
    <DropdownMenuPrimitive.SubTrigger
      data-slot="dropdown-menu-sub-trigger"
      data-inset={local.inset}
      class={cn(
        "cn-dropdown-menu-sub-trigger flex cursor-default select-none items-center outline-hidden [&_svg]:pointer-events-none [&_svg]:shrink-0",
        local.class,
      )}
      {...rest}
    >
      {local.children}
      <IconPlaceholder
        lucide="chevron-right"
        tabler="chevron-right"
        ph="caret-right"
        ri="arrow-right-s-line"
        hugeicons="arrow-right-01"
        class="cn-rtl-flip ml-auto"
      />
    </DropdownMenuPrimitive.SubTrigger>
  );
};

type DropdownMenuSubContentProps<T extends ValidComponent = "div"> =
  & DropdownMenuPrimitive.DropdownMenuSubContentProps<T>
  & { class?: string | undefined };

const DropdownMenuSubContent = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, DropdownMenuSubContentProps<T>>,
) => {
  const [local, rest] = splitProps(props as DropdownMenuSubContentProps, [
    "class",
  ]);
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.SubContent
        data-slot="dropdown-menu-sub-content"
        class={cn(
          "cn-dropdown-menu-sub-content z-50 origin-(--kb-menu-content-transform-origin) overflow-hidden",
          local.class,
        )}
        {...rest}
      />
    </DropdownMenuPrimitive.Portal>
  );
};

export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuGroupLabel,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
};

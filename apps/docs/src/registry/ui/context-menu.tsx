import type { Component, ComponentProps, JSX, ValidComponent } from "solid-js";
import { splitProps } from "solid-js";

import * as ContextMenuPrimitive from "@kobalte/core/context-menu";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";

import { cn } from "~/lib/utils.ts";
import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";

const ContextMenuTrigger = ContextMenuPrimitive.Trigger;
const ContextMenuPortal = ContextMenuPrimitive.Portal;
const ContextMenuSub = ContextMenuPrimitive.Sub;
const ContextMenuGroup = ContextMenuPrimitive.Group;
const ContextMenuRadioGroup = ContextMenuPrimitive.RadioGroup;

const ContextMenu: Component<ContextMenuPrimitive.ContextMenuRootProps> = (
  props,
) => {
  return <ContextMenuPrimitive.Root gutter={4} {...props} />;
};

type ContextMenuContentProps<T extends ValidComponent = "div"> =
  & ContextMenuPrimitive.ContextMenuContentProps<T>
  & {
    class?: string | undefined;
  };

const ContextMenuContent = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, ContextMenuContentProps<T>>,
) => {
  const [local, others] = splitProps(props as ContextMenuContentProps, [
    "class",
  ]);
  return (
    <ContextMenuPrimitive.Portal>
      <ContextMenuPrimitive.Content
        class={cn(
          "cn-context-menu-content z-50 origin-[var(--kb-menu-content-transform-origin)] overflow-hidden border",
          local.class,
        )}
        {...others}
      />
    </ContextMenuPrimitive.Portal>
  );
};

type ContextMenuItemProps<T extends ValidComponent = "div"> =
  & ContextMenuPrimitive.ContextMenuItemProps<T>
  & {
    class?: string | undefined;
  };

const ContextMenuItem = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, ContextMenuItemProps<T>>,
) => {
  const [local, others] = splitProps(props as ContextMenuItemProps, ["class"]);
  return (
    <ContextMenuPrimitive.Item
      class={cn(
        "cn-context-menu-item relative flex cursor-default select-none items-center outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        local.class,
      )}
      {...others}
    />
  );
};

const ContextMenuShortcut: Component<ComponentProps<"span">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <span
      class={cn("cn-context-menu-shortcut opacity-60", local.class)}
      {...others}
    />
  );
};

type ContextMenuSeparatorProps<T extends ValidComponent = "hr"> =
  & ContextMenuPrimitive.ContextMenuSeparatorProps<T>
  & {
    class?: string | undefined;
  };

const ContextMenuSeparator = <T extends ValidComponent = "hr">(
  props: PolymorphicProps<T, ContextMenuSeparatorProps<T>>,
) => {
  const [local, others] = splitProps(props as ContextMenuSeparatorProps, [
    "class",
  ]);
  return (
    <ContextMenuPrimitive.Separator
      class={cn("cn-context-menu-separator", local.class)}
      {...others}
    />
  );
};

type ContextMenuSubTriggerProps<T extends ValidComponent = "div"> =
  & ContextMenuPrimitive.ContextMenuSubTriggerProps<T>
  & {
    class?: string | undefined;
    children?: JSX.Element;
  };

const ContextMenuSubTrigger = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, ContextMenuSubTriggerProps<T>>,
) => {
  const [local, others] = splitProps(props as ContextMenuSubTriggerProps, [
    "class",
    "children",
  ]);
  return (
    <ContextMenuPrimitive.SubTrigger
      class={cn(
        "cn-context-menu-sub-trigger flex cursor-default select-none items-center outline-none",
        local.class,
      )}
      {...others}
    >
      {local.children}
      <IconPlaceholder
        lucide="chevron-right"
        tabler="chevron-right"
        ph="caret-right"
        ri="arrow-right-s-line"
        hugeicons="arrow-right-01"
        class="ml-auto size-4"
      />
    </ContextMenuPrimitive.SubTrigger>
  );
};

type ContextMenuSubContentProps<T extends ValidComponent = "div"> =
  & ContextMenuPrimitive.ContextMenuSubContentProps<T>
  & {
    class?: string | undefined;
  };

const ContextMenuSubContent = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, ContextMenuSubContentProps<T>>,
) => {
  const [local, others] = splitProps(props as ContextMenuSubContentProps, [
    "class",
  ]);
  return (
    <ContextMenuPrimitive.SubContent
      class={cn(
        "cn-context-menu-sub-content z-50 origin-[var(--kb-menu-content-transform-origin)] overflow-hidden",
        local.class,
      )}
      {...others}
    />
  );
};

type ContextMenuCheckboxItemProps<T extends ValidComponent = "div"> =
  & ContextMenuPrimitive.ContextMenuCheckboxItemProps<T>
  & {
    class?: string | undefined;
    children?: JSX.Element;
  };

const ContextMenuCheckboxItem = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, ContextMenuCheckboxItemProps<T>>,
) => {
  const [local, others] = splitProps(props as ContextMenuCheckboxItemProps, [
    "class",
    "children",
  ]);
  return (
    <ContextMenuPrimitive.CheckboxItem
      class={cn(
        "cn-context-menu-checkbox-item relative flex cursor-default select-none items-center outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        local.class,
      )}
      {...others}
    >
      <span class="cn-context-menu-item-indicator flex size-3.5 items-center justify-center">
        <ContextMenuPrimitive.ItemIndicator>
          <IconPlaceholder
            lucide="check"
            tabler="check"
            ph="check"
            ri="check-line"
            hugeicons="tick-02"
            class="size-4"
          />
        </ContextMenuPrimitive.ItemIndicator>
      </span>
      {local.children}
    </ContextMenuPrimitive.CheckboxItem>
  );
};

type ContextMenuGroupLabelProps<T extends ValidComponent = "span"> =
  & ContextMenuPrimitive.ContextMenuGroupLabelProps<T>
  & {
    class?: string | undefined;
  };

const ContextMenuGroupLabel = <T extends ValidComponent = "span">(
  props: PolymorphicProps<T, ContextMenuGroupLabelProps<T>>,
) => {
  const [local, others] = splitProps(props as ContextMenuGroupLabelProps, [
    "class",
  ]);
  return (
    <ContextMenuPrimitive.GroupLabel
      class={cn("cn-context-menu-label", local.class)}
      {...others}
    />
  );
};

type ContextMenuRadioItemProps<T extends ValidComponent = "div"> =
  & ContextMenuPrimitive.ContextMenuRadioItemProps<T>
  & {
    class?: string | undefined;
    children?: JSX.Element;
  };

const ContextMenuRadioItem = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, ContextMenuRadioItemProps<T>>,
) => {
  const [local, others] = splitProps(props as ContextMenuRadioItemProps, [
    "class",
    "children",
  ]);
  return (
    <ContextMenuPrimitive.RadioItem
      class={cn(
        "cn-context-menu-radio-item relative flex cursor-default select-none items-center outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        local.class,
      )}
      {...others}
    >
      <span class="cn-context-menu-item-indicator flex size-3.5 items-center justify-center">
        <ContextMenuPrimitive.ItemIndicator>
          <IconPlaceholder
            lucide="circle"
            tabler="circle"
            ph="circle"
            ri="circle-line"
            hugeicons="circle"
            class="size-2 fill-current"
          />
        </ContextMenuPrimitive.ItemIndicator>
      </span>
      {local.children}
    </ContextMenuPrimitive.RadioItem>
  );
};

export {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuGroupLabel,
  ContextMenuItem,
  ContextMenuPortal,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
};

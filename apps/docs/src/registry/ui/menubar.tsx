import * as MenubarPrimitive from "@kobalte/core/menubar";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";

import { cn } from "~/lib/utils.ts";
import type { Component, ComponentProps, JSX, ValidComponent } from "solid-js";

import { mergeProps, splitProps } from "solid-js";
import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";

const MenubarPortal = MenubarPrimitive.Portal;
const MenubarSub = MenubarPrimitive.Sub;

const MenubarMenu: Component<MenubarPrimitive.MenubarMenuProps> = (props) => {
  return <MenubarPrimitive.Menu gutter={8} {...props} />;
};

type MenubarGroupProps<T extends ValidComponent = "div"> =
  & MenubarPrimitive.MenubarGroupProps<T>
  & { class?: string | undefined };

const MenubarGroup = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, MenubarGroupProps<T>>,
) => {
  return (
    <MenubarPrimitive.Group
      data-slot="menubar-group"
      {...(props as MenubarGroupProps)}
    />
  );
};

type MenubarRadioGroupProps<T extends ValidComponent = "div"> =
  & MenubarPrimitive.MenubarRadioGroupProps<T>
  & { class?: string | undefined };

const MenubarRadioGroup = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, MenubarRadioGroupProps<T>>,
) => {
  return (
    <MenubarPrimitive.RadioGroup
      data-slot="menubar-radio-group"
      {...(props as MenubarRadioGroupProps)}
    />
  );
};

type MenubarRootProps<T extends ValidComponent = "div"> =
  & MenubarPrimitive.MenubarRootProps<T>
  & {
    class?: string | undefined;
  };

const Menubar = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, MenubarRootProps<T>>,
) => {
  const [local, others] = splitProps(props as MenubarRootProps, ["class"]);
  return (
    <MenubarPrimitive.Root
      data-slot="menubar"
      class={cn(
        "cn-menubar flex items-center",
        local.class,
      )}
      {...others}
    />
  );
};

type MenubarTriggerProps<T extends ValidComponent = "button"> =
  & MenubarPrimitive.MenubarTriggerProps<T>
  & { class?: string | undefined };

const MenubarTrigger = <T extends ValidComponent = "button">(
  props: PolymorphicProps<T, MenubarTriggerProps<T>>,
) => {
  const [local, others] = splitProps(props as MenubarTriggerProps, ["class"]);
  return (
    <MenubarPrimitive.Trigger
      data-slot="menubar-trigger"
      class={cn(
        "cn-menubar-trigger flex select-none items-center outline-hidden",
        local.class,
      )}
      {...others}
    />
  );
};

type MenubarContentProps<T extends ValidComponent = "div"> =
  & MenubarPrimitive.MenubarContentProps<T>
  & { class?: string | undefined };

const MenubarContent = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, MenubarContentProps<T>>,
) => {
  const [local, others] = splitProps(props as MenubarContentProps, ["class"]);
  return (
    <MenubarPrimitive.Portal>
      <MenubarPrimitive.Content
        data-slot="menubar-content"
        class={cn(
          "cn-menubar-content data-closed:fade-out-0 data-closed:zoom-out-95 z-50 origin-(--kb-menu-content-transform-origin) overflow-hidden data-closed:animate-out",
          local.class,
        )}
        {...others}
      />
    </MenubarPrimitive.Portal>
  );
};

type MenubarItemProps<T extends ValidComponent = "div"> =
  & MenubarPrimitive.MenubarItemProps<T>
  & {
    class?: string | undefined;
    inset?: boolean;
    variant?: "default" | "destructive";
  };

const MenubarItem = <T extends ValidComponent = "div">(
  rawProps: PolymorphicProps<T, MenubarItemProps<T>>,
) => {
  const props = mergeProps(
    { variant: "default" as const },
    rawProps as MenubarItemProps,
  );
  const [local, others] = splitProps(props, ["class", "inset", "variant"]);
  return (
    <MenubarPrimitive.Item
      data-slot="menubar-item"
      data-inset={local.inset}
      data-variant={local.variant}
      class={cn(
        "cn-menubar-item group/menubar-item relative flex cursor-default select-none items-center outline-hidden [&_svg]:pointer-events-none data-disabled:pointer-events-none [&_svg]:shrink-0",
        local.class,
      )}
      {...others}
    />
  );
};

type MenubarCheckboxItemProps<T extends ValidComponent = "div"> =
  & MenubarPrimitive.MenubarCheckboxItemProps<T>
  & {
    class?: string | undefined;
    children?: JSX.Element;
    inset?: boolean;
  };

const MenubarCheckboxItem = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, MenubarCheckboxItemProps<T>>,
) => {
  const [local, others] = splitProps(props as MenubarCheckboxItemProps, [
    "class",
    "children",
    "inset",
  ]);
  return (
    <MenubarPrimitive.CheckboxItem
      data-slot="menubar-checkbox-item"
      data-inset={local.inset}
      class={cn(
        "cn-menubar-checkbox-item relative flex cursor-default select-none items-center outline-hidden [&_svg]:pointer-events-none data-disabled:pointer-events-none [&_svg]:shrink-0",
        local.class,
      )}
      {...others}
    >
      <span
        class="cn-menubar-checkbox-item-indicator pointer-events-none absolute flex items-center justify-center"
        data-slot="menubar-checkbox-item-indicator"
      >
        <MenubarPrimitive.ItemIndicator>
          <IconPlaceholder
            lucide="check"
            tabler="check"
            ph="check"
            ri="check-line"
            hugeicons="tick-02"
          />
        </MenubarPrimitive.ItemIndicator>
      </span>
      {local.children}
    </MenubarPrimitive.CheckboxItem>
  );
};

type MenubarRadioItemProps<T extends ValidComponent = "div"> =
  & MenubarPrimitive.MenubarRadioItemProps<T>
  & {
    class?: string | undefined;
    children?: JSX.Element;
    inset?: boolean;
  };

const MenubarRadioItem = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, MenubarRadioItemProps<T>>,
) => {
  const [local, others] = splitProps(props as MenubarRadioItemProps, [
    "class",
    "children",
    "inset",
  ]);
  return (
    <MenubarPrimitive.RadioItem
      data-slot="menubar-radio-item"
      data-inset={local.inset}
      class={cn(
        "cn-menubar-radio-item relative flex cursor-default select-none items-center outline-hidden [&_svg]:pointer-events-none data-disabled:pointer-events-none [&_svg]:shrink-0",
        local.class,
      )}
      {...others}
    >
      <span
        class="cn-menubar-radio-item-indicator pointer-events-none absolute flex items-center justify-center"
        data-slot="menubar-radio-item-indicator"
      >
        <MenubarPrimitive.ItemIndicator>
          <IconPlaceholder
            lucide="check"
            tabler="check"
            ph="check"
            ri="check-line"
            hugeicons="tick-02"
          />
        </MenubarPrimitive.ItemIndicator>
      </span>
      {local.children}
    </MenubarPrimitive.RadioItem>
  );
};

const MenubarLabel: Component<ComponentProps<"div"> & { inset?: boolean }> = (
  props,
) => {
  const [local, others] = splitProps(props, ["class", "inset"]);
  return (
    <div
      data-slot="menubar-label"
      data-inset={local.inset}
      class={cn(
        "cn-menubar-label",
        local.class,
      )}
      {...others}
    />
  );
};

type MenubarItemLabelProps<T extends ValidComponent = "div"> =
  & MenubarPrimitive.MenubarItemLabelProps<T>
  & {
    class?: string | undefined;
    inset?: boolean;
  };

const MenubarItemLabel = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, MenubarItemLabelProps<T>>,
) => {
  const [local, others] = splitProps(props as MenubarItemLabelProps, [
    "class",
    "inset",
  ]);
  return (
    <MenubarPrimitive.ItemLabel
      data-slot="menubar-item-label"
      data-inset={local.inset}
      class={cn(
        "px-1.5 py-1 font-medium text-sm data-inset:pl-7",
        local.class,
      )}
      {...others}
    />
  );
};

type MenubarGroupLabelProps<T extends ValidComponent = "span"> =
  & MenubarPrimitive.MenubarGroupLabelProps<T>
  & {
    class?: string | undefined;
    inset?: boolean;
  };

const MenubarGroupLabel = <T extends ValidComponent = "span">(
  props: PolymorphicProps<T, MenubarGroupLabelProps<T>>,
) => {
  const [local, others] = splitProps(props as MenubarGroupLabelProps, [
    "class",
    "inset",
  ]);
  return (
    <MenubarPrimitive.GroupLabel
      data-slot="menubar-group-label"
      data-inset={local.inset}
      class={cn(
        "px-1.5 py-1 font-medium text-sm data-inset:pl-7",
        local.class,
      )}
      {...others}
    />
  );
};

type MenubarSeparatorProps<T extends ValidComponent = "hr"> =
  & MenubarPrimitive.MenubarSeparatorProps<T>
  & { class?: string | undefined };

const MenubarSeparator = <T extends ValidComponent = "hr">(
  props: PolymorphicProps<T, MenubarSeparatorProps<T>>,
) => {
  const [local, others] = splitProps(props as MenubarSeparatorProps, ["class"]);
  return (
    <MenubarPrimitive.Separator
      data-slot="menubar-separator"
      class={cn("cn-menubar-separator -mx-1 my-1 h-px", local.class)}
      {...others}
    />
  );
};

const MenubarShortcut: Component<ComponentProps<"span">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <span
      data-slot="menubar-shortcut"
      class={cn(
        "cn-menubar-shortcut ml-auto",
        local.class,
      )}
      {...others}
    />
  );
};

type MenubarSubTriggerProps<T extends ValidComponent = "div"> =
  & MenubarPrimitive.MenubarSubTriggerProps<T>
  & {
    class?: string | undefined;
    children?: JSX.Element;
    inset?: boolean;
  };

const MenubarSubTrigger = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, MenubarSubTriggerProps<T>>,
) => {
  const [local, others] = splitProps(props as MenubarSubTriggerProps, [
    "class",
    "children",
    "inset",
  ]);
  return (
    <MenubarPrimitive.SubTrigger
      data-slot="menubar-sub-trigger"
      data-inset={local.inset}
      class={cn(
        "cn-menubar-sub-trigger flex cursor-default select-none items-center outline-hidden [&_svg]:pointer-events-none [&_svg]:shrink-0",
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
        class="cn-rtl-flip ml-auto"
      />
    </MenubarPrimitive.SubTrigger>
  );
};

type MenubarSubContentProps<T extends ValidComponent = "div"> =
  & MenubarPrimitive.MenubarSubContentProps<T>
  & {
    class?: string | undefined;
  };

const MenubarSubContent = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, MenubarSubContentProps<T>>,
) => {
  const [local, others] = splitProps(props as MenubarSubContentProps, [
    "class",
  ]);
  return (
    <MenubarPrimitive.Portal>
      <MenubarPrimitive.SubContent
        data-slot="menubar-sub-content"
        class={cn(
          "cn-menubar-sub-content z-50 origin-(--kb-menu-content-transform-origin) overflow-hidden",
          local.class,
        )}
        {...others}
      />
    </MenubarPrimitive.Portal>
  );
};

export {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarGroup,
  MenubarGroupLabel,
  MenubarItem,
  MenubarItemLabel,
  MenubarLabel,
  MenubarMenu,
  MenubarPortal,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
};

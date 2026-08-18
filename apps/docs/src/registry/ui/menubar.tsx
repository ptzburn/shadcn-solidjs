import * as MenubarPrimitive from "@kobalte/core/menubar";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import type { ComponentProps, JSX, ValidComponent } from "@solidjs/web";
import { cn } from "~/lib/utils.ts";
import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";
import type { Component } from "solid-js";

import { omit } from "solid-js";

const MenubarPortal = MenubarPrimitive.Portal;
const MenubarSub = MenubarPrimitive.Sub;

type MenubarRootProps<T extends ValidComponent = "div"> =
  & MenubarPrimitive.MenubarRootProps<T>
  & {
    class?: string | undefined;
  };

const Menubar = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, MenubarRootProps<T>>,
) => {
  const local = props as MenubarRootProps;
  const others = omit(local, "class");
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

const MenubarMenu: Component<MenubarPrimitive.MenubarMenuProps> = (props) => {
  return <MenubarPrimitive.Menu gutter={8} shift={-4} {...props} />;
};

type MenubarGroupProps<T extends ValidComponent = "div"> =
  MenubarPrimitive.MenubarGroupProps<T>;

const MenubarGroup = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, MenubarGroupProps<T>>,
) => {
  return <MenubarPrimitive.Group data-slot="menubar-group" {...props} />;
};

type MenubarRadioGroupProps<T extends ValidComponent = "div"> =
  MenubarPrimitive.MenubarRadioGroupProps<T>;

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

type MenubarTriggerProps<T extends ValidComponent = "button"> =
  & MenubarPrimitive.MenubarTriggerProps<T>
  & {
    class?: string | undefined;
  };

const MenubarTrigger = <T extends ValidComponent = "button">(
  props: PolymorphicProps<T, MenubarTriggerProps<T>>,
) => {
  const local = props as MenubarTriggerProps;
  const others = omit(local, "class");
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
  & {
    class?: string | undefined;
  };

const MenubarContent = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, MenubarContentProps<T>>,
) => {
  const local = props as MenubarContentProps;
  const others = omit(local, "class");
  return (
    <MenubarPrimitive.Portal>
      <MenubarPrimitive.Content
        data-slot="menubar-content"
        class={cn(
          "cn-menubar-content z-50 origin-(--kb-menu-content-transform-origin) overflow-hidden",
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
  props: PolymorphicProps<T, MenubarItemProps<T>>,
) => {
  const local = props as MenubarItemProps;
  const others = omit(local, "class", "inset", "variant");
  return (
    <MenubarPrimitive.Item
      data-slot="menubar-item"
      data-inset={local.inset}
      data-variant={local.variant ?? "default"}
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
  const local = props as MenubarCheckboxItemProps;
  const others = omit(local, "class", "children", "inset");
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
      <span class="cn-menubar-checkbox-item-indicator pointer-events-none absolute flex items-center justify-center">
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
  const local = props as MenubarRadioItemProps;
  const others = omit(local, "class", "children", "inset");
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
      <span class="cn-menubar-radio-item-indicator pointer-events-none absolute flex items-center justify-center">
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

type MenubarLabelProps<T extends ValidComponent = "div"> =
  & MenubarPrimitive.MenubarGroupLabelProps<T>
  & {
    class?: string | undefined;
    inset?: boolean;
  };

const MenubarLabel = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, MenubarLabelProps<T>>,
) => {
  const local = props as MenubarLabelProps;
  const others = omit(local, "class", "inset");
  return (
    <MenubarPrimitive.GroupLabel
      as="div"
      data-slot="menubar-label"
      data-inset={local.inset}
      class={cn("cn-menubar-label", local.class)}
      {...others}
    />
  );
};

type MenubarSeparatorProps<T extends ValidComponent = "div"> =
  & MenubarPrimitive.MenubarSeparatorProps<T>
  & {
    class?: string | undefined;
  };

const MenubarSeparator = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, MenubarSeparatorProps<T>>,
) => {
  const local = props as MenubarSeparatorProps;
  const others = omit(local, "class");
  return (
    <MenubarPrimitive.Separator
      as="div"
      data-slot="menubar-separator"
      class={cn("cn-menubar-separator -mx-1 my-1 h-px", local.class)}
      {...others}
    />
  );
};

const MenubarShortcut: Component<ComponentProps<"span">> = (props) => {
  const others = omit(props, "class");
  return (
    <span
      data-slot="menubar-shortcut"
      class={cn(
        "cn-menubar-shortcut ml-auto",
        props.class,
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
  const local = props as MenubarSubTriggerProps;
  const others = omit(local, "class", "children", "inset");
  return (
    <MenubarPrimitive.SubTrigger
      data-slot="menubar-sub-trigger"
      data-inset={local.inset}
      class={cn(
        "cn-menubar-sub-trigger flex cursor-default select-none items-center outline-none",
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
        class="cn-rtl-flip ml-auto size-4"
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
  const local = props as MenubarSubContentProps;
  const others = omit(local, "class");
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
  MenubarItem,
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

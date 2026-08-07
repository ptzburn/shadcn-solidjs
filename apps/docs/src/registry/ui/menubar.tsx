import type { Component, ComponentProps, JSX, ValidComponent } from "solid-js";
import { splitProps } from "solid-js";

import * as MenubarPrimitive from "@kobalte/core/menubar";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";

import { cn } from "~/lib/utils.ts";
import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";

// Kobalte's Portal and Sub render no DOM node, so unlike upstream there is
// no element to stamp a data-slot attribute on.
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
  const [local, others] = splitProps(props as MenubarRootProps, ["class"]);
  return (
    <MenubarPrimitive.Root
      data-slot="menubar"
      class={cn("cn-menubar flex items-center", local.class)}
      {...others}
    />
  );
};

// Kobalte's MenubarMenu renders no DOM node either; the popper offsets live
// here instead of on the content, matching upstream's sideOffset={8} and
// alignOffset={-4} (Kobalte's popper defaults to gutter 0, shift 0).
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
  const [local, others] = splitProps(props as MenubarTriggerProps, ["class"]);
  return (
    <MenubarPrimitive.Trigger
      data-slot="menubar-trigger"
      class={cn(
        "cn-menubar-trigger flex items-center outline-hidden select-none",
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
  const [local, others] = splitProps(props as MenubarContentProps, ["class"]);
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
  const [local, others] = splitProps(props as MenubarItemProps, [
    "class",
    "inset",
    "variant",
  ]);
  return (
    <MenubarPrimitive.Item
      data-slot="menubar-item"
      data-inset={local.inset}
      data-variant={local.variant ?? "default"}
      class={cn(
        "cn-menubar-item group/menubar-item relative flex cursor-default items-center outline-hidden select-none data-disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0",
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
        "cn-menubar-checkbox-item relative flex cursor-default items-center outline-hidden select-none data-disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0",
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
        "cn-menubar-radio-item relative flex cursor-default items-center outline-hidden select-none data-disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0",
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

// Rendered as a div like the upstream radix label: Kobalte's GroupLabel
// defaults to an inline span, which would collapse the label's vertical
// padding. Unlike radix, it must live inside a Group or RadioGroup.
const MenubarLabel = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, MenubarLabelProps<T>>,
) => {
  const [local, others] = splitProps(props as MenubarLabelProps, [
    "class",
    "inset",
  ]);
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

// Rendered as a div like the upstream radix separator: tailwind's
// preflight and typeset both style hr (stray top border, height: 0,
// prose margins), which Kobalte's Separator renders by default.
const MenubarSeparator = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, MenubarSeparatorProps<T>>,
) => {
  const [local, others] = splitProps(props as MenubarSeparatorProps, ["class"]);
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
  const [local, others] = splitProps(props, ["class"]);
  return (
    <span
      data-slot="menubar-shortcut"
      class={cn("cn-menubar-shortcut ml-auto", local.class)}
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
        "cn-menubar-sub-trigger flex cursor-default items-center outline-none select-none",
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

// Unlike upstream, the sub content is portalled: Kobalte renders it
// inside the parent menu content, whose overflow-hidden would clip it.
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

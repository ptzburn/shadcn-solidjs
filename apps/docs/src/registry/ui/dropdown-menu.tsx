import * as DropdownMenuPrimitive from "@kobalte/core/dropdown-menu";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";

import { cn } from "~/lib/utils.ts";
import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";

import type { Component, ComponentProps, JSX, ValidComponent } from "solid-js";
import { splitProps } from "solid-js";

// Kobalte's DropdownMenuRoot, Portal and Sub render no DOM node, so unlike
// upstream there is no element to stamp a data-slot attribute on. The
// gutter matches upstream's sideOffset={4} (Kobalte's popper defaults to 0).
const DropdownMenu: Component<DropdownMenuPrimitive.DropdownMenuRootProps> = (
  props,
) => {
  return <DropdownMenuPrimitive.Root gutter={4} {...props} />;
};

const DropdownMenuPortal = DropdownMenuPrimitive.Portal;
const DropdownMenuSub = DropdownMenuPrimitive.Sub;

type DropdownMenuTriggerProps<T extends ValidComponent = "button"> =
  & DropdownMenuPrimitive.DropdownMenuTriggerProps<T>
  & {
    class?: string | undefined;
  };

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

type DropdownMenuContentProps<T extends ValidComponent = "div"> =
  & DropdownMenuPrimitive.DropdownMenuContentProps<T>
  & {
    class?: string | undefined;
  };

const DropdownMenuContent = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, DropdownMenuContentProps<T>>,
) => {
  const [local, others] = splitProps(props as DropdownMenuContentProps, [
    "class",
  ]);
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        data-slot="dropdown-menu-content"
        class={cn(
          "cn-dropdown-menu-content z-50 max-h-(--kb-popper-content-available-height) w-(--kb-popper-anchor-width) origin-(--kb-menu-content-transform-origin) overflow-y-auto overflow-x-hidden data-closed:overflow-hidden",
          local.class,
        )}
        {...others}
      />
    </DropdownMenuPrimitive.Portal>
  );
};

type DropdownMenuGroupProps<T extends ValidComponent = "div"> =
  DropdownMenuPrimitive.DropdownMenuGroupProps<T>;

const DropdownMenuGroup = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, DropdownMenuGroupProps<T>>,
) => {
  return (
    <DropdownMenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />
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
  props: PolymorphicProps<T, DropdownMenuItemProps<T>>,
) => {
  const [local, others] = splitProps(props as DropdownMenuItemProps, [
    "class",
    "inset",
    "variant",
  ]);
  return (
    <DropdownMenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-inset={local.inset}
      data-variant={local.variant ?? "default"}
      class={cn(
        "cn-dropdown-menu-item group/dropdown-menu-item relative flex cursor-default select-none items-center outline-hidden [&_svg]:pointer-events-none data-disabled:pointer-events-none [&_svg]:shrink-0 data-disabled:opacity-50",
        local.class,
      )}
      {...others}
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
  const [local, others] = splitProps(props as DropdownMenuCheckboxItemProps, [
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
      {...others}
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

type DropdownMenuRadioGroupProps<T extends ValidComponent = "div"> =
  DropdownMenuPrimitive.DropdownMenuRadioGroupProps<T>;

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
  const [local, others] = splitProps(props as DropdownMenuRadioItemProps, [
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
      {...others}
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

type DropdownMenuLabelProps<T extends ValidComponent = "div"> =
  & DropdownMenuPrimitive.DropdownMenuGroupLabelProps<T>
  & {
    class?: string | undefined;
    inset?: boolean;
  };

// Rendered as a div like the upstream radix label: Kobalte's GroupLabel
// defaults to an inline span, which would collapse the label's vertical
// padding. Unlike radix, it must live inside a Group or RadioGroup.
const DropdownMenuLabel = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, DropdownMenuLabelProps<T>>,
) => {
  const [local, others] = splitProps(props as DropdownMenuLabelProps, [
    "class",
    "inset",
  ]);
  return (
    <DropdownMenuPrimitive.GroupLabel
      as="div"
      data-slot="dropdown-menu-label"
      data-inset={local.inset}
      class={cn("cn-dropdown-menu-label", local.class)}
      {...others}
    />
  );
};

type DropdownMenuSeparatorProps<T extends ValidComponent = "div"> =
  & DropdownMenuPrimitive.DropdownMenuSeparatorProps<T>
  & {
    class?: string | undefined;
  };

// Rendered as a div like the upstream radix separator: tailwind's
// preflight and typeset both style hr (stray top border, height: 0,
// prose margins), which Kobalte's Separator renders by default.
const DropdownMenuSeparator = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, DropdownMenuSeparatorProps<T>>,
) => {
  const [local, others] = splitProps(props as DropdownMenuSeparatorProps, [
    "class",
  ]);
  return (
    <DropdownMenuPrimitive.Separator
      as="div"
      data-slot="dropdown-menu-separator"
      class={cn("cn-dropdown-menu-separator", local.class)}
      {...others}
    />
  );
};

const DropdownMenuShortcut: Component<ComponentProps<"span">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      class={cn("cn-dropdown-menu-shortcut", local.class)}
      {...others}
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
  const [local, others] = splitProps(props as DropdownMenuSubTriggerProps, [
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
    </DropdownMenuPrimitive.SubTrigger>
  );
};

type DropdownMenuSubContentProps<T extends ValidComponent = "div"> =
  & DropdownMenuPrimitive.DropdownMenuSubContentProps<T>
  & {
    class?: string | undefined;
  };

// Unlike upstream, the sub content is portalled: Kobalte renders it
// inside the parent menu content, whose overflow-hidden would clip it.
const DropdownMenuSubContent = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, DropdownMenuSubContentProps<T>>,
) => {
  const [local, others] = splitProps(props as DropdownMenuSubContentProps, [
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
        {...others}
      />
    </DropdownMenuPrimitive.Portal>
  );
};

export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
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

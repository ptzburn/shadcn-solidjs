import * as ContextMenuPrimitive from "@kobalte/core/context-menu";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import type { ComponentProps, JSX, ValidComponent } from "@solidjs/web";
import { cn } from "~/lib/utils.ts";
import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";
import type { Component } from "solid-js";

import { omit } from "solid-js";

const ContextMenu: Component<ContextMenuPrimitive.ContextMenuRootProps> = (
  props,
) => {
  return <ContextMenuPrimitive.Root {...props} />;
};

const ContextMenuPortal = ContextMenuPrimitive.Portal;
const ContextMenuSub = ContextMenuPrimitive.Sub;

type ContextMenuTriggerProps<T extends ValidComponent = "div"> =
  & ContextMenuPrimitive.ContextMenuTriggerProps<T>
  & {
    class?: string | undefined;
  };

const ContextMenuTrigger = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, ContextMenuTriggerProps<T>>,
) => {
  const local = props as ContextMenuTriggerProps;
  const others = omit(local, "class");
  return (
    <ContextMenuPrimitive.Trigger
      data-slot="context-menu-trigger"
      class={cn("cn-context-menu-trigger select-none", local.class)}
      {...others}
    />
  );
};

type ContextMenuGroupProps<T extends ValidComponent = "div"> =
  ContextMenuPrimitive.ContextMenuGroupProps<T>;

const ContextMenuGroup = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, ContextMenuGroupProps<T>>,
) => {
  return (
    <ContextMenuPrimitive.Group data-slot="context-menu-group" {...props} />
  );
};

type ContextMenuRadioGroupProps<T extends ValidComponent = "div"> =
  ContextMenuPrimitive.ContextMenuRadioGroupProps<T>;

const ContextMenuRadioGroup = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, ContextMenuRadioGroupProps<T>>,
) => {
  return (
    <ContextMenuPrimitive.RadioGroup
      data-slot="context-menu-radio-group"
      {...(props as ContextMenuRadioGroupProps)}
    />
  );
};

type ContextMenuContentProps<T extends ValidComponent = "div"> =
  & ContextMenuPrimitive.ContextMenuContentProps<T>
  & {
    class?: string | undefined;
  };

const ContextMenuContent = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, ContextMenuContentProps<T>>,
) => {
  const local = props as ContextMenuContentProps;
  const others = omit(local, "class");
  return (
    <ContextMenuPrimitive.Portal>
      <ContextMenuPrimitive.Content
        data-slot="context-menu-content"
        class={cn(
          "cn-context-menu-content z-50 max-h-(--kb-popper-content-available-height) origin-(--kb-menu-content-transform-origin) overflow-y-auto overflow-x-hidden",
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
    inset?: boolean;
    variant?: "default" | "destructive";
  };

const ContextMenuItem = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, ContextMenuItemProps<T>>,
) => {
  const local = props as ContextMenuItemProps;
  const others = omit(local, "class", "inset", "variant");
  return (
    <ContextMenuPrimitive.Item
      data-slot="context-menu-item"
      data-inset={local.inset}
      data-variant={local.variant ?? "default"}
      class={cn(
        "cn-context-menu-item group/context-menu-item relative flex cursor-default select-none items-center outline-hidden [&_svg]:pointer-events-none data-disabled:pointer-events-none [&_svg]:shrink-0 data-disabled:opacity-50",
        local.class,
      )}
      {...others}
    />
  );
};

type ContextMenuSubTriggerProps<T extends ValidComponent = "div"> =
  & ContextMenuPrimitive.ContextMenuSubTriggerProps<T>
  & {
    class?: string | undefined;
    children?: JSX.Element;
    inset?: boolean;
  };

const ContextMenuSubTrigger = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, ContextMenuSubTriggerProps<T>>,
) => {
  const local = props as ContextMenuSubTriggerProps;
  const others = omit(local, "class", "children", "inset");
  return (
    <ContextMenuPrimitive.SubTrigger
      data-slot="context-menu-sub-trigger"
      data-inset={local.inset}
      class={cn(
        "cn-context-menu-sub-trigger flex cursor-default select-none items-center outline-hidden [&_svg]:pointer-events-none [&_svg]:shrink-0",
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
  const local = props as ContextMenuSubContentProps;
  const others = omit(local, "class");
  return (
    <ContextMenuPrimitive.Portal>
      <ContextMenuPrimitive.SubContent
        data-slot="context-menu-sub-content"
        class={cn(
          "cn-context-menu-sub-content z-50 origin-(--kb-menu-content-transform-origin) overflow-hidden",
          local.class,
        )}
        {...others}
      />
    </ContextMenuPrimitive.Portal>
  );
};

type ContextMenuCheckboxItemProps<T extends ValidComponent = "div"> =
  & ContextMenuPrimitive.ContextMenuCheckboxItemProps<T>
  & {
    class?: string | undefined;
    children?: JSX.Element;
    inset?: boolean;
  };

const ContextMenuCheckboxItem = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, ContextMenuCheckboxItemProps<T>>,
) => {
  const local = props as ContextMenuCheckboxItemProps;
  const others = omit(local, "class", "children", "inset");
  return (
    <ContextMenuPrimitive.CheckboxItem
      data-slot="context-menu-checkbox-item"
      data-inset={local.inset}
      class={cn(
        "cn-context-menu-checkbox-item relative flex cursor-default select-none items-center outline-hidden [&_svg]:pointer-events-none data-disabled:pointer-events-none [&_svg]:shrink-0 data-disabled:opacity-50",
        local.class,
      )}
      {...others}
    >
      <span class="cn-context-menu-item-indicator pointer-events-none">
        <ContextMenuPrimitive.ItemIndicator>
          <IconPlaceholder
            lucide="check"
            tabler="check"
            ph="check"
            ri="check-line"
            hugeicons="tick-02"
          />
        </ContextMenuPrimitive.ItemIndicator>
      </span>
      {local.children}
    </ContextMenuPrimitive.CheckboxItem>
  );
};

type ContextMenuRadioItemProps<T extends ValidComponent = "div"> =
  & ContextMenuPrimitive.ContextMenuRadioItemProps<T>
  & {
    class?: string | undefined;
    children?: JSX.Element;
    inset?: boolean;
  };

const ContextMenuRadioItem = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, ContextMenuRadioItemProps<T>>,
) => {
  const local = props as ContextMenuRadioItemProps;
  const others = omit(local, "class", "children", "inset");
  return (
    <ContextMenuPrimitive.RadioItem
      data-slot="context-menu-radio-item"
      data-inset={local.inset}
      class={cn(
        "cn-context-menu-radio-item relative flex cursor-default select-none items-center outline-hidden [&_svg]:pointer-events-none data-disabled:pointer-events-none [&_svg]:shrink-0 data-disabled:opacity-50",
        local.class,
      )}
      {...others}
    >
      <span class="cn-context-menu-item-indicator pointer-events-none">
        <ContextMenuPrimitive.ItemIndicator>
          <IconPlaceholder
            lucide="check"
            tabler="check"
            ph="check"
            ri="check-line"
            hugeicons="tick-02"
          />
        </ContextMenuPrimitive.ItemIndicator>
      </span>
      {local.children}
    </ContextMenuPrimitive.RadioItem>
  );
};

type ContextMenuLabelProps<T extends ValidComponent = "div"> =
  & ContextMenuPrimitive.ContextMenuGroupLabelProps<T>
  & {
    class?: string | undefined;
    inset?: boolean;
  };

const ContextMenuLabel = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, ContextMenuLabelProps<T>>,
) => {
  const local = props as ContextMenuLabelProps;
  const others = omit(local, "class", "inset");
  return (
    <ContextMenuPrimitive.GroupLabel
      as="div"
      data-slot="context-menu-label"
      data-inset={local.inset}
      class={cn(
        "cn-context-menu-label",
        local.class,
      )}
      {...others}
    />
  );
};

type ContextMenuSeparatorProps<T extends ValidComponent = "div"> =
  & ContextMenuPrimitive.ContextMenuSeparatorProps<T>
  & {
    class?: string | undefined;
  };

const ContextMenuSeparator = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, ContextMenuSeparatorProps<T>>,
) => {
  const local = props as ContextMenuSeparatorProps;
  const others = omit(local, "class");
  return (
    <ContextMenuPrimitive.Separator
      as="div"
      data-slot="context-menu-separator"
      class={cn("cn-context-menu-separator", local.class)}
      {...others}
    />
  );
};

const ContextMenuShortcut: Component<ComponentProps<"span">> = (props) => {
  const others = omit(props, "class");
  return (
    <span
      data-slot="context-menu-shortcut"
      class={cn(
        "cn-context-menu-shortcut",
        props.class,
      )}
      {...others}
    />
  );
};

export {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
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

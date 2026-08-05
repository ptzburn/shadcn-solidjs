import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import * as PopoverPrimitive from "@kobalte/core/popover";

import { cn } from "~/lib/utils.ts";
import type { Component, ComponentProps, ValidComponent } from "solid-js";

import { splitProps } from "solid-js";

const Popover: Component<PopoverPrimitive.PopoverRootProps> = (props) => {
  return <PopoverPrimitive.Root data-slot="popover" gutter={4} {...props} />;
};

type PopoverTriggerProps<T extends ValidComponent = "button"> =
  & PopoverPrimitive.PopoverTriggerProps<T>
  & { class?: string | undefined };

const PopoverTrigger = <T extends ValidComponent = "button">(
  props: PolymorphicProps<T, PopoverTriggerProps<T>>,
) => {
  return (
    <PopoverPrimitive.Trigger
      data-slot="popover-trigger"
      {...(props as PopoverTriggerProps)}
    />
  );
};

type PopoverAnchorProps<T extends ValidComponent = "div"> =
  PopoverPrimitive.PopoverAnchorProps<T>;

const PopoverAnchor = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, PopoverAnchorProps<T>>,
) => {
  return (
    <PopoverPrimitive.Anchor
      data-slot="popover-anchor"
      {...(props as PopoverAnchorProps)}
    />
  );
};

type PopoverContentProps<T extends ValidComponent = "div"> =
  & PopoverPrimitive.PopoverContentProps<T>
  & { class?: string | undefined };

const PopoverContent = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, PopoverContentProps<T>>,
) => {
  const [local, others] = splitProps(props as PopoverContentProps, ["class"]);
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        data-slot="popover-content"
        class={cn(
          "data-closed:fade-out-0 data-closed:zoom-out-95 data-expanded:fade-in-0 data-expanded:zoom-in-95 z-50 flex w-72 flex-col origin-(--kb-popover-content-transform-origin) gap-2.5 rounded-lg bg-popover p-2.5 text-popover-foreground text-sm shadow-md outline-hidden ring-1 ring-foreground/10 duration-100 data-closed:animate-out data-expanded:animate-in",
          local.class,
        )}
        {...others}
      />
    </PopoverPrimitive.Portal>
  );
};

const PopoverHeader: Component<ComponentProps<"div">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <div
      data-slot="popover-header"
      class={cn("flex flex-col gap-0.5 text-sm", local.class)}
      {...others}
    />
  );
};

type PopoverTitleProps<T extends ValidComponent = "h2"> =
  & PopoverPrimitive.PopoverTitleProps<T>
  & { class?: string | undefined };

const PopoverTitle = <T extends ValidComponent = "h2">(
  props: PolymorphicProps<T, PopoverTitleProps<T>>,
) => {
  const [local, others] = splitProps(props as PopoverTitleProps, ["class"]);
  return (
    <PopoverPrimitive.Title
      data-slot="popover-title"
      class={cn("font-medium", local.class)}
      {...others}
    />
  );
};

type PopoverDescriptionProps<T extends ValidComponent = "p"> =
  & PopoverPrimitive.PopoverDescriptionProps<T>
  & { class?: string | undefined };

const PopoverDescription = <T extends ValidComponent = "p">(
  props: PolymorphicProps<T, PopoverDescriptionProps<T>>,
) => {
  const [local, others] = splitProps(props as PopoverDescriptionProps, [
    "class",
  ]);
  return (
    <PopoverPrimitive.Description
      data-slot="popover-description"
      class={cn("text-muted-foreground", local.class)}
      {...others}
    />
  );
};

export {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
};

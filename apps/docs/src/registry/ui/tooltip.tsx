import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import * as TooltipPrimitive from "@kobalte/core/tooltip";

import { cn } from "~/lib/utils.ts";
import type { Component, JSX, ValidComponent } from "solid-js";

import { splitProps } from "solid-js";

const Tooltip: Component<TooltipPrimitive.TooltipRootProps> = (props) => {
  return <TooltipPrimitive.Root data-slot="tooltip" gutter={4} {...props} />;
};

type TooltipTriggerProps<T extends ValidComponent = "button"> =
  & TooltipPrimitive.TooltipTriggerProps<T>
  & { class?: string | undefined };

const TooltipTrigger = <T extends ValidComponent = "button">(
  props: PolymorphicProps<T, TooltipTriggerProps<T>>,
) => {
  return (
    <TooltipPrimitive.Trigger
      data-slot="tooltip-trigger"
      {...(props as TooltipTriggerProps)}
    />
  );
};

type TooltipContentProps<T extends ValidComponent = "div"> =
  & TooltipPrimitive.TooltipContentProps<T>
  & { class?: string | undefined; children?: JSX.Element };

const TooltipContent = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, TooltipContentProps<T>>,
) => {
  const [local, others] = splitProps(props as TooltipContentProps, [
    "class",
    "children",
  ]);
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        class={cn(
          "data-closed:fade-out-0 data-closed:zoom-out-95 data-expanded:fade-in-0 data-expanded:zoom-in-95 z-50 inline-flex w-fit max-w-xs origin-(--kb-tooltip-content-transform-origin) items-center gap-1.5 rounded-md bg-foreground px-3 py-1.5 text-background text-xs duration-100 data-closed:animate-out data-expanded:animate-in",
          local.class,
        )}
        {...others}
      >
        {local.children}
        <TooltipPrimitive.Arrow />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
};

export { Tooltip, TooltipContent, TooltipTrigger };

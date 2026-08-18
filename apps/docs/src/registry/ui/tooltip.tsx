import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import { usePopperContext } from "@kobalte/core/popper";
import * as TooltipPrimitive from "@kobalte/core/tooltip";
import type { JSX, ValidComponent } from "@solidjs/web";
import { cn } from "~/lib/utils.ts";
import type { Component } from "solid-js";

import { omit } from "solid-js";

const Tooltip: Component<TooltipPrimitive.TooltipRootProps> = (props) => {
  return (
    <TooltipPrimitive.Root
      data-slot="tooltip"
      placement="top"
      gutter={5}
      openDelay={0}
      {...props}
    />
  );
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
  const popper = usePopperContext();
  const side = () => popper.currentPlacement().split("-")[0];
  const local = props as TooltipContentProps;
  const others = omit(local, "class", "children");
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        data-side={side()}
        class={cn(
          "cn-tooltip-content z-50 w-fit max-w-xs origin-(--kb-tooltip-content-transform-origin) bg-foreground text-background",
          local.class,
        )}
        {...others}
      >
        {local.children}
        <TooltipPrimitive.Arrow
          data-side={side()}
          size={10}
          class="cn-tooltip-arrow z-50 bg-foreground"
        />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
};

export { Tooltip, TooltipContent, TooltipTrigger };

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
      // radix defaults its content to the top; Kobalte's popper defaults to
      // the bottom, so an unpositioned tooltip would sit on the wrong side
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
          "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-closed:fade-out-0 data-closed:zoom-out-95 data-expanded:fade-in-0 data-expanded:zoom-in-95 z-50 inline-flex w-fit max-w-xs origin-(--kb-tooltip-content-transform-origin) items-center gap-1.5 rounded-md bg-foreground px-3 py-1.5 text-background text-xs data-closed:animate-out data-expanded:animate-in has-data-[slot=kbd]:pr-1.5 **:data-[slot=kbd]:relative **:data-[slot=kbd]:isolate **:data-[slot=kbd]:z-50 **:data-[slot=kbd]:rounded-sm",
          local.class,
        )}
        {...others}
      >
        {local.children}
        <TooltipPrimitive.Arrow
          data-side={side()}
          size={10}
          class="z-50 size-2.5 rotate-45 rounded-[2px] bg-foreground *:hidden data-[side=left]:translate-x-[calc(-50%_-_2px)] data-[side=right]:translate-x-[calc(50%_+_2px)] data-[side=bottom]:translate-y-[calc(50%_+_2px)] data-[side=top]:translate-y-[calc(-50%_-_2px)]"
        />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
};

export { Tooltip, TooltipContent, TooltipTrigger };

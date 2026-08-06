import * as HoverCardPrimitive from "@kobalte/core/hover-card";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";

import { cn } from "~/lib/utils.ts";
import type { Component, ValidComponent } from "solid-js";

import { splitProps } from "solid-js";

const HoverCard: Component<HoverCardPrimitive.HoverCardRootProps> = (props) => {
  return (
    <HoverCardPrimitive.Root data-slot="hover-card" gutter={4} {...props} />
  );
};

type HoverCardTriggerProps<T extends ValidComponent = "a"> =
  & HoverCardPrimitive.HoverCardTriggerProps<T>
  & { class?: string | undefined };

const HoverCardTrigger = <T extends ValidComponent = "a">(
  props: PolymorphicProps<T, HoverCardTriggerProps<T>>,
) => {
  return (
    <HoverCardPrimitive.Trigger
      data-slot="hover-card-trigger"
      {...(props as HoverCardTriggerProps)}
    />
  );
};

type HoverCardContentProps<T extends ValidComponent = "div"> =
  & HoverCardPrimitive.HoverCardContentProps<T>
  & {
    class?: string | undefined;
  };

const HoverCardContent = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, HoverCardContentProps<T>>,
) => {
  const [local, others] = splitProps(props as HoverCardContentProps, ["class"]);
  return (
    <HoverCardPrimitive.Portal>
      <HoverCardPrimitive.Content
        data-slot="hover-card-content"
        class={cn(
          "cn-hover-card-content z-50 origin-(--kb-hovercard-content-transform-origin) outline-hidden",
          local.class,
        )}
        {...others}
      />
    </HoverCardPrimitive.Portal>
  );
};

export { HoverCard, HoverCardContent, HoverCardTrigger };

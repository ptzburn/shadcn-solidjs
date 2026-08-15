import * as AccordionPrimitive from "@kobalte/core/accordion";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import type { JSX, ValidComponent } from "@solidjs/web";
import { ClientOnly } from "~/lib/client-only.tsx";
import { cn } from "~/lib/utils.ts";
import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";

import { omit } from "solid-js";

type AccordionProps<T extends ValidComponent = "div"> =
  & AccordionPrimitive.AccordionRootProps<T>
  & {
    class?: string | undefined;
  };

const Accordion = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, AccordionProps<T>>,
) => {
  const local = props as AccordionProps;
  const others = omit(local, "class");
  // ClientOnly: Kobalte's accordion internals hydration-crash under the
  // Solid 2 RC (divergent server/client hydration keys); see
  // lib/client-only.tsx.
  return (
    <ClientOnly>
      <AccordionPrimitive.Root
        data-slot="accordion"
        class={cn("flex w-full flex-col", local.class)}
        {...others}
      />
    </ClientOnly>
  );
};

type AccordionItemProps<T extends ValidComponent = "div"> =
  & AccordionPrimitive.AccordionItemProps
  & PolymorphicProps<T>
  & {
    class?: string | undefined;
  };

const AccordionItem = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, AccordionItemProps<T>>,
) => {
  const local = props as AccordionItemProps;
  const others = omit(local, "class");
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      class={cn("not-last:border-b", local.class)}
      {...others}
    />
  );
};

type AccordionTriggerProps<T extends ValidComponent = "button"> =
  & AccordionPrimitive.AccordionTriggerProps<T>
  & {
    class?: string | undefined;
    children?: JSX.Element;
  };

const AccordionTrigger = <T extends ValidComponent = "button">(
  props: PolymorphicProps<T, AccordionTriggerProps<T>>,
) => {
  const local = props as AccordionTriggerProps;
  const others = omit(local, "class", "children");
  return (
    <AccordionPrimitive.Header class="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        class={cn(
          "group/accordion-trigger relative flex flex-1 items-start justify-between rounded-lg border border-transparent py-2.5 text-left font-medium text-sm outline-none transition-all hover:underline focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:after:border-ring disabled:pointer-events-none disabled:opacity-50 **:data-[slot=accordion-trigger-icon]:ml-auto **:data-[slot=accordion-trigger-icon]:size-4 **:data-[slot=accordion-trigger-icon]:text-muted-foreground",
          local.class,
        )}
        {...others}
      >
        {local.children}
        <IconPlaceholder
          lucide="chevron-down"
          tabler="chevron-down"
          ph="caret-down"
          ri="arrow-down-s-line"
          hugeicons="arrow-down-01"
          data-slot="accordion-trigger-icon"
          class="pointer-events-none shrink-0 group-aria-expanded/accordion-trigger:hidden"
        />
        <IconPlaceholder
          lucide="chevron-up"
          tabler="chevron-up"
          ph="caret-up"
          ri="arrow-up-s-line"
          hugeicons="arrow-up-01"
          data-slot="accordion-trigger-icon"
          class="pointer-events-none hidden shrink-0 group-aria-expanded/accordion-trigger:inline"
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
};

type AccordionContentProps<T extends ValidComponent = "div"> =
  & AccordionPrimitive.AccordionContentProps<T>
  & {
    class?: string | undefined;
    children?: JSX.Element;
  };

const AccordionContent = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, AccordionContentProps<T>>,
) => {
  const local = props as AccordionContentProps;
  const others = omit(local, "class", "children");
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      class="overflow-hidden text-sm data-[closed]:animate-accordion-up data-[expanded]:animate-accordion-down"
      {...others}
    >
      <div
        class={cn(
          "h-(--kb-accordion-content-height) pt-0 pb-2.5 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4",
          local.class,
        )}
      >
        {local.children}
      </div>
    </AccordionPrimitive.Content>
  );
};

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };

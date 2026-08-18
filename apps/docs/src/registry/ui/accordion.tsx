import * as AccordionPrimitive from "@kobalte/core/accordion";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import type { JSX, ValidComponent } from "@solidjs/web";
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
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      class={cn("cn-accordion flex w-full flex-col", local.class)}
      {...others}
    />
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
      class={cn("cn-accordion-item", local.class)}
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
          "cn-accordion-trigger group/accordion-trigger relative flex flex-1 items-start justify-between border border-transparent outline-none transition-all disabled:pointer-events-none disabled:opacity-50",
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
          class="cn-accordion-trigger-icon pointer-events-none shrink-0 group-aria-expanded/accordion-trigger:hidden"
        />
        <IconPlaceholder
          lucide="chevron-up"
          tabler="chevron-up"
          ph="caret-up"
          ri="arrow-up-s-line"
          hugeicons="arrow-up-01"
          data-slot="accordion-trigger-icon"
          class="cn-accordion-trigger-icon pointer-events-none hidden shrink-0 group-aria-expanded/accordion-trigger:inline"
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
      class="cn-accordion-content overflow-hidden"
      {...others}
    >
      <div
        class={cn(
          "cn-accordion-content-inner h-(--kb-accordion-content-height) [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4",
          local.class,
        )}
      >
        {local.children}
      </div>
    </AccordionPrimitive.Content>
  );
};

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };

import * as PaginationPrimitive from "@kobalte/core/pagination";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";

import { buttonVariants } from "./button.tsx";
import { cn } from "~/lib/utils.ts";

import type { JSX, ValidComponent } from "solid-js";
import { Show, splitProps } from "solid-js";
import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";

const PaginationItems = PaginationPrimitive.Items;

type PaginationRootProps<T extends ValidComponent = "nav"> =
  & PaginationPrimitive.PaginationRootProps<T>
  & { class?: string | undefined };

const Pagination = <T extends ValidComponent = "nav">(
  props: PolymorphicProps<T, PaginationRootProps<T>>,
) => {
  const [local, others] = splitProps(props as PaginationRootProps, ["class"]);
  return (
    <PaginationPrimitive.Root
      data-slot="pagination"
      class={cn(
        "mx-auto flex w-full justify-center",
        "[&>ul]:flex [&>ul]:flex-row [&>ul]:items-center [&>ul]:gap-0.5",
        local.class,
      )}
      {...others}
    />
  );
};

type PaginationItemProps<T extends ValidComponent = "button"> =
  & PaginationPrimitive.PaginationItemProps<T>
  & { class?: string | undefined };

const PaginationItem = <T extends ValidComponent = "button">(
  props: PolymorphicProps<T, PaginationItemProps<T>>,
) => {
  const [local, others] = splitProps(props as PaginationItemProps, ["class"]);
  return (
    <PaginationPrimitive.Item
      data-slot="pagination-link"
      class={cn(
        buttonVariants({
          variant: "ghost",
          size: "icon",
        }),
        "dark:data-[current]:border-input dark:data-[current]:bg-input/30 data-[current]:border-border data-[current]:bg-background",
        local.class,
      )}
      {...others}
    />
  );
};

type PaginationEllipsisProps<T extends ValidComponent = "div"> =
  & PaginationPrimitive.PaginationEllipsisProps<T>
  & {
    class?: string | undefined;
  };

const PaginationEllipsis = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, PaginationEllipsisProps<T>>,
) => {
  const [local, others] = splitProps(props as PaginationEllipsisProps, [
    "class",
  ]);
  return (
    <PaginationPrimitive.Ellipsis
      aria-hidden
      data-slot="pagination-ellipsis"
      class={cn(
        "flex size-8 items-center justify-center [&_svg:not([class*='size-'])]:size-4",
        local.class,
      )}
      {...others}
    >
      <IconPlaceholder
        lucide="ellipsis"
        tabler="dots"
        ph="dots-three"
        ri="more-line"
        hugeicons="more-horizontal"
      />
      <span class="sr-only">More pages</span>
    </PaginationPrimitive.Ellipsis>
  );
};

type PaginationPreviousProps<T extends ValidComponent = "button"> =
  & PaginationPrimitive.PaginationPreviousProps<T>
  & {
    class?: string | undefined;
    text?: string;
    children?: JSX.Element;
  };

const PaginationPrevious = <T extends ValidComponent = "button">(
  props: PolymorphicProps<T, PaginationPreviousProps<T>>,
) => {
  const [local, others] = splitProps(props as PaginationPreviousProps, [
    "class",
    "text",
    "children",
  ]);
  return (
    <PaginationPrimitive.Previous
      aria-label="Go to previous page"
      class={cn(
        buttonVariants({
          variant: "ghost",
          size: "default",
        }),
        "pl-1.5!",
        local.class,
      )}
      {...others}
    >
      <Show
        when={local.children}
        fallback={
          <>
            <IconPlaceholder
              lucide="chevron-left"
              tabler="chevron-left"
              ph="caret-left"
              ri="arrow-left-s-line"
              hugeicons="arrow-left-01"
              data-icon="inline-start"
              class="cn-rtl-flip"
            />
            <span class="hidden sm:block">{local.text ?? "Previous"}</span>
          </>
        }
      >
        {(children) => children()}
      </Show>
    </PaginationPrimitive.Previous>
  );
};

type PaginationNextProps<T extends ValidComponent = "button"> =
  & PaginationPrimitive.PaginationNextProps<T>
  & {
    class?: string | undefined;
    text?: string;
    children?: JSX.Element;
  };

const PaginationNext = <T extends ValidComponent = "button">(
  props: PolymorphicProps<T, PaginationNextProps<T>>,
) => {
  const [local, others] = splitProps(props as PaginationNextProps, [
    "class",
    "text",
    "children",
  ]);
  return (
    <PaginationPrimitive.Next
      aria-label="Go to next page"
      class={cn(
        buttonVariants({
          variant: "ghost",
          size: "default",
        }),
        "pr-1.5!",
        local.class,
      )}
      {...others}
    >
      <Show
        when={local.children}
        fallback={
          <>
            <span class="hidden sm:block">{local.text ?? "Next"}</span>
            <IconPlaceholder
              lucide="chevron-right"
              tabler="chevron-right"
              ph="caret-right"
              ri="arrow-right-s-line"
              hugeicons="arrow-right-01"
              data-icon="inline-end"
              class="cn-rtl-flip"
            />
          </>
        }
      >
        {(children) => children()}
      </Show>
    </PaginationPrimitive.Next>
  );
};

export {
  Pagination,
  PaginationEllipsis,
  PaginationItem,
  PaginationItems,
  PaginationNext,
  PaginationPrevious,
};

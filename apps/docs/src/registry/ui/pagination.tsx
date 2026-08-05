import type { JSX, ValidComponent } from "solid-js";
import { Show, splitProps } from "solid-js";

import * as PaginationPrimitive from "@kobalte/core/pagination";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";

import { cn } from "~/lib/utils.ts";
import { buttonVariants } from "~/registry/ui/button.tsx";
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
      class={cn(
        "[&>*]:flex [&>*]:flex-row [&>*]:items-center [&>*]:gap-1",
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
      class={cn(
        buttonVariants({
          variant: "ghost",
        }),
        "size-10 data-[current]:border",
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
      class={cn("flex size-10 items-center justify-center", local.class)}
      {...others}
    >
      <IconPlaceholder
        lucide="ellipsis"
        tabler="dots"
        ph="dots-three"
        ri="more-line"
        hugeicons="more-horizontal"
        class="size-4"
      />
      <span class="sr-only">More pages</span>
    </PaginationPrimitive.Ellipsis>
  );
};

type PaginationPreviousProps<T extends ValidComponent = "button"> =
  & PaginationPrimitive.PaginationPreviousProps<T>
  & {
    class?: string | undefined;
    children?: JSX.Element;
  };

const PaginationPrevious = <T extends ValidComponent = "button">(
  props: PolymorphicProps<T, PaginationPreviousProps<T>>,
) => {
  const [local, others] = splitProps(props as PaginationPreviousProps, [
    "class",
    "children",
  ]);
  return (
    <PaginationPrimitive.Previous
      class={cn(
        buttonVariants({
          variant: "ghost",
        }),
        "gap-1 pl-2.5",
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
              class="size-4"
            />
            <span>Previous</span>
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
    children?: JSX.Element;
  };

const PaginationNext = <T extends ValidComponent = "button">(
  props: PolymorphicProps<T, PaginationNextProps<T>>,
) => {
  const [local, others] = splitProps(props as PaginationNextProps, [
    "class",
    "children",
  ]);
  return (
    <PaginationPrimitive.Next
      class={cn(
        buttonVariants({
          variant: "ghost",
        }),
        "gap-1 pl-2.5",
        local.class,
      )}
      {...others}
    >
      <Show
        when={local.children}
        fallback={
          <>
            <span>Next</span>
            <IconPlaceholder
              lucide="chevron-right"
              tabler="chevron-right"
              ph="caret-right"
              ri="arrow-right-s-line"
              hugeicons="arrow-right-01"
              class="size-4"
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

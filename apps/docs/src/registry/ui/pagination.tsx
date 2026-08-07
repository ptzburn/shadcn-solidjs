import * as PaginationPrimitive from "@kobalte/core/pagination";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";

import type { ButtonProps } from "./button.tsx";
import { buttonVariants } from "./button.tsx";
import { cn } from "~/lib/utils.ts";

import type { JSX, ValidComponent } from "solid-js";
import { children, Show, splitProps } from "solid-js";
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
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      class={cn(
        "cn-pagination mx-auto flex w-full justify-center",
        // Kobalte renders the list itself, so the `pagination-content` styles
        // are applied from here.
        "[&>ul]:flex [&>ul]:items-center [&>ul]:gap-0.5",
        local.class,
      )}
      {...others}
    />
  );
};

type PaginationItemProps<T extends ValidComponent = "button"> =
  & PaginationPrimitive.PaginationItemProps<T>
  & {
    class?: string | undefined;
    size?: ButtonProps["size"];
  };

const PaginationItem = <T extends ValidComponent = "button">(
  props: PolymorphicProps<T, PaginationItemProps<T>>,
) => {
  const [local, others] = splitProps(props as PaginationItemProps, [
    "class",
    "size",
  ]);
  return (
    <PaginationPrimitive.Item
      data-slot="pagination-link"
      class={cn(
        buttonVariants({
          variant: "ghost",
          size: local.size ?? "icon",
        }),
        // Kobalte marks the current page with `data-current`, so the outline
        // variant is applied from here instead of swapping variants.
        "cn-pagination-link data-[current]:border-border data-[current]:bg-background dark:data-[current]:border-input dark:data-[current]:bg-input/30 dark:data-[current]:hover:bg-input/50",
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
        "cn-pagination-ellipsis flex items-center justify-center",
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

  // prevents rendering children twice
  const resolvedChildren = children(() => local.children);
  const hasChildren = () => resolvedChildren.toArray().length !== 0;

  return (
    <PaginationPrimitive.Previous
      aria-label="Go to previous page"
      data-slot="pagination-link"
      class={cn(
        buttonVariants({
          variant: "ghost",
          size: "default",
        }),
        "cn-pagination-link cn-pagination-previous",
        local.class,
      )}
      {...others}
    >
      <Show when={!hasChildren()} fallback={resolvedChildren()}>
        <IconPlaceholder
          lucide="chevron-left"
          tabler="chevron-left"
          ph="caret-left"
          ri="arrow-left-s-line"
          hugeicons="arrow-left-01"
          data-icon="inline-start"
          class="cn-rtl-flip"
        />
        <span class="cn-pagination-previous-text hidden sm:block">
          {local.text ?? "Previous"}
        </span>
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

  // prevents rendering children twice
  const resolvedChildren = children(() => local.children);
  const hasChildren = () => resolvedChildren.toArray().length !== 0;

  return (
    <PaginationPrimitive.Next
      aria-label="Go to next page"
      data-slot="pagination-link"
      class={cn(
        buttonVariants({
          variant: "ghost",
          size: "default",
        }),
        "cn-pagination-link cn-pagination-next",
        local.class,
      )}
      {...others}
    >
      <Show when={!hasChildren()} fallback={resolvedChildren()}>
        <span class="cn-pagination-next-text hidden sm:block">
          {local.text ?? "Next"}
        </span>
        <IconPlaceholder
          lucide="chevron-right"
          tabler="chevron-right"
          ph="caret-right"
          ri="arrow-right-s-line"
          hugeicons="arrow-right-01"
          data-icon="inline-end"
          class="cn-rtl-flip"
        />
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

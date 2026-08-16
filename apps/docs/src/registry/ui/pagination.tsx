import * as PaginationPrimitive from "@kobalte/core/pagination";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import type { JSX, ValidComponent } from "@solidjs/web";
import { cn } from "~/lib/utils.ts";
import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";

import { children, omit, Show } from "solid-js";
import type { ButtonProps } from "./button.tsx";
import { buttonVariants } from "./button.tsx";

const PaginationItems = PaginationPrimitive.Items;

type PaginationRootProps<T extends ValidComponent = "nav"> =
  & PaginationPrimitive.PaginationRootProps<T>
  & { class?: string | undefined };

const Pagination = <T extends ValidComponent = "nav">(
  props: PolymorphicProps<T, PaginationRootProps<T>>,
) => {
  const local = props as PaginationRootProps;
  const others = omit(local, "class");
  return (
    <PaginationPrimitive.Root
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      class={cn(
        "mx-auto flex w-full justify-center",
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
  const local = props as PaginationItemProps;
  const others = omit(local, "class", "size");
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
        "dark:data-[current]:border-input dark:data-[current]:bg-input/30 dark:data-[current]:hover:bg-input/50 data-[current]:border-border data-[current]:bg-background data-[current]:hover:bg-muted",
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
  const local = props as PaginationEllipsisProps;
  const others = omit(local, "class");
  return (
    <PaginationPrimitive.Ellipsis
      aria-hidden="true"
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
  const local = props as PaginationPreviousProps;
  const others = omit(local, "class", "text", "children");

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
        "pl-1.5!",
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
        <span class="hidden sm:block">
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
  const local = props as PaginationNextProps;
  const others = omit(local, "class", "text", "children");

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
        "pr-1.5!",
        local.class,
      )}
      {...others}
    >
      <Show when={!hasChildren()} fallback={resolvedChildren()}>
        <span class="hidden sm:block">
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

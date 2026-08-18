import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import { Polymorphic } from "@kobalte/core/polymorphic";
import type { ComponentProps, ValidComponent } from "@solidjs/web";
import { cn } from "~/lib/utils.ts";
import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";
import type { Component } from "solid-js";

import { children, omit, Show } from "solid-js";

const Breadcrumb: Component<ComponentProps<"nav">> = (props) => {
  const others = omit(props, "class");
  return (
    <nav
      aria-label="breadcrumb"
      data-slot="breadcrumb"
      class={cn(props.class)}
      {...others}
    />
  );
};

const BreadcrumbList: Component<ComponentProps<"ol">> = (props) => {
  const others = omit(props, "class");
  return (
    <ol
      data-slot="breadcrumb-list"
      class={cn(
        "cn-breadcrumb-list wrap-break-word flex flex-wrap items-center",
        props.class,
      )}
      {...others}
    />
  );
};

const BreadcrumbItem: Component<ComponentProps<"li">> = (props) => {
  const others = omit(props, "class");
  return (
    <li
      data-slot="breadcrumb-item"
      class={cn("cn-breadcrumb-item inline-flex items-center", props.class)}
      {...others}
    />
  );
};

type BreadcrumbLinkProps<T extends ValidComponent = "a"> =
  & ComponentProps<"a">
  & { class?: string | undefined };

const BreadcrumbLink = <T extends ValidComponent = "a">(
  props: PolymorphicProps<T, BreadcrumbLinkProps<T>>,
) => {
  const local = props as BreadcrumbLinkProps;
  const others = omit(local, "class");
  return (
    <Polymorphic
      as="a"
      data-slot="breadcrumb-link"
      class={cn("cn-breadcrumb-link", local.class)}
      {...others}
    />
  );
};

const BreadcrumbPage: Component<ComponentProps<"span">> = (props) => {
  const others = omit(props, "class");
  return (
    <span
      data-slot="breadcrumb-page"
      role="link"
      aria-disabled="true"
      aria-current="page"
      class={cn("cn-breadcrumb-page", props.class)}
      {...others}
    />
  );
};

const BreadcrumbSeparator: Component<ComponentProps<"li">> = (props) => {
  const others = omit(props, "class", "children");

  const resolvedChildren = children(() => props.children);
  const hasChildren = () => resolvedChildren.toArray().length !== 0;

  return (
    <li
      data-slot="breadcrumb-separator"
      role="presentation"
      aria-hidden="true"
      class={cn("cn-breadcrumb-separator", props.class)}
      {...others}
    >
      <Show when={!hasChildren()} fallback={resolvedChildren()}>
        <IconPlaceholder
          lucide="chevron-right"
          tabler="chevron-right"
          ph="caret-right"
          ri="arrow-right-s-line"
          hugeicons="arrow-right-01"
          class="cn-rtl-flip"
        />
      </Show>
    </li>
  );
};

const BreadcrumbEllipsis: Component<ComponentProps<"span">> = (props) => {
  const others = omit(props, "class");
  return (
    <span
      data-slot="breadcrumb-ellipsis"
      role="presentation"
      aria-hidden="true"
      class={cn(
        "cn-breadcrumb-ellipsis flex items-center justify-center",
        props.class,
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
      <span class="sr-only">More</span>
    </span>
  );
};

export {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
};

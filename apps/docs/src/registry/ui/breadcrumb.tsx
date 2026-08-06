import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import { Polymorphic } from "@kobalte/core/polymorphic";

import { cn } from "~/lib/utils.ts";
import type { Component, ComponentProps, ValidComponent } from "solid-js";

import { Show, splitProps } from "solid-js";
import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";

const Breadcrumb: Component<ComponentProps<"nav">> = (props) => {
  return <nav aria-label="breadcrumb" data-slot="breadcrumb" {...props} />;
};

const BreadcrumbList: Component<ComponentProps<"ol">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <ol
      data-slot="breadcrumb-list"
      class={cn(
        "cn-breadcrumb-list flex flex-wrap items-center break-words sm:gap-2.5",
        local.class,
      )}
      {...others}
    />
  );
};

const BreadcrumbItem: Component<ComponentProps<"li">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <li
      data-slot="breadcrumb-item"
      class={cn("cn-breadcrumb-item inline-flex items-center", local.class)}
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
  const [local, others] = splitProps(props as BreadcrumbLinkProps, ["class"]);
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
  const [local, others] = splitProps(props, ["class"]);
  return (
    <span
      data-slot="breadcrumb-page"
      role="link"
      aria-disabled="true"
      aria-current="page"
      class={cn("cn-breadcrumb-page", local.class)}
      {...others}
    />
  );
};

const BreadcrumbSeparator: Component<ComponentProps<"li">> = (props) => {
  const [local, others] = splitProps(props, ["class", "children"]);
  return (
    <li
      data-slot="breadcrumb-separator"
      role="presentation"
      aria-hidden="true"
      class={cn("cn-breadcrumb-separator", local.class)}
      {...others}
    >
      <Show
        when={local.children}
        fallback={
          <IconPlaceholder
            lucide="chevron-right"
            tabler="chevron-right"
            ph="caret-right"
            ri="arrow-right-s-line"
            hugeicons="arrow-right-01"
          />
        }
      >
        {local.children}
      </Show>
    </li>
  );
};

const BreadcrumbEllipsis: Component<ComponentProps<"span">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <span
      data-slot="breadcrumb-ellipsis"
      role="presentation"
      aria-hidden="true"
      class={cn("cn-breadcrumb-ellipsis flex", local.class)}
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

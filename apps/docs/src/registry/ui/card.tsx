import type { ComponentProps } from "@solidjs/web";
import { cn } from "~/lib/utils.ts";
import type { Component } from "solid-js";

import { omit } from "solid-js";

const Card: Component<ComponentProps<"div"> & { size?: "default" | "sm" }> = (
  props,
) => {
  const others = omit(props, "class", "size");
  return (
    <div
      data-slot="card"
      data-size={props.size ?? "default"}
      class={cn(
        "cn-card group/card flex flex-col",
        props.class,
      )}
      {...others}
    />
  );
};

const CardHeader: Component<ComponentProps<"div">> = (props) => {
  const others = omit(props, "class");
  return (
    <div
      data-slot="card-header"
      class={cn(
        "@container/card-header cn-card-header group/card-header grid auto-rows-min items-start has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto]",
        props.class,
      )}
      {...others}
    />
  );
};

const CardTitle: Component<ComponentProps<"div">> = (props) => {
  const others = omit(props, "class");
  return (
    <div
      data-slot="card-title"
      class={cn(
        "cn-card-title font-heading",
        props.class,
      )}
      {...others}
    />
  );
};

const CardDescription: Component<ComponentProps<"div">> = (props) => {
  const others = omit(props, "class");
  return (
    <div
      data-slot="card-description"
      class={cn("cn-card-description", props.class)}
      {...others}
    />
  );
};

const CardAction: Component<ComponentProps<"div">> = (props) => {
  const others = omit(props, "class");
  return (
    <div
      data-slot="card-action"
      class={cn(
        "cn-card-action col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        props.class,
      )}
      {...others}
    />
  );
};

const CardContent: Component<ComponentProps<"div">> = (props) => {
  const others = omit(props, "class");
  return (
    <div
      data-slot="card-content"
      class={cn("cn-card-content", props.class)}
      {...others}
    />
  );
};

const CardFooter: Component<ComponentProps<"div">> = (props) => {
  const others = omit(props, "class");
  return (
    <div
      data-slot="card-footer"
      class={cn(
        "cn-card-footer flex items-center",
        props.class,
      )}
      {...others}
    />
  );
};

export {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
};

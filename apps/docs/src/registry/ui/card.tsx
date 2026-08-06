import { cn } from "~/lib/utils.ts";
import type { Component, ComponentProps } from "solid-js";

import { splitProps } from "solid-js";

const Card: Component<ComponentProps<"div"> & { size?: "default" | "sm" }> = (
  props,
) => {
  const [local, others] = splitProps(props, ["class", "size"]);
  return (
    <div
      data-slot="card"
      data-size={local.size ?? "default"}
      class={cn(
        "cn-card group/card flex flex-col",
        local.class,
      )}
      {...others}
    />
  );
};

const CardHeader: Component<ComponentProps<"div">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <div
      data-slot="card-header"
      class={cn(
        "cn-card-header group/card-header @container/card-header grid auto-rows-min items-start has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto]",
        local.class,
      )}
      {...others}
    />
  );
};

const CardTitle: Component<ComponentProps<"div">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <div
      data-slot="card-title"
      class={cn(
        "cn-card-title font-heading",
        local.class,
      )}
      {...others}
    />
  );
};

const CardDescription: Component<ComponentProps<"div">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <div
      data-slot="card-description"
      class={cn("cn-card-description", local.class)}
      {...others}
    />
  );
};

const CardAction: Component<ComponentProps<"div">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <div
      data-slot="card-action"
      class={cn(
        "cn-card-action col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        local.class,
      )}
      {...others}
    />
  );
};

const CardContent: Component<ComponentProps<"div">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <div
      data-slot="card-content"
      class={cn("cn-card-content", local.class)}
      {...others}
    />
  );
};

const CardFooter: Component<ComponentProps<"div">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <div
      data-slot="card-footer"
      class={cn(
        "cn-card-footer flex items-center",
        local.class,
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

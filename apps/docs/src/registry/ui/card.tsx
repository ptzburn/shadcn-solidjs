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
        "[--card-spacing:--spacing(4)] data-[size=sm]:[--card-spacing:--spacing(3)] group/card flex flex-col gap-(--card-spacing) overflow-hidden rounded-xl bg-card py-(--card-spacing) text-card-foreground text-sm ring-1 ring-foreground/10 *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 data-[size=sm]:has-data-[slot=card-footer]:pb-0",
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
        "@container/card-header group/card-header grid auto-rows-min items-start gap-1 rounded-t-xl px-(--card-spacing) has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-(--card-spacing)",
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
        "font-heading font-medium text-base leading-snug group-data-[size=sm]/card:text-sm",
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
      class={cn("text-muted-foreground text-sm", props.class)}
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
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
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
      class={cn("px-(--card-spacing)", props.class)}
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
        "flex items-center rounded-b-xl border-t bg-muted/50 p-(--card-spacing)",
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

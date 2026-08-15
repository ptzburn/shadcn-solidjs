import type { ComponentProps, JSX } from "@solidjs/web";
import { cn } from "~/lib/utils.ts";
import { Alert, AlertDescription, AlertTitle } from "~/registry/ui/alert.tsx";

import type { Component } from "solid-js";
import { omit, Show } from "solid-js";

type CalloutProps = ComponentProps<"div"> & {
  icon?: JSX.Element;
  variant?: "default" | "info" | "warning";
};

export const Callout: Component<CalloutProps> = (props) => {
  const others = omit(props, "title", "children", "icon", "class", "variant");
  return (
    <Alert
      data-variant={props.variant ?? "default"}
      class={cn(
        "not-typeset mt-6 w-auto rounded-2xl border-surface bg-surface text-surface-foreground md:-mx-1 **:[code]:border",
        props.class,
      )}
      {...others}
    >
      {props.icon}
      <Show when={props.title}>
        <AlertTitle>{props.title}</AlertTitle>
      </Show>
      <AlertDescription class="text-card-foreground/80">
        {props.children}
      </AlertDescription>
    </Alert>
  );
};

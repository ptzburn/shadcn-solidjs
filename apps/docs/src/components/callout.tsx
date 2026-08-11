import { cn } from "~/lib/utils.ts";
import { Alert, AlertDescription, AlertTitle } from "~/registry/ui/alert.tsx";

import type { Component, ComponentProps, JSX } from "solid-js";
import { Show, splitProps } from "solid-js";

type CalloutProps = ComponentProps<"div"> & {
  icon?: JSX.Element;
  variant?: "default" | "info" | "warning";
};

export const Callout: Component<CalloutProps> = (props) => {
  const [local, others] = splitProps(props, [
    "title",
    "children",
    "icon",
    "class",
    "variant",
  ]);
  return (
    <Alert
      data-variant={local.variant ?? "default"}
      class={cn(
        "not-typeset mt-6 w-auto rounded-2xl border-surface bg-surface text-surface-foreground md:-mx-1 **:[code]:border",
        local.class,
      )}
      {...others}
    >
      {local.icon}
      <Show when={local.title}>
        <AlertTitle>{local.title}</AlertTitle>
      </Show>
      <AlertDescription class="text-card-foreground/80">
        {local.children}
      </AlertDescription>
    </Alert>
  );
};

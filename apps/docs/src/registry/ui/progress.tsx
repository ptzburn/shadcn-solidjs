import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import * as ProgressPrimitive from "@kobalte/core/progress";

import { Label } from "./label.tsx";
import { cn } from "~/lib/utils.ts";
import type { Component, JSX, ValidComponent } from "solid-js";

import { splitProps } from "solid-js";

type ProgressRootProps<T extends ValidComponent = "div"> =
  & ProgressPrimitive.ProgressRootProps<T>
  & { class?: string | undefined; children?: JSX.Element };

const Progress = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, ProgressRootProps<T>>,
) => {
  const [local, others] = splitProps(props as ProgressRootProps, [
    "class",
    "children",
  ]);
  return (
    <ProgressPrimitive.Root data-slot="progress" {...others}>
      {local.children}
      <ProgressPrimitive.Track
        class={cn(
          "relative flex h-1 w-full items-center overflow-x-hidden rounded-full bg-muted",
          local.class,
        )}
      >
        <ProgressPrimitive.Fill
          data-slot="progress-indicator"
          class="size-full flex-1 bg-primary transition-all"
          style={{
            transform: "translateX(calc(var(--kb-progress-fill-width) - 100%))",
          }}
        />
      </ProgressPrimitive.Track>
    </ProgressPrimitive.Root>
  );
};

const ProgressLabel: Component<ProgressPrimitive.ProgressLabelProps> = (
  props,
) => {
  return <ProgressPrimitive.Label as={Label} {...props} />;
};

const ProgressValueLabel: Component<ProgressPrimitive.ProgressValueLabelProps> =
  (props) => {
    return <ProgressPrimitive.ValueLabel as={Label} {...props} />;
  };

export { Progress, ProgressLabel, ProgressValueLabel };

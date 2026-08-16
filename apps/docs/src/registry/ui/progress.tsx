import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import * as ProgressPrimitive from "@kobalte/core/progress";
import type { JSX, ValidComponent } from "@solidjs/web";
import { cn } from "~/lib/utils.ts";

import { omit } from "solid-js";

type ProgressRootProps<T extends ValidComponent = "div"> =
  & ProgressPrimitive.ProgressRootProps<T>
  & { class?: string | undefined; children?: JSX.Element };

const Progress = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, ProgressRootProps<T>>,
) => {
  const local = props as ProgressRootProps;
  const others = omit(local, "class", "children");
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      class={cn("flex flex-wrap gap-3", local.class)}
      {...others}
    >
      {local.children}
      <ProgressTrack>
        <ProgressIndicator />
      </ProgressTrack>
    </ProgressPrimitive.Root>
  );
};

type ProgressTrackProps<T extends ValidComponent = "div"> =
  & ProgressPrimitive.ProgressTrackProps<T>
  & { class?: string | undefined; children?: JSX.Element };

const ProgressTrack = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, ProgressTrackProps<T>>,
) => {
  const local = props as ProgressTrackProps;
  const others = omit(local, "class");
  return (
    <ProgressPrimitive.Track
      data-slot="progress-track"
      class={cn(
        "relative flex h-1 w-full items-center overflow-x-hidden rounded-full bg-muted",
        local.class,
      )}
      {...others}
    />
  );
};

type ProgressIndicatorProps<T extends ValidComponent = "div"> =
  & ProgressPrimitive.ProgressFillProps<T>
  & { class?: string | undefined };

const ProgressIndicator = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, ProgressIndicatorProps<T>>,
) => {
  const local = props as ProgressIndicatorProps;
  const others = omit(local, "class", "style");
  // the fill rides on transform, so a consumer style has to merge with it
  // rather than replace it
  const transform =
    "translateX(calc(var(--kb-progress-fill-width, 0%) - 100%))";
  return (
    <ProgressPrimitive.Fill
      data-slot="progress-indicator"
      class={cn("size-full flex-1 bg-primary transition-all", local.class)}
      style={typeof local.style === "string"
        ? `transform:${transform};${local.style}`
        : { transform, ...local.style }}
      {...others}
    />
  );
};

type ProgressLabelProps<T extends ValidComponent = "span"> =
  & ProgressPrimitive.ProgressLabelProps<T>
  & { class?: string | undefined; children?: JSX.Element };

const ProgressLabel = <T extends ValidComponent = "span">(
  props: PolymorphicProps<T, ProgressLabelProps<T>>,
) => {
  const local = props as ProgressLabelProps;
  const others = omit(local, "class");
  return (
    <ProgressPrimitive.Label
      data-slot="progress-label"
      class={cn("font-medium text-sm", local.class)}
      {...others}
    />
  );
};

type ProgressValueLabelProps<T extends ValidComponent = "div"> =
  & ProgressPrimitive.ProgressValueLabelProps<T>
  & { class?: string | undefined };

const ProgressValueLabel = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, ProgressValueLabelProps<T>>,
) => {
  const local = props as ProgressValueLabelProps;
  const others = omit(local, "class");
  return (
    <ProgressPrimitive.ValueLabel
      data-slot="progress-value"
      class={cn(
        "ml-auto text-muted-foreground text-sm tabular-nums",
        local.class,
      )}
      {...others}
    />
  );
};

export {
  Progress,
  ProgressIndicator,
  ProgressLabel,
  ProgressTrack,
  ProgressValueLabel,
};

import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import * as ProgressPrimitive from "@kobalte/core/progress";

import { cn } from "~/lib/utils.ts";
import type { JSX, ValidComponent } from "solid-js";

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
    <ProgressPrimitive.Root
      data-slot="progress"
      class={cn("cn-progress-root flex flex-wrap gap-3", local.class)}
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
  const [local, others] = splitProps(props as ProgressTrackProps, ["class"]);
  return (
    <ProgressPrimitive.Track
      data-slot="progress-track"
      class={cn(
        "cn-progress-track relative flex w-full items-center overflow-x-hidden",
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
  const [local, others] = splitProps(props as ProgressIndicatorProps, [
    "class",
  ]);
  return (
    <ProgressPrimitive.Fill
      data-slot="progress-indicator"
      class={cn(
        "cn-progress-indicator size-full flex-1 transition-all",
        local.class,
      )}
      style={{
        transform: "translateX(calc(var(--kb-progress-fill-width, 0%) - 100%))",
      }}
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
  const [local, others] = splitProps(props as ProgressLabelProps, ["class"]);
  return (
    <ProgressPrimitive.Label
      data-slot="progress-label"
      class={cn("cn-progress-label", local.class)}
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
  const [local, others] = splitProps(props as ProgressValueLabelProps, [
    "class",
  ]);
  return (
    <ProgressPrimitive.ValueLabel
      data-slot="progress-value"
      class={cn("cn-progress-value", local.class)}
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

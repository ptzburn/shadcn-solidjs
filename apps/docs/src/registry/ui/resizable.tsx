import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import * as ResizablePrimitive from "@kobalte/core/resizable";

import type { ValidComponent } from "@solidjs/web";
import { cn } from "~/lib/utils.ts";

import { omit, Show } from "solid-js";

type ResizableProps<T extends ValidComponent = "div"> =
  & ResizablePrimitive.RootProps<T>
  & { class?: string | undefined };

const Resizable = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, ResizableProps<T>>,
) => {
  const local = props as ResizableProps;
  const rest = omit(local, "class");
  return (
    <ResizablePrimitive.Root
      data-slot="resizable-panel-group"
      class={cn(
        "cn-resizable-panel-group flex h-full w-full data-[orientation=vertical]:flex-col",
        local.class,
      )}
      {...rest}
    />
  );
};

type ResizablePanelProps<T extends ValidComponent = "div"> =
  & ResizablePrimitive.PanelProps<T>
  & { class?: string | undefined };

const ResizablePanel = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, ResizablePanelProps<T>>,
) => {
  const local = props as ResizablePanelProps;
  const rest = omit(local, "class");
  return (
    <ResizablePrimitive.Panel
      data-slot="resizable-panel"
      class={cn("cn-resizable-panel overflow-hidden", local.class)}
      {...rest}
    />
  );
};

type ResizableHandleProps<T extends ValidComponent = "button"> =
  & ResizablePrimitive.HandleProps<T>
  & {
    class?: string | undefined;
    withHandle?: boolean;
  };

const ResizableHandle = <T extends ValidComponent = "button">(
  props: PolymorphicProps<T, ResizableHandleProps<T>>,
) => {
  const local = props as ResizableHandleProps;
  const rest = omit(local, "class", "withHandle");
  return (
    <ResizablePrimitive.Handle
      data-slot="resizable-handle"
      class={cn(
        "cn-resizable-handle relative flex w-px items-center justify-center bg-border ring-offset-background after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring data-[orientation=vertical]:h-px data-[orientation=vertical]:w-full [&[data-orientation=vertical]>div]:rotate-90 data-[orientation=vertical]:after:left-0 data-[orientation=vertical]:after:h-1 data-[orientation=vertical]:after:w-full data-[orientation=vertical]:after:translate-x-0 data-[orientation=vertical]:after:-translate-y-1/2",
        local.class,
      )}
      {...rest}
    >
      <Show when={local.withHandle}>
        <div class="cn-resizable-handle-icon z-10 flex shrink-0" />
      </Show>
    </ResizablePrimitive.Handle>
  );
};

export { Resizable, ResizableHandle, ResizablePanel };

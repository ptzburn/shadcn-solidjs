import type { ValidComponent } from "solid-js";
import { Show, splitProps } from "solid-js";

import type {
  DynamicProps,
  HandleProps,
  PanelProps,
  RootProps,
} from "@corvu/resizable";
import ResizablePrimitive from "@corvu/resizable";

import { cn } from "~/lib/utils.ts";

type ResizableProps<T extends ValidComponent = "div"> = RootProps<T> & {
  class?: string;
};

const Resizable = <T extends ValidComponent = "div">(
  props: DynamicProps<T, ResizableProps<T>>,
) => {
  const [local, others] = splitProps(props as ResizableProps, ["class"]);
  return (
    <ResizablePrimitive
      data-slot="resizable-panel-group"
      class={cn(
        "cn-resizable-panel-group flex h-full w-full data-[orientation=vertical]:flex-col",
        local.class,
      )}
      {...others}
    />
  );
};

type ResizablePanelProps<T extends ValidComponent = "div"> = PanelProps<T> & {
  class?: string;
};

const ResizablePanel = <T extends ValidComponent = "div">(
  props: DynamicProps<T, ResizablePanelProps<T>>,
) => {
  const [local, others] = splitProps(props as ResizablePanelProps, ["class"]);
  return (
    <ResizablePrimitive.Panel
      data-slot="resizable-panel"
      // Corvu only sets `flex-basis` on a panel, so the automatic minimum
      // size of the flex item would keep it from shrinking past its
      // content. Clipping restores the behaviour react-resizable-panels
      // gets from its own inline `overflow: hidden`.
      class={cn("cn-resizable-panel overflow-hidden", local.class)}
      {...others}
    />
  );
};

type ResizableHandleProps<T extends ValidComponent = "button"> =
  & HandleProps<T>
  & {
    class?: string;
    withHandle?: boolean;
  };

const ResizableHandle = <T extends ValidComponent = "button">(
  props: DynamicProps<T, ResizableHandleProps<T>>,
) => {
  const [local, others] = splitProps(props as ResizableHandleProps, [
    "class",
    "withHandle",
  ]);
  return (
    <ResizablePrimitive.Handle
      data-slot="resizable-handle"
      class={cn(
        "cn-resizable-handle relative flex w-px items-center justify-center bg-border ring-offset-background after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-hidden data-[orientation=vertical]:h-px data-[orientation=vertical]:w-full data-[orientation=vertical]:after:left-0 data-[orientation=vertical]:after:h-1 data-[orientation=vertical]:after:w-full data-[orientation=vertical]:after:translate-x-0 data-[orientation=vertical]:after:-translate-y-1/2 [&[data-orientation=vertical]>div]:rotate-90",
        local.class,
      )}
      {...others}
    >
      <Show when={local.withHandle}>
        <div class="cn-resizable-handle-icon z-10 flex shrink-0" />
      </Show>
    </ResizablePrimitive.Handle>
  );
};

export { Resizable, ResizableHandle, ResizablePanel };

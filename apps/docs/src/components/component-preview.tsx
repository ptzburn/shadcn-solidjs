import { Index } from "~/__registry__/index.tsx";

import { cn } from "~/lib/utils.ts";
import { Button } from "~/registry/ui/button.tsx";
import {
  type Component,
  type ComponentProps,
  createMemo,
  createSignal,
  mergeProps,
  Show,
  splitProps,
} from "solid-js";

interface ComponentPreviewProps extends ComponentProps<"div"> {
  name: string;
  source: string;
  align?: "center" | "start" | "end";
  type?: "block" | "component" | "example";
  previewClassName?: string;
  hideCode?: boolean;
}

const ComponentPreview: Component<ComponentPreviewProps> = (rawProps) => {
  const props = mergeProps({ align: "center" } as const, rawProps);
  const [local, others] = splitProps(props, [
    "class",
    "align",
    "children",
    "name",
    "type",
    "previewClassName",
    "hideCode",
  ]);
  const [isCodeVisible, setIsCodeVisible] = createSignal(false);

  const Preview = createMemo(() => {
    // Blocks render inside an iframe, so never instantiate the registry
    // component here — a lazy() component created for a subtree that is
    // discarded still claims hydration keys and breaks the whole page.
    if (local.type === "block") {
      return null;
    }

    const Component = Index[local.name]?.component;

    if (!Component) {
      return (
        <p class="text-muted-foreground text-sm">
          Component{" "}
          <code class="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
            {local.name}
          </code>{" "}
          not found in registry.
        </p>
      );
    }

    return <Component />;
  });

  return (
    <Show
      when={local.type !== "block"}
      fallback={
        <div class="relative aspect-[4/2.5] w-full overflow-hidden rounded-(--docs-surface-radius) border">
          <div class="absolute inset-0 hidden w-[1600px] bg-background md:block">
            <iframe src={`/blocks/${local.name}`} class="size-full" />
          </div>
        </div>
      }
    >
      <div
        data-slot="component-preview"
        data-not-typeset
        class={cn(
          "group relative mt-4 mb-12 flex flex-col overflow-hidden rounded-(--docs-surface-radius) border",
          local.class,
        )}
        {...others}
      >
        <div data-slot="preview">
          <div
            data-align={local.align}
            class={cn(
              "preview relative flex min-h-[350px] w-full justify-center p-10",
              local.align === "center" && "items-center",
              local.align === "start" && "items-start",
              local.align === "end" && "items-end",
              local.previewClassName,
            )}
          >
            <Preview />
          </div>
        </div>
        <Show when={!local.hideCode}>
          <div
            data-slot="code"
            data-code-visible={isCodeVisible()}
            class="relative overflow-hidden [&_[data-rehype-pretty-code-figure]]:m-0! [&_pre]:max-h-72 [&_[data-rehype-pretty-code-figure]]:rounded-t-none [&_[data-rehype-pretty-code-figure]]:border-t **:data-[slot=copy-button]:right-4 **:data-[slot=copy-button]:hidden data-[code-visible=false]:[&_pre]:max-h-28 data-[code-visible=false]:[&_pre]:overflow-hidden data-[code-visible=true]:**:data-[slot=copy-button]:flex"
          >
            {local.children}
            <Show when={!isCodeVisible()}>
              <div class="absolute inset-0 flex items-center justify-center pb-4">
                <div
                  class="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, var(--color-code), color-mix(in oklab, var(--color-code) 60%, transparent), transparent)",
                  }}
                />
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  class="relative z-10 bg-background text-foreground shadow-none hover:bg-muted dark:bg-background dark:text-foreground dark:hover:bg-muted"
                  onClick={() => setIsCodeVisible(true)}
                >
                  View Code
                </Button>
              </div>
            </Show>
          </div>
        </Show>
      </div>
    </Show>
  );
};

export { ComponentPreview };

import {
  type Component,
  type ComponentProps,
  createSignal,
  mergeProps,
  splitProps,
} from "solid-js";

import { cn } from "~/lib/utils.ts";
import { Button } from "~/registry/ui/button.tsx";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/registry/ui/collapsible.tsx";

interface CodeBlockProps extends ComponentProps<"div"> {
  expandButtonTitle?: string;
}

const CodeBlockWrapper: Component<CodeBlockProps> = (rawProps) => {
  const props = mergeProps({ expandButtonTitle: "View Code" }, rawProps);
  const [, rest] = splitProps(props, [
    "expandButtonTitle",
    "class",
    "children",
  ]);

  const [isOpened, setIsOpened] = createSignal(false);

  return (
    <Collapsible open={isOpened()} onOpenChange={setIsOpened} forceMount>
      <div class={cn("relative overflow-hidden", props.class)} {...rest}>
        <CollapsibleContent
          class={cn("overflow-hidden", !isOpened() && "max-h-32")}
        >
          <div
            class={cn(
              "[&_[data-rehype-pretty-code-figure]]:m-0! [&_[data-rehype-pretty-code-figure]]:rounded-none [&_pre]:my-0 [&_pre]:max-h-[650px] [&_pre]:pb-[100px]",
              !isOpened()
                ? "[&_pre]:overflow-hidden"
                : "[&_pre]:overflow-auto]",
            )}
          >
            {props.children}
          </div>
        </CollapsibleContent>
        <div
          class={cn(
            "absolute flex items-center justify-center bg-gradient-to-b from-code/70 to-code p-2",
            isOpened() ? "inset-x-0 bottom-0 h-12" : "inset-0",
          )}
        >
          <CollapsibleTrigger
            as={Button<"button">}
            variant="secondary"
            class="h-8 text-xs"
          >
            {isOpened() ? "Collapse" : props.expandButtonTitle}
          </CollapsibleTrigger>
        </div>
      </div>
    </Collapsible>
  );
};

export { CodeBlockWrapper };

import { IconCheck, IconCopy } from "~/components/icons.tsx";
import { cn } from "~/lib/utils.ts";

import type { ButtonProps } from "~/registry/ui/button.tsx";
import { Button } from "~/registry/ui/button.tsx";
import type { Component } from "solid-js";
import { createSignal, omit, Show } from "solid-js";

export interface CopyButtonProps extends ButtonProps {
  content: string;
}

async function copyToClipboard(text: string): Promise<boolean> {
  if (!navigator.clipboard?.writeText) {
    return false;
  }
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/**
 * A ghost icon button with an sr-only label and no tooltip. Positioning
 * lives here rather than at the call site so mdx.css can override `top`
 * when a figure has a title.
 */
const CopyButton: Component<CopyButtonProps> = (props) => {
  const rest = omit(props, "class", "content");
  const [hasCopied, setHasCopied] = createSignal(false);

  const copy = async () => {
    if (!await copyToClipboard(props.content)) {
      return;
    }
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  return (
    <Button
      data-slot="copy-button"
      data-copied={hasCopied()}
      size="icon-sm"
      variant="ghost"
      class={cn(
        "absolute top-3 right-2 z-10 opacity-70 hover:opacity-100 focus-visible:opacity-100",
        props.class,
      )}
      onClick={copy}
      {...rest}
    >
      <span class="sr-only">Copy</span>
      <Show when={hasCopied()} fallback={<IconCopy />}>
        <IconCheck />
      </Show>
    </Button>
  );
};

export { CopyButton };

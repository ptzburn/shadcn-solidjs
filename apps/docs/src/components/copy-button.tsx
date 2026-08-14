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

// Inline icons until the icon library machinery returns.
function IconCopy() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
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

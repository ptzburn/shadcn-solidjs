import { IconBrandGithub } from "~/components/icons.tsx";

import { Button } from "~/registry/ui/button.tsx";
import { Skeleton } from "~/registry/ui/skeleton.tsx";
import { createSignal, onMount, Show } from "solid-js";

const REPO = "ptzburn/shadcn-solidjs";

export function GitHubLink() {
  return (
    <Button
      as="a"
      href={`https://github.com/${REPO}`}
      target="_blank"
      rel="noreferrer"
      size="sm"
      variant="ghost"
      class="shadow-none"
    >
      <IconBrandGithub />
      <StarsCount />
    </Button>
  );
}

function StarsCount() {
  const [stars, setStars] = createSignal<string>();

  onMount(async () => {
    try {
      const response = await fetch(`https://api.github.com/repos/${REPO}`);
      const json = await response.json();
      const count = json.stargazers_count;
      if (typeof count === "number") {
        setStars(
          count >= 1000
            ? `${Math.round(count / 1000)}k`
            : count.toLocaleString(),
        );
      }
    } catch {
      // Leave the skeleton in place when the request fails.
    }
  });

  return (
    <Show when={stars()} fallback={<Skeleton class="h-4 w-8" />}>
      <span class="w-fit text-muted-foreground text-xs tabular-nums">
        {stars()}
      </span>
    </Show>
  );
}

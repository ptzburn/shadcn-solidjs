import { createSignal, onCleanup, onMount } from "solid-js";

import { Progress } from "~/registry/ui/progress.tsx";

export default function ProgressDemo() {
  const [progress, setProgress] = createSignal(13);

  onMount(() => {
    const timer = setTimeout(() => setProgress(66), 500);
    onCleanup(() => clearTimeout(timer));
  });

  return <Progress value={progress()} class="w-[60%]" />;
}

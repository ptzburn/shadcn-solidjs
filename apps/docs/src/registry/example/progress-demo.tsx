import { Progress } from "~/registry/ui/progress.tsx";

import { createSignal, onSettled } from "solid-js";

export default function ProgressDemo() {
  const [progress, setProgress] = createSignal(13);

  onSettled(() => {
    const timer = setTimeout(() => setProgress(66), 500);
    return () => clearTimeout(timer);
  });

  return <Progress value={progress()} class="w-[60%]" />;
}

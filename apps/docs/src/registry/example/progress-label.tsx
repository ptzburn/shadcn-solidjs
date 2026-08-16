import {
  Progress,
  ProgressLabel,
  ProgressValueLabel,
} from "~/registry/ui/progress.tsx";

export default function ProgressWithLabel() {
  return (
    <Progress value={56} class="w-full max-w-sm">
      <ProgressLabel>Upload progress</ProgressLabel>
      <ProgressValueLabel />
    </Progress>
  );
}

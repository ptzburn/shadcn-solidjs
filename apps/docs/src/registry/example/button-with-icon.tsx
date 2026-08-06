import { IconGitBranch, IconGitFork } from "~/components/icons.tsx";

import { Button } from "~/registry/ui/button.tsx";

export default function ButtonWithIcon() {
  return (
    <div class="flex gap-2">
      <Button variant="outline">
        <IconGitBranch data-icon="inline-start" /> New Branch
      </Button>
      <Button variant="outline">
        Fork
        <IconGitFork data-icon="inline-end" />
      </Button>
    </div>
  );
}

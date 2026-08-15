import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";

import { Button } from "~/registry/ui/button.tsx";

export default function ButtonWithIcon() {
  return (
    <div class="flex gap-2">
      <Button variant="outline">
        <IconPlaceholder
          lucide="git-branch"
          tabler="git-branch"
          ph="git-branch"
          ri="git-branch-line"
          hugeicons="git-branch"
          data-icon="inline-start"
        />{" "}
        New Branch
      </Button>
      <Button variant="outline">
        Fork
        <IconPlaceholder
          lucide="git-fork"
          tabler="git-fork"
          ph="git-fork"
          ri="git-fork-line"
          hugeicons="git-fork"
          data-icon="inline-end"
        />
      </Button>
    </div>
  );
}

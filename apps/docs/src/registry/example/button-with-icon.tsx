import { IconGitBranch } from "~/components/icons.tsx";

import { Button } from "~/registry/ui/button.tsx";

export default function ButtonWithIcon() {
  return (
    <Button variant="outline" size="sm">
      <IconGitBranch /> New Branch
    </Button>
  );
}

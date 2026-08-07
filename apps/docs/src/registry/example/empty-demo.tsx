import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";
import { Button } from "~/registry/ui/button.tsx";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "~/registry/ui/empty.tsx";

export default function EmptyDemo() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconPlaceholder
            lucide="folder-code"
            tabler="folder-code"
            ph="folder"
            ri="folder-line"
            hugeicons="code-folder"
          />
        </EmptyMedia>
        <EmptyTitle>No Projects Yet</EmptyTitle>
        <EmptyDescription>
          You haven&apos;t created any projects yet. Get started by creating
          your first project.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent class="flex-row justify-center gap-2">
        <Button>Create Project</Button>
        <Button variant="outline">Import Project</Button>
      </EmptyContent>
      <Button
        as="a"
        variant="link"
        class="text-muted-foreground"
        size="sm"
        href="#"
      >
        Learn More{" "}
        <IconPlaceholder
          lucide="arrow-up-right"
          tabler="arrow-up-right"
          ph="arrow-up-right"
          ri="arrow-right-up-line"
          hugeicons="arrow-up-right-01"
        />
      </Button>
    </Empty>
  );
}

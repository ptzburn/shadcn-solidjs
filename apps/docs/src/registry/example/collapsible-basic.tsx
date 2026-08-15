import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";
import { Button } from "~/registry/ui/button.tsx";
import { Card, CardContent } from "~/registry/ui/card.tsx";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/registry/ui/collapsible.tsx";

export default function CollapsibleBasic() {
  return (
    <Card class="mx-auto w-full max-w-sm">
      <CardContent>
        <Collapsible class="rounded-md data-expanded:bg-muted">
          <CollapsibleTrigger as={Button} variant="ghost" class="group w-full">
            Product details
            <IconPlaceholder
              lucide="chevron-down"
              tabler="chevron-down"
              ph="caret-down"
              ri="arrow-down-s-line"
              hugeicons="arrow-down-01"
              class="ml-auto group-data-expanded:rotate-180"
            />
          </CollapsibleTrigger>
          <CollapsibleContent class="flex flex-col items-start gap-2 p-2.5 pt-0 text-sm">
            <div>
              This panel can be expanded or collapsed to reveal additional
              content.
            </div>
            <Button size="xs">Learn More</Button>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}

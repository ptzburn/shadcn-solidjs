import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";
import { Button } from "~/registry/ui/button.tsx";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "~/registry/ui/item.tsx";

export default function ItemDemo() {
  return (
    <div class="flex w-full max-w-md flex-col gap-6">
      <Item variant="outline">
        <ItemContent>
          <ItemTitle>Basic Item</ItemTitle>
          <ItemDescription>
            A simple item with title and description.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="outline" size="sm">
            Action
          </Button>
        </ItemActions>
      </Item>
      <Item variant="outline" size="sm" as="a" href="#">
        <ItemMedia>
          <IconPlaceholder
            lucide="badge-check"
            tabler="rosette-discount-check"
            ph="seal-check"
            ri="verified-badge-line"
            hugeicons="checkmark-badge-02"
            class="size-5"
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Your profile has been verified.</ItemTitle>
        </ItemContent>
        <ItemActions>
          <IconPlaceholder
            lucide="chevron-right"
            tabler="chevron-right"
            ph="caret-right"
            ri="arrow-right-s-line"
            hugeicons="arrow-right-01"
            class="size-4"
          />
        </ItemActions>
      </Item>
    </div>
  );
}

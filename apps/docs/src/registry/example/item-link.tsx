import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "~/registry/ui/item.tsx";

export default function ItemLink() {
  return (
    <div class="flex w-full max-w-md flex-col gap-4">
      <Item as="a" href="#">
        <ItemContent>
          <ItemTitle>Visit our documentation</ItemTitle>
          <ItemDescription>
            Learn how to get started with our components.
          </ItemDescription>
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
      <Item
        variant="outline"
        as="a"
        href="#"
        target="_blank"
        rel="noopener noreferrer"
      >
        <ItemContent>
          <ItemTitle>External resource</ItemTitle>
          <ItemDescription>
            Opens in a new tab with security attributes.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <IconPlaceholder
            lucide="external-link"
            tabler="external-link"
            ph="arrow-square-out"
            ri="external-link-line"
            hugeicons="link-square-02"
            class="size-4"
          />
        </ItemActions>
      </Item>
    </div>
  );
}

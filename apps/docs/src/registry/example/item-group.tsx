import { For } from "solid-js";

import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";
import { Avatar, AvatarFallback, AvatarImage } from "~/registry/ui/avatar.tsx";
import { Button } from "~/registry/ui/button.tsx";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "~/registry/ui/item.tsx";

const people = [
  {
    username: "shadcn",
    avatar: "https://github.com/shadcn.png",
    email: "shadcn@vercel.com",
  },
  {
    username: "maxleiter",
    avatar: "https://github.com/maxleiter.png",
    email: "maxleiter@vercel.com",
  },
  {
    username: "evilrabbit",
    avatar: "https://github.com/evilrabbit.png",
    email: "evilrabbit@vercel.com",
  },
];

export default function ItemGroupExample() {
  return (
    <ItemGroup class="max-w-sm">
      <For each={people}>
        {(person) => (
          <Item variant="outline">
            <ItemMedia>
              <Avatar>
                <AvatarImage src={person.avatar} class="grayscale" />
                <AvatarFallback>{person.username.charAt(0)}</AvatarFallback>
              </Avatar>
            </ItemMedia>
            <ItemContent class="gap-1">
              <ItemTitle>{person.username}</ItemTitle>
              <ItemDescription>{person.email}</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button variant="ghost" size="icon" class="rounded-full">
                <IconPlaceholder
                  lucide="plus"
                  tabler="plus"
                  ph="plus"
                  ri="add-line"
                  hugeicons="plus-sign"
                />
              </Button>
            </ItemActions>
          </Item>
        )}
      </For>
    </ItemGroup>
  );
}

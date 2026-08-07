import { For } from "solid-js";

import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemTitle,
} from "~/registry/ui/item.tsx";

const models = [
  {
    name: "v0-1.5-sm",
    description: "Everyday tasks and UI generation.",
    image: "https://avatar.vercel.sh/v0-1.5-sm",
  },
  {
    name: "v0-1.5-lg",
    description: "Advanced thinking or reasoning.",
    image: "https://avatar.vercel.sh/v0-1.5-lg",
  },
  {
    name: "v0-2.0-mini",
    description: "Open Source model for everyone.",
    image: "https://avatar.vercel.sh/v0-2.0-mini",
  },
];

export default function ItemHeaderExample() {
  return (
    <div class="flex w-full max-w-xl flex-col gap-6">
      <ItemGroup class="grid grid-cols-3 gap-4">
        <For each={models}>
          {(model) => (
            <Item variant="outline">
              <ItemHeader>
                <img
                  src={model.image}
                  alt={model.name}
                  width={128}
                  height={128}
                  class="aspect-square w-full rounded-sm object-cover grayscale"
                />
              </ItemHeader>
              <ItemContent>
                <ItemTitle>{model.name}</ItemTitle>
                <ItemDescription>{model.description}</ItemDescription>
              </ItemContent>
            </Item>
          )}
        </For>
      </ItemGroup>
    </div>
  );
}

import { ScrollArea } from "~/registry/ui/scroll-area.tsx";

import { For } from "solid-js";

interface Artwork {
  artist: string;
  art: string;
}

const works: Artwork[] = [
  { artist: "Ornella Binni", art: "https://avatar.vercel.sh/ornella" },
  { artist: "Tom Byrom", art: "https://avatar.vercel.sh/tom" },
  { artist: "Vladimir Malyavko", art: "https://avatar.vercel.sh/vladimir" },
];

export default function ScrollAreaHorizontalDemo() {
  return (
    <ScrollArea class="w-96 whitespace-nowrap rounded-md border">
      <div class="flex w-max space-x-4 p-4">
        <For each={works}>
          {(artwork) => (
            <figure class="shrink-0">
              <div class="overflow-hidden rounded-md">
                <img
                  src={artwork.art}
                  alt={`Photo by ${artwork.artist}`}
                  class="aspect-[3/4] h-fit w-fit object-cover"
                  width={300}
                  height={400}
                />
              </div>
              <figcaption class="pt-2 text-muted-foreground text-xs">
                Photo by{" "}
                <span class="font-semibold text-foreground">
                  {artwork.artist}
                </span>
              </figcaption>
            </figure>
          )}
        </For>
      </div>
    </ScrollArea>
  );
}

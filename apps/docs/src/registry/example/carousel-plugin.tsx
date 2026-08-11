import { Card, CardContent } from "~/registry/ui/card.tsx";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/registry/ui/carousel.tsx";

import Autoplay from "embla-carousel-autoplay";
import { Index } from "solid-js";

export default function CarouselPlugin() {
  const plugin = Autoplay({ delay: 2000, stopOnInteraction: true });

  return (
    <Carousel
      plugins={[plugin]}
      class="w-full max-w-[10rem] sm:max-w-xs"
      onMouseEnter={plugin.stop}
      onMouseLeave={plugin.reset}
    >
      <CarouselContent>
        <Index each={Array.from({ length: 5 })}>
          {(_, index) => (
            <CarouselItem>
              <div class="p-1">
                <Card>
                  <CardContent class="flex aspect-square items-center justify-center p-6">
                    <span class="font-semibold text-4xl">{index + 1}</span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          )}
        </Index>
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}

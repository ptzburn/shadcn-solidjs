import { Card, CardContent } from "~/registry/ui/card.tsx";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/registry/ui/carousel.tsx";
import { Repeat } from "solid-js";

export default function CarouselSpacing() {
  return (
    <Carousel class="w-full max-w-[12rem] sm:max-w-xs md:max-w-sm">
      <CarouselContent class="-ml-1">
        <Repeat count={5}>
          {(index) => (
            <CarouselItem class="basis-1/2 pl-1 lg:basis-1/3">
              <div class="p-1">
                <Card>
                  <CardContent class="flex aspect-square items-center justify-center p-6">
                    <span class="font-semibold text-2xl">{index + 1}</span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          )}
        </Repeat>
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}

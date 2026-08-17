import { Card, CardContent } from "~/registry/ui/card.tsx";

import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/registry/ui/carousel.tsx";
import { createEffect, createSignal, Repeat } from "solid-js";

export default function CarouselApiDemo() {
  const [api, setApi] = createSignal<ReturnType<CarouselApi>>();
  const [current, setCurrent] = createSignal(0);
  const [count, setCount] = createSignal(0);

  createEffect(api, (carouselApi) => {
    if (!carouselApi) {
      return;
    }

    setCount(carouselApi.scrollSnapList().length);
    setCurrent(carouselApi.selectedScrollSnap() + 1);

    carouselApi.on("select", () => {
      setCurrent(carouselApi.selectedScrollSnap() + 1);
    });
  });

  return (
    <div class="mx-auto max-w-[10rem] sm:max-w-xs">
      <Carousel setApi={setApi} class="w-full max-w-xs">
        <CarouselContent>
          <Repeat count={5}>
            {(index) => (
              <CarouselItem>
                <Card class="m-px">
                  <CardContent class="flex aspect-square items-center justify-center p-6">
                    <span class="font-semibold text-4xl">{index + 1}</span>
                  </CardContent>
                </Card>
              </CarouselItem>
            )}
          </Repeat>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <div class="py-2 text-center text-muted-foreground text-sm">
        Slide {current()} of {count()}
      </div>
    </div>
  );
}

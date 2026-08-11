// deno-lint-ignore-file no-non-null-assertion
import { cn } from "~/lib/utils.ts";
import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";

import type { CreateEmblaCarouselType } from "embla-carousel-solid";

import createEmblaCarousel from "embla-carousel-solid";
import type { Accessor, Component, ComponentProps, VoidProps } from "solid-js";
import {
  createContext,
  createEffect,
  createMemo,
  createSignal,
  mergeProps,
  onCleanup,
  splitProps,
  useContext,
} from "solid-js";
import type { ButtonProps } from "./button.tsx";
import { Button } from "./button.tsx";

export type CarouselApi = CreateEmblaCarouselType[1];

type UseCarouselParameters = Parameters<typeof createEmblaCarousel>;
type CarouselOptions = NonNullable<UseCarouselParameters[0]>;
type CarouselPlugin = NonNullable<UseCarouselParameters[1]>;

type CarouselProps = {
  opts?: ReturnType<CarouselOptions>;
  plugins?: ReturnType<CarouselPlugin>;
  orientation?: "horizontal" | "vertical";
  setApi?: (api: CarouselApi) => void;
};

type CarouselContextProps = {
  carouselRef: ReturnType<typeof createEmblaCarousel>[0];
  api: ReturnType<typeof createEmblaCarousel>[1];
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: Accessor<boolean>;
  canScrollNext: Accessor<boolean>;
} & CarouselProps;

const CarouselContext = createContext<Accessor<CarouselContextProps> | null>(
  null,
);

const useCarousel = () => {
  const context = useContext(CarouselContext);

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }

  return context();
};

const Carousel: Component<CarouselProps & ComponentProps<"div">> = (
  rawProps,
) => {
  const props = mergeProps<(CarouselProps & ComponentProps<"div">)[]>(
    { orientation: "horizontal" },
    rawProps,
  );

  const [local, others] = splitProps(props, [
    "orientation",
    "opts",
    "setApi",
    "plugins",
    "class",
    "children",
  ]);

  const [carouselRef, api] = createEmblaCarousel(
    () => ({
      ...local.opts,
      axis: local.orientation === "horizontal" ? "x" : "y",
    }),
    () => (local.plugins === undefined ? [] : local.plugins),
  );
  const [canScrollPrev, setCanScrollPrev] = createSignal(false);
  const [canScrollNext, setCanScrollNext] = createSignal(false);

  const onSelect = (api: NonNullable<ReturnType<CarouselApi>>) => {
    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
  };

  const scrollPrev = () => {
    api()?.scrollPrev();
  };

  const scrollNext = () => {
    api()?.scrollNext();
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      scrollPrev();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      scrollNext();
    }
  };

  createEffect(() => {
    if (!api() || !local.setApi) {
      return;
    }
    local.setApi(api);
  });

  createEffect(() => {
    const carouselApi = api();
    if (!carouselApi) {
      return;
    }

    onSelect(carouselApi);
    carouselApi.on("reInit", onSelect);
    carouselApi.on("select", onSelect);

    onCleanup(() => {
      carouselApi.off("select", onSelect);
    });
  });

  const value = createMemo(
    () =>
      ({
        carouselRef,
        api,
        opts: local.opts,
        orientation: local.orientation ||
          (local.opts?.axis === "y" ? "vertical" : "horizontal"),
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext,
      }) satisfies CarouselContextProps,
  );

  return (
    <CarouselContext.Provider value={value}>
      <div
        // capture phase like upstream's onKeyDownCapture; Solid's
        // oncapture: namespace needs module augmentation to type-check
        ref={(el) =>
          el.addEventListener("keydown", handleKeyDown, { capture: true })}
        class={cn("relative", local.class)}
        role="region"
        aria-roledescription="carousel"
        data-slot="carousel"
        {...others}
      >
        {local.children}
      </div>
    </CarouselContext.Provider>
  );
};

const CarouselContent: Component<ComponentProps<"div">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  const { carouselRef, orientation } = useCarousel();

  return (
    <div ref={carouselRef} class="overflow-hidden" data-slot="carousel-content">
      <div
        class={cn(
          "flex",
          orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
          local.class,
        )}
        {...others}
      />
    </div>
  );
};

const CarouselItem: Component<ComponentProps<"div">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  const { orientation } = useCarousel();

  return (
    <div
      role="group"
      aria-roledescription="slide"
      data-slot="carousel-item"
      class={cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        orientation === "horizontal" ? "pl-4" : "pt-4",
        local.class,
      )}
      {...others}
    />
  );
};

type CarouselButtonProps = VoidProps<ButtonProps>;

const CarouselPrevious: Component<CarouselButtonProps> = (rawProps) => {
  const props = mergeProps<CarouselButtonProps[]>({
    variant: "outline",
    size: "icon-sm",
  }, rawProps);
  const [local, others] = splitProps(props, ["class", "variant", "size"]);
  const { orientation, scrollPrev, canScrollPrev } = useCarousel();

  return (
    <Button
      data-slot="carousel-previous"
      variant={local.variant}
      size={local.size}
      class={cn(
        "cn-carousel-previous absolute touch-manipulation",
        orientation === "horizontal"
          ? "inset-y-0 -left-12 my-auto"
          : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
        local.class,
      )}
      disabled={!canScrollPrev()}
      onClick={scrollPrev}
      {...others}
    >
      <IconPlaceholder
        lucide="chevron-left"
        tabler="chevron-left"
        ph="caret-left"
        ri="arrow-left-s-line"
        hugeicons="arrow-left-01"
        class="cn-rtl-flip"
      />
      <span class="sr-only">Previous slide</span>
    </Button>
  );
};

const CarouselNext: Component<CarouselButtonProps> = (rawProps) => {
  const props = mergeProps<CarouselButtonProps[]>({
    variant: "outline",
    size: "icon-sm",
  }, rawProps);
  const [local, others] = splitProps(props, ["class", "variant", "size"]);
  const { orientation, scrollNext, canScrollNext } = useCarousel();

  return (
    <Button
      data-slot="carousel-next"
      variant={local.variant}
      size={local.size}
      class={cn(
        "cn-carousel-next absolute touch-manipulation",
        orientation === "horizontal"
          ? "inset-y-0 -right-12 my-auto"
          : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
        local.class,
      )}
      disabled={!canScrollNext()}
      onClick={scrollNext}
      {...others}
    >
      <IconPlaceholder
        lucide="chevron-right"
        tabler="chevron-right"
        ph="caret-right"
        ri="arrow-right-s-line"
        hugeicons="arrow-right-01"
        class="cn-rtl-flip"
      />
      <span class="sr-only">Next slide</span>
    </Button>
  );
};

export {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  useCarousel,
};

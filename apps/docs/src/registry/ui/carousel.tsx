import type { ComponentProps } from "@solidjs/web";
import { cn } from "~/lib/utils.ts";
import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";

import type {
  EmblaCarouselType,
  EmblaOptionsType,
  EmblaPluginType,
} from "embla-carousel";

import EmblaCarousel from "embla-carousel";
import {
  areOptionsEqual,
  arePluginsEqual,
  canUseDOM,
} from "embla-carousel-reactive-utils";
import type { Accessor, Component, VoidProps } from "solid-js";
import {
  createContext,
  createEffect,
  createMemo,
  createSignal,
  merge,
  omit,
  untrack,
  useContext,
} from "solid-js";
import type { ButtonProps } from "./button.tsx";
import { Button } from "./button.tsx";

type CreateEmblaCarouselType = [
  (elementRef: HTMLElement | undefined) => void,
  Accessor<EmblaCarouselType | undefined>,
];

function createEmblaCarousel(
  options?: Accessor<EmblaOptionsType>,
  plugins?: Accessor<EmblaPluginType[]>,
): CreateEmblaCarouselType {
  let storedOptions = untrack(() => (options ? options() : {}));
  let storedPlugins = untrack(() => (plugins ? plugins() : []));
  const [emblaApi, setEmblaApi] = createSignal<EmblaCarouselType>();
  const [viewport, setViewport] = createSignal<HTMLElement>();

  function reInit(): void {
    const api = emblaApi();
    if (api) api.reInit(storedOptions, storedPlugins);
  }

  createEffect(viewport, (viewport) => {
    if (canUseDOM() && viewport) {
      EmblaCarousel.globalOptions = createEmblaCarousel.globalOptions;
      const newEmblaApi = EmblaCarousel(viewport, storedOptions, storedPlugins);
      setEmblaApi(newEmblaApi);
      return () => newEmblaApi.destroy();
    } else {
      setEmblaApi(undefined);
    }
  });

  createEffect(
    () => (options ? options() : {}),
    (newOptions) => {
      if (!canUseDOM()) return;
      if (areOptionsEqual(storedOptions, newOptions)) return;
      storedOptions = newOptions;
      reInit();
    },
  );

  createEffect(
    () => (plugins ? plugins() : []),
    (newPlugins) => {
      if (!canUseDOM()) return;
      if (arePluginsEqual(storedPlugins, newPlugins)) return;
      storedPlugins = newPlugins;
      reInit();
    },
  );

  return [setViewport, emblaApi];
}
createEmblaCarousel.globalOptions = undefined as EmblaOptionsType | undefined;

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

  return untrack(context);
};

const Carousel: Component<CarouselProps & ComponentProps<"div">> = (
  rawProps,
) => {
  const props = merge({ orientation: "horizontal" as const }, rawProps);

  const others = omit(
    props,
    "orientation",
    "opts",
    "setApi",
    "plugins",
    "class",
    "children",
  );

  const [carouselRef, api] = createEmblaCarousel(
    () => ({
      ...props.opts,
      axis: props.orientation === "horizontal" ? "x" : "y",
    }),
    () => (props.plugins === undefined ? [] : props.plugins),
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

  createEffect(
    () => (api() ? props.setApi : undefined),
    (setApi) => {
      if (!setApi) {
        return;
      }
      untrack(() => setApi(api));
    },
  );

  createEffect(api, (carouselApi) => {
    if (!carouselApi) {
      return;
    }

    onSelect(carouselApi);
    carouselApi.on("reInit", onSelect);
    carouselApi.on("select", onSelect);

    return () => {
      carouselApi.off("select", onSelect);
    };
  });

  const value = createMemo(
    () =>
      ({
        carouselRef,
        api,
        opts: props.opts,
        orientation: props.orientation ||
          (props.opts?.axis === "y" ? "vertical" : "horizontal"),
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext,
      }) satisfies CarouselContextProps,
  );

  return (
    <CarouselContext value={value}>
      <div
        ref={(el) =>
          el.addEventListener("keydown", handleKeyDown, { capture: true })}
        class={cn("relative", props.class)}
        role="region"
        aria-roledescription="carousel"
        data-slot="carousel"
        {...others}
      >
        {props.children}
      </div>
    </CarouselContext>
  );
};

const CarouselContent: Component<ComponentProps<"div">> = (props) => {
  const others = omit(props, "class");
  const { carouselRef, orientation } = useCarousel();

  return (
    <div ref={carouselRef} class="overflow-hidden" data-slot="carousel-content">
      <div
        class={cn(
          "flex",
          orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
          props.class,
        )}
        {...others}
      />
    </div>
  );
};

const CarouselItem: Component<ComponentProps<"div">> = (props) => {
  const others = omit(props, "class");
  const { orientation } = useCarousel();

  return (
    <div
      role="group"
      aria-roledescription="slide"
      data-slot="carousel-item"
      class={cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        orientation === "horizontal" ? "pl-4" : "pt-4",
        props.class,
      )}
      {...others}
    />
  );
};

type CarouselButtonProps = VoidProps<ButtonProps>;

const CarouselPrevious: Component<CarouselButtonProps> = (rawProps) => {
  const props = merge({
    variant: "outline" as const,
    size: "icon-sm" as const,
  }, rawProps);
  const others = omit(props, "class", "variant", "size");
  const { orientation, scrollPrev, canScrollPrev } = useCarousel();

  return (
    <Button
      data-slot="carousel-previous"
      variant={props.variant}
      size={props.size}
      class={cn(
        "cn-carousel-previous absolute touch-manipulation",
        orientation === "horizontal"
          ? "inset-y-0 -left-12 my-auto"
          : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
        props.class,
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
  const props = merge({
    variant: "outline" as const,
    size: "icon-sm" as const,
  }, rawProps);
  const others = omit(props, "class", "variant", "size");
  const { orientation, scrollNext, canScrollNext } = useCarousel();

  return (
    <Button
      data-slot="carousel-next"
      variant={props.variant}
      size={props.size}
      class={cn(
        "cn-carousel-next absolute touch-manipulation",
        orientation === "horizontal"
          ? "inset-y-0 -right-12 my-auto"
          : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
        props.class,
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

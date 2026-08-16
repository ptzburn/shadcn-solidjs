import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import * as SliderPrimitive from "@kobalte/core/slider";
import type { ValidComponent } from "@solidjs/web";
import { cn } from "~/lib/utils.ts";

import { omit, Repeat } from "solid-js";

type SliderProps<T extends ValidComponent = "div"> =
  & SliderPrimitive.SliderRootProps<T>
  & {
    class?: string | undefined;
  };

const Slider = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, SliderProps<T>>,
) => {
  const local = props as SliderProps;
  const others = omit(local, "class");

  // one thumb per value, like upstream; reading straight off `props` keeps the
  // count reactive without splitting the values out of `others`. Upstream falls
  // back to `[min, max]`, but Kobalte's own uncontrolled default is a single
  // `[minValue]`, so a second thumb would only ever render as `display: none`.
  const values = () => {
    const p = props as SliderProps;
    return p.value ?? p.defaultValue ?? [p.minValue ?? 0];
  };

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      class={cn(
        "relative flex w-full touch-none select-none items-center data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-40 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col data-disabled:opacity-50",
        local.class,
      )}
      {...others}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        class="relative grow overflow-hidden rounded-full bg-muted data-[orientation=horizontal]:h-1 data-[orientation=vertical]:h-full data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-1"
      >
        <SliderPrimitive.Fill
          data-slot="slider-range"
          class="absolute select-none bg-primary data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full"
        />
      </SliderPrimitive.Track>
      <Repeat count={values().length}>
        {() => (
          // Kobalte pins the thumb with an inline `position: absolute` plus a
          // single-axis transform, so the cross axis has to be centred here.
          <SliderPrimitive.Thumb
            data-slot="slider-thumb"
            class="relative block size-3 shrink-0 select-none rounded-full border border-ring bg-white ring-ring/50 transition-[color,box-shadow] after:absolute after:-inset-2 hover:ring-3 focus-visible:outline-hidden focus-visible:ring-3 active:ring-3 disabled:pointer-events-none disabled:opacity-50"
          >
            <SliderPrimitive.Input />
          </SliderPrimitive.Thumb>
        )}
      </Repeat>
    </SliderPrimitive.Root>
  );
};

export { Slider };

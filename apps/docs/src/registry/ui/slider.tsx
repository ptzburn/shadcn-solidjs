import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import * as SliderPrimitive from "@kobalte/core/slider";

import { cn } from "~/lib/utils.ts";

import type { ValidComponent } from "solid-js";
import { Index, splitProps } from "solid-js";

type SliderProps<T extends ValidComponent = "div"> =
  & SliderPrimitive.SliderRootProps<T>
  & {
    class?: string | undefined;
  };

const Slider = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, SliderProps<T>>,
) => {
  const [local, others] = splitProps(props as SliderProps, ["class"]);

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
        "cn-slider relative flex w-full touch-none items-center select-none data-disabled:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
        local.class,
      )}
      {...others}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        class="cn-slider-track relative grow overflow-hidden data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full"
      >
        <SliderPrimitive.Fill
          data-slot="slider-range"
          class="cn-slider-range absolute select-none data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full"
        />
      </SliderPrimitive.Track>
      <Index each={values()}>
        {() => (
          // Kobalte pins the thumb with an inline `position: absolute` plus a
          // single-axis transform, so the cross axis has to be centred here.
          <SliderPrimitive.Thumb
            data-slot="slider-thumb"
            class="cn-slider-thumb block shrink-0 select-none data-[orientation=horizontal]:top-1/2 data-[orientation=horizontal]:-translate-y-1/2 data-[orientation=vertical]:left-1/2 data-[orientation=vertical]:-translate-x-1/2 disabled:pointer-events-none disabled:opacity-50"
          >
            <SliderPrimitive.Input />
          </SliderPrimitive.Thumb>
        )}
      </Index>
    </SliderPrimitive.Root>
  );
};

export { Slider };

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

  const values = () => {
    const p = props as SliderProps;
    return p.value ?? p.defaultValue ?? [p.minValue ?? 0];
  };

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      class={cn(
        "cn-slider relative flex w-full touch-none select-none items-center data-[orientation=vertical]:h-full data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col data-disabled:opacity-50",
        local.class,
      )}
      {...others}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        class="cn-slider-track relative grow overflow-hidden data-[orientation=vertical]:h-full data-[orientation=horizontal]:w-full"
      >
        <SliderPrimitive.Fill
          data-slot="slider-range"
          class="cn-slider-range absolute select-none data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full"
        />
      </SliderPrimitive.Track>
      <Repeat count={values().length}>
        {() => (
          <SliderPrimitive.Thumb
            data-slot="slider-thumb"
            class="cn-slider-thumb block shrink-0 select-none disabled:pointer-events-none disabled:opacity-50"
          >
            <SliderPrimitive.Input />
          </SliderPrimitive.Thumb>
        )}
      </Repeat>
    </SliderPrimitive.Root>
  );
};

export { Slider };

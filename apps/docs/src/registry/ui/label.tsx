import type { PolymorphicProps } from "@kobalte/core";
import { Polymorphic } from "@kobalte/core";

import { cn } from "~/lib/utils.ts";
import type { ComponentProps, ValidComponent } from "solid-js";

import { splitProps } from "solid-js";

type LabelProps<T extends ValidComponent = "label"> = ComponentProps<T> & {
  class?: string | undefined;
};

const Label = <T extends ValidComponent = "label">(
  props: PolymorphicProps<T, LabelProps<T>>,
) => {
  const [local, others] = splitProps(props as LabelProps, ["class"]);

  return (
    <Polymorphic<LabelProps>
      as="label"
      data-slot="label"
      class={cn(
        "cn-label flex select-none items-center peer-disabled:cursor-not-allowed group-data-[disabled=true]:pointer-events-none",
        local.class,
      )}
      {...others}
    />
  );
};

export { Label };

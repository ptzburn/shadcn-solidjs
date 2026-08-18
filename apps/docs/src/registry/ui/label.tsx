import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import { Polymorphic } from "@kobalte/core/polymorphic";
import type { ComponentProps, ValidComponent } from "@solidjs/web";
import { cn } from "~/lib/utils.ts";

import { omit } from "solid-js";

type LabelProps<T extends ValidComponent = "label"> = ComponentProps<T> & {
  class?: string | undefined;
};

const Label = <T extends ValidComponent = "label">(
  props: PolymorphicProps<T, LabelProps<T>>,
) => {
  const local = props as LabelProps;
  const others = omit(local, "class");

  return (
    <Polymorphic<LabelProps>
      as="label"
      data-slot="label"
      class={cn(
        "cn-label flex select-none items-center peer-disabled:cursor-not-allowed group-data-[disabled=true]:pointer-events-none peer-data-disabled:cursor-not-allowed",
        local.class,
      )}
      {...others}
    />
  );
};

export { Label };

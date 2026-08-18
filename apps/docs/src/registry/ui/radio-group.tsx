import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import * as RadioGroupPrimitive from "@kobalte/core/radio-group";
import type { JSX, ValidComponent } from "@solidjs/web";
import { cn } from "~/lib/utils.ts";

import { omit } from "solid-js";

type RadioGroupRootProps<T extends ValidComponent = "div"> =
  & RadioGroupPrimitive.RadioGroupRootProps<T>
  & { class?: string | undefined };

const RadioGroup = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, RadioGroupRootProps<T>>,
) => {
  const local = props as RadioGroupRootProps;
  const others = omit(local, "class");
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      class={cn("cn-radio-group w-full", local.class)}
      {...others}
    />
  );
};

type RadioGroupItemProps<T extends ValidComponent = "div"> =
  & RadioGroupPrimitive.RadioGroupItemProps<T>
  & {
    class?: string | undefined;
    children?: JSX.Element;
  };

const RadioGroupItem = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, RadioGroupItemProps<T>>,
) => {
  const local = props as RadioGroupItemProps;
  const others = omit(local, "class", "children");
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      class="peer flex items-center gap-2"
      {...others}
    >
      <RadioGroupPrimitive.ItemInput class="peer" />
      <RadioGroupPrimitive.ItemControl
        class={cn(
          "cn-radio-group-item group/radio-group-item relative aspect-square shrink-0 border outline-none after:absolute after:-inset-x-3 after:-inset-y-2 data-disabled:cursor-not-allowed data-disabled:opacity-50",
          local.class,
        )}
      >
        <RadioGroupPrimitive.ItemIndicator
          data-slot="radio-group-indicator"
          class="cn-radio-group-indicator"
        >
          <span class="cn-radio-group-indicator-icon" />
        </RadioGroupPrimitive.ItemIndicator>
      </RadioGroupPrimitive.ItemControl>
      {local.children}
    </RadioGroupPrimitive.Item>
  );
};

type RadioGroupLabelProps<T extends ValidComponent = "label"> =
  & RadioGroupPrimitive.RadioGroupLabelProps<T>
  & {
    class?: string | undefined;
  };

const RadioGroupItemLabel = <T extends ValidComponent = "label">(
  props: PolymorphicProps<T, RadioGroupLabelProps<T>>,
) => {
  const local = props as RadioGroupLabelProps;
  const others = omit(local, "class");
  return (
    <RadioGroupPrimitive.ItemLabel
      class={cn(
        "font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        local.class,
      )}
      {...others}
    />
  );
};

export { RadioGroup, RadioGroupItem, RadioGroupItemLabel };

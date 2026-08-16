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
      class={cn("grid w-full gap-2", local.class)}
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
          "group/radio-group-item relative flex aspect-square size-4 shrink-0 rounded-full border border-input outline-none after:absolute after:-inset-x-3 after:-inset-y-2 peer-focus-visible:border-ring peer-focus-visible:ring-3 peer-focus-visible:ring-ring/50 dark:bg-input/30 dark:data-invalid:border-destructive/50 dark:data-checked:bg-primary dark:data-invalid:ring-destructive/40 data-disabled:cursor-not-allowed data-checked:border-primary data-invalid:border-destructive data-checked:bg-primary data-checked:text-primary-foreground data-disabled:opacity-50 data-invalid:ring-3 data-invalid:ring-destructive/20 data-invalid:data-checked:border-primary",
          local.class,
        )}
      >
        <RadioGroupPrimitive.ItemIndicator
          data-slot="radio-group-indicator"
          class="flex size-4 items-center justify-center"
        >
          <span class="absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-foreground" />
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

import * as CheckboxPrimitive from "@kobalte/core/checkbox";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";

import { cn } from "~/lib/utils.ts";
import type { ValidComponent } from "solid-js";

import { splitProps } from "solid-js";
import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";

type CheckboxRootProps<T extends ValidComponent = "div"> =
  & CheckboxPrimitive.CheckboxRootProps<T>
  & { class?: string | undefined };

const Checkbox = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, CheckboxRootProps<T>>,
) => {
  const [local, others] = splitProps(props as CheckboxRootProps, ["class"]);
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      class={cn(local.class)}
      {...others}
    >
      <CheckboxPrimitive.Input class="peer" />
      <CheckboxPrimitive.Control class="relative flex size-4 shrink-0 items-center justify-center rounded-[4px] border border-input outline-none transition-colors after:absolute after:-inset-x-3 after:-inset-y-2 peer-focus-visible:border-ring peer-focus-visible:ring-3 peer-focus-visible:ring-ring/50 dark:bg-input/30 dark:data-invalid:border-destructive/50 dark:data-[checked]:bg-primary dark:data-invalid:ring-destructive/40 data-disabled:cursor-not-allowed data-[checked]:border-primary data-invalid:border-destructive data-[checked]:bg-primary data-[checked]:text-primary-foreground data-disabled:opacity-50 group-has-disabled/field:opacity-50 data-invalid:ring-3 data-invalid:ring-destructive/20 data-invalid:data-[checked]:border-primary">
        <CheckboxPrimitive.Indicator
          data-slot="checkbox-indicator"
          class="grid place-content-center text-current transition-none [&>svg]:size-3.5"
        >
          <IconPlaceholder
            lucide="check"
            tabler="check"
            ph="check"
            ri="check-line"
            hugeicons="tick-02"
          />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Control>
    </CheckboxPrimitive.Root>
  );
};

export { Checkbox };

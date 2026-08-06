import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import * as ToggleGroupPrimitive from "@kobalte/core/toggle-group";

import { toggleVariants } from "./toggle.tsx";
import { cn } from "~/lib/utils.ts";
import type { VariantProps } from "class-variance-authority";

import type { JSX, ValidComponent } from "solid-js";
import { createContext, splitProps, useContext } from "solid-js";

type ToggleGroupContextValue = VariantProps<typeof toggleVariants> & {
  spacing?: number;
  orientation?: "horizontal" | "vertical";
};

const ToggleGroupContext = createContext<ToggleGroupContextValue>({
  size: "default",
  variant: "default",
  spacing: 2,
  orientation: "horizontal",
});

type ToggleGroupRootProps<T extends ValidComponent = "div"> =
  & ToggleGroupPrimitive.ToggleGroupRootProps<T>
  & VariantProps<typeof toggleVariants>
  & {
    class?: string | undefined;
    children?: JSX.Element;
    spacing?: number;
    orientation?: "horizontal" | "vertical";
  };

const ToggleGroup = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, ToggleGroupRootProps<T>>,
) => {
  const [local, others] = splitProps(props as ToggleGroupRootProps, [
    "class",
    "children",
    "size",
    "variant",
    "spacing",
    "orientation",
  ]);

  return (
    <ToggleGroupPrimitive.Root
      data-slot="toggle-group"
      data-variant={local.variant}
      data-size={local.size}
      data-spacing={local.spacing ?? 2}
      orientation={local.orientation ?? "horizontal"}
      style={{ "--gap": local.spacing ?? 2 }}
      class={cn(
        "cn-toggle-group group/toggle-group flex w-fit flex-row items-center gap-[--spacing(var(--gap))] data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-stretch",
        local.class,
      )}
      {...others}
    >
      <ToggleGroupContext.Provider
        value={{
          get variant() {
            return local.variant;
          },
          get size() {
            return local.size;
          },
          get spacing() {
            return local.spacing ?? 2;
          },
          get orientation() {
            return local.orientation ?? "horizontal";
          },
        }}
      >
        {local.children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  );
};

type ToggleGroupItemProps<T extends ValidComponent = "button"> =
  & ToggleGroupPrimitive.ToggleGroupItemProps<T>
  & VariantProps<typeof toggleVariants>
  & { class?: string | undefined; children?: JSX.Element };

const ToggleGroupItem = <T extends ValidComponent = "button">(
  props: PolymorphicProps<T, ToggleGroupItemProps<T>>,
) => {
  const [local, others] = splitProps(props as ToggleGroupItemProps, [
    "class",
    "children",
    "size",
    "variant",
  ]);
  const context = useContext(ToggleGroupContext);
  return (
    <ToggleGroupPrimitive.Item
      data-slot="toggle-group-item"
      data-variant={context.variant || local.variant}
      data-size={context.size || local.size}
      data-spacing={context.spacing}
      class={cn(
        "cn-toggle-group-item shrink-0 focus:z-10 focus-visible:z-10 group-data-[orientation=horizontal]/toggle-group:data-[spacing=0]:data-[variant=outline]:border-l-0 group-data-[orientation=vertical]/toggle-group:data-[spacing=0]:data-[variant=outline]:border-t-0 group-data-[orientation=horizontal]/toggle-group:data-[spacing=0]:data-[variant=outline]:first:border-l group-data-[orientation=vertical]/toggle-group:data-[spacing=0]:data-[variant=outline]:first:border-t",
        toggleVariants({
          variant: context.variant || local.variant,
          size: context.size || local.size,
        }),
        local.class,
      )}
      {...others}
    >
      {local.children}
    </ToggleGroupPrimitive.Item>
  );
};

export { ToggleGroup, ToggleGroupItem };

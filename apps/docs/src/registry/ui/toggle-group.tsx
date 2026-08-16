import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import * as ToggleGroupPrimitive from "@kobalte/core/toggle-group";
import type { JSX, ValidComponent } from "@solidjs/web";
import { cn } from "~/lib/utils.ts";
import type { VariantProps } from "class-variance-authority";

import { createContext, merge, omit, useContext } from "solid-js";
import { toggleVariants } from "./toggle.tsx";

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
  const local = props as ToggleGroupRootProps;
  const others = omit(
    local,
    "class",
    "children",
    "size",
    "variant",
    "spacing",
    "orientation",
  );

  return (
    <ToggleGroupPrimitive.Root
      data-slot="toggle-group"
      data-variant={local.variant}
      data-size={local.size}
      data-spacing={local.spacing ?? 2}
      orientation={local.orientation ?? "horizontal"}
      style={{ "--gap": local.spacing ?? 2 }}
      class={cn(
        "group/toggle-group flex w-fit flex-row items-center gap-[--spacing(var(--gap))] rounded-lg data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-stretch data-[size=sm]:rounded-[min(var(--radius-md),10px)]",
        local.class,
      )}
      {...others}
    >
      <ToggleGroupContext
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
      </ToggleGroupContext>
    </ToggleGroupPrimitive.Root>
  );
};

type ToggleGroupItemProps<T extends ValidComponent = "button"> =
  & ToggleGroupPrimitive.ToggleGroupItemProps<T>
  & VariantProps<typeof toggleVariants>
  & { class?: string | undefined; children?: JSX.Element };

const ToggleGroupItem = <T extends ValidComponent = "button">(
  rawProps: PolymorphicProps<T, ToggleGroupItemProps<T>>,
) => {
  const props = merge(
    { variant: "default", size: "default" } as ToggleGroupItemProps,
    rawProps as ToggleGroupItemProps,
  );
  const others = omit(props, "class", "children", "size", "variant");
  const context = useContext(ToggleGroupContext);
  return (
    <ToggleGroupPrimitive.Item
      data-slot="toggle-group-item"
      data-variant={context.variant || props.variant}
      data-size={context.size || props.size}
      data-spacing={context.spacing}
      class={cn(
        "shrink-0 focus:z-10 focus-visible:z-10 group-data-[spacing=0]/toggle-group:rounded-none group-data-[spacing=0]/toggle-group:px-2 group-data-[spacing=0]/toggle-group:has-data-[icon=inline-end]:pr-1.5 group-data-[spacing=0]/toggle-group:has-data-[icon=inline-start]:pl-1.5 group-data-[orientation=horizontal]/toggle-group:data-[spacing=0]:first:rounded-l-lg group-data-[orientation=vertical]/toggle-group:data-[spacing=0]:first:rounded-t-lg group-data-[orientation=horizontal]/toggle-group:data-[spacing=0]:last:rounded-r-lg group-data-[orientation=vertical]/toggle-group:data-[spacing=0]:last:rounded-b-lg group-data-[orientation=horizontal]/toggle-group:data-[spacing=0]:data-[variant=outline]:border-l-0 group-data-[orientation=vertical]/toggle-group:data-[spacing=0]:data-[variant=outline]:border-t-0 group-data-[orientation=horizontal]/toggle-group:data-[spacing=0]:data-[variant=outline]:first:border-l group-data-[orientation=vertical]/toggle-group:data-[spacing=0]:data-[variant=outline]:first:border-t",
        toggleVariants({
          variant: context.variant || props.variant,
          size: context.size || props.size,
        }),
        props.class,
      )}
      {...others}
    >
      {props.children}
    </ToggleGroupPrimitive.Item>
  );
};

export { ToggleGroup, ToggleGroupItem };

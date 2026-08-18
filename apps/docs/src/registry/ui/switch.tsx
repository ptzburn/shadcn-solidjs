import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import * as SwitchPrimitive from "@kobalte/core/switch";
import type { JSX, ValidComponent } from "@solidjs/web";
import { cn } from "~/lib/utils.ts";

import { omit } from "solid-js";

type SwitchRootProps<T extends ValidComponent = "div"> =
  & SwitchPrimitive.SwitchRootProps<T>
  & { class?: string | undefined };

const Switch = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, SwitchRootProps<T>>,
) => {
  const local = props as SwitchRootProps;
  const others = omit(local, "class");
  return <SwitchPrimitive.Root class={cn("peer", local.class)} {...others} />;
};

const SwitchDescription = SwitchPrimitive.Description;
const SwitchErrorMessage = SwitchPrimitive.ErrorMessage;

type SwitchControlProps = SwitchPrimitive.SwitchControlProps & {
  class?: string | undefined;
  children?: JSX.Element;
  size?: "sm" | "default";
  onClick?: JSX.EventHandlerUnion<HTMLElement, MouseEvent>;
};

const SwitchControl = <T extends ValidComponent = "input">(
  props: PolymorphicProps<T, SwitchControlProps>,
) => {
  const local = props as SwitchControlProps;
  const others = omit(local, "class", "children", "size", "onClick");
  return (
    <>
      <SwitchPrimitive.Input class="peer" />
      <SwitchPrimitive.Control
        data-slot="switch"
        data-size={local.size ?? "default"}
        onClick={(event: MouseEvent) => {
          const handler = local.onClick;
          const clickEvent = event as MouseEvent & {
            currentTarget: HTMLElement;
            target: Element;
          };
          if (typeof handler === "function") {
            handler(clickEvent);
          } else if (handler) {
            handler[0](handler[1], clickEvent);
          }
          if ((event.currentTarget as HTMLElement | null)?.closest("label")) {
            event.preventDefault();
          }
        }}
        class={cn(
          "group/switch relative inline-flex shrink-0 items-center rounded-full border border-transparent bg-input outline-none transition-all after:absolute after:-inset-x-3 after:-inset-y-2 peer-focus-visible:border-ring peer-focus-visible:ring-3 peer-focus-visible:ring-ring/50 dark:bg-input/80 dark:data-invalid:border-destructive/50 dark:data-invalid:ring-destructive/40 data-[size=default]:h-[18.4px] data-[size=sm]:h-[14px] data-[size=default]:w-[32px] data-[size=sm]:w-[24px] data-disabled:cursor-not-allowed data-invalid:border-destructive data-checked:bg-primary data-disabled:opacity-50 data-invalid:ring-3 data-invalid:ring-destructive/20",
          local.class,
        )}
        {...others}
      >
        {local.children}
      </SwitchPrimitive.Control>
    </>
  );
};

type SwitchThumbProps = SwitchPrimitive.SwitchThumbProps & {
  class?: string | undefined;
};

const SwitchThumb = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, SwitchThumbProps>,
) => {
  const local = props as SwitchThumbProps;
  const others = omit(local, "class");
  return (
    <SwitchPrimitive.Thumb
      data-slot="switch-thumb"
      class={cn(
        "pointer-events-none block translate-x-0 rounded-full bg-background ring-0 transition-transform dark:bg-foreground dark:data-checked:bg-primary-foreground group-data-[size=default]/switch:size-4 group-data-[size=sm]/switch:size-3 data-checked:translate-x-[calc(100%-2px)]",
        local.class,
      )}
      {...others}
    />
  );
};

type SwitchLabelProps = SwitchPrimitive.SwitchLabelProps & {
  class?: string | undefined;
};

const SwitchLabel = <T extends ValidComponent = "label">(
  props: PolymorphicProps<T, SwitchLabelProps>,
) => {
  const local = props as SwitchLabelProps;
  const others = omit(local, "class");
  return (
    <SwitchPrimitive.Label
      class={cn(
        "font-medium text-sm leading-none data-disabled:cursor-not-allowed data-disabled:opacity-70",
        local.class,
      )}
      {...others}
    />
  );
};

export {
  Switch,
  SwitchControl,
  SwitchDescription,
  SwitchErrorMessage,
  SwitchLabel,
  SwitchThumb,
};

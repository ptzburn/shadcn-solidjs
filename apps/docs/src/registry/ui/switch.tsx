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
          "cn-switch group/switch relative inline-flex items-center outline-none transition-all after:absolute after:-inset-x-3 after:-inset-y-2 data-disabled:cursor-not-allowed data-disabled:opacity-50",
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
        "cn-switch-thumb pointer-events-none block ring-0 transition-transform",
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

import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import * as SwitchPrimitive from "@kobalte/core/switch";

import { cn } from "~/lib/utils.ts";
import type { JSX, ValidComponent } from "solid-js";

import { splitProps } from "solid-js";

type SwitchRootProps<T extends ValidComponent = "div"> =
  & SwitchPrimitive.SwitchRootProps<T>
  & { class?: string | undefined };

const Switch = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, SwitchRootProps<T>>,
) => {
  const [local, others] = splitProps(props as SwitchRootProps, ["class"]);
  return <SwitchPrimitive.Root class={cn("peer", local.class)} {...others} />;
};

const SwitchDescription = SwitchPrimitive.Description;
const SwitchErrorMessage = SwitchPrimitive.ErrorMessage;

type SwitchControlProps = SwitchPrimitive.SwitchControlProps & {
  class?: string | undefined;
  children?: JSX.Element;
  size?: "sm" | "default";
  onClick?: (event: MouseEvent) => void;
};

const SwitchControl = <T extends ValidComponent = "input">(
  props: PolymorphicProps<T, SwitchControlProps>,
) => {
  const [local, others] = splitProps(props as SwitchControlProps, [
    "class",
    "children",
    "size",
    "onClick",
  ]);
  return (
    <>
      <SwitchPrimitive.Input class="peer" />
      <SwitchPrimitive.Control
        data-slot="switch"
        data-size={local.size ?? "default"}
        onClick={(event: MouseEvent) => {
          local.onClick?.(event);
          // Kobalte toggles from this handler. An enclosing <label> — the
          // choice card pattern — would then forward a second activation to
          // the hidden input and undo it, so cancel the label's default.
          event.preventDefault();
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
  const [local, others] = splitProps(props as SwitchThumbProps, ["class"]);
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
  const [local, others] = splitProps(props as SwitchLabelProps, ["class"]);
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

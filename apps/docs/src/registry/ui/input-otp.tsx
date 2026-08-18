import * as OTPFieldPrimitive from "@kobalte/core/otp-field";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import type { ComponentProps, ValidComponent } from "@solidjs/web";
import { cn } from "~/lib/utils.ts";
import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";

import type { Component } from "solid-js";
import { merge, omit, Show } from "solid-js";

export const REGEXP_ONLY_DIGITS = "^\\d*$";
export const REGEXP_ONLY_CHARS = "^[a-zA-Z]*$";
export const REGEXP_ONLY_DIGITS_AND_CHARS = "^[a-zA-Z0-9]*$";

type InputOTPProps<T extends ValidComponent = "div"> =
  & OTPFieldPrimitive.OTPFieldRootProps<T>
  & { class?: string | undefined };

const InputOTP = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, InputOTPProps<T>>,
) => {
  const local = props as InputOTPProps;
  const rest = omit(local, "class");
  return (
    <OTPFieldPrimitive.Root
      class={cn(
        "cn-input-otp flex items-center has-disabled:opacity-50",
        local.class,
      )}
      {...rest}
    />
  );
};

type InputOTPInputProps<T extends ValidComponent = "input"> =
  & OTPFieldPrimitive.OTPFieldInputProps<T>
  & { class?: string | undefined };

const InputOTPInput = <T extends ValidComponent = "input">(
  rawProps: PolymorphicProps<T, InputOTPInputProps<T>>,
) => {
  const props = merge({ pattern: null }, rawProps as InputOTPInputProps);
  const rest = omit(props, "class", "onFocus");
  const onFocus: InputOTPInputProps["onFocus"] = (event) => {
    const handler = props.onFocus;
    if (typeof handler === "function") handler(event);
    else if (handler) handler[0](handler[1], event);
    requestAnimationFrame(() =>
      document.dispatchEvent(new Event("selectionchange"))
    );
  };
  return (
    <OTPFieldPrimitive.Input
      onFocus={onFocus}
      data-slot="input-otp"
      class={cn(
        "cn-input-otp-input z-20 disabled:cursor-not-allowed",
        props.class,
      )}
      {...rest}
    />
  );
};

const InputOTPGroup: Component<ComponentProps<"div">> = (props) => {
  const rest = omit(props, "class");
  return (
    <div
      data-slot="input-otp-group"
      class={cn(
        "cn-input-otp-group flex items-center",
        props.class,
      )}
      {...rest}
    />
  );
};

const InputOTPSlot: Component<ComponentProps<"div"> & { index: number }> = (
  props,
) => {
  const rest = omit(props, "class", "index");
  const context = OTPFieldPrimitive.useOTPFieldContext();
  const char = () => context.value()[props.index];
  const isActive = () => context.activeSlots().includes(props.index);
  const showFakeCaret = () =>
    context.value().length === props.index && context.isInserting();

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive() ? "true" : undefined}
      class={cn(
        "cn-input-otp-slot relative flex items-center justify-center data-[active=true]:z-10",
        props.class,
      )}
      {...rest}
    >
      {char()}
      <Show when={showFakeCaret()}>
        <div class="cn-input-otp-caret pointer-events-none absolute inset-0 flex items-center justify-center">
          <div class="cn-input-otp-caret-line" />
        </div>
      </Show>
    </div>
  );
};

const InputOTPSeparator: Component<ComponentProps<"div">> = (props) => {
  const rest = omit(props, "class");
  return (
    <div
      data-slot="input-otp-separator"
      class={cn(
        "cn-input-otp-separator flex items-center",
        props.class,
      )}
      role="separator"
      {...rest}
    >
      <IconPlaceholder
        lucide="minus"
        tabler="minus"
        ph="minus"
        ri="subtract-line"
        hugeicons="minus-sign"
      />
    </div>
  );
};

export {
  InputOTP,
  InputOTPGroup,
  InputOTPInput,
  InputOTPSeparator,
  InputOTPSlot,
};

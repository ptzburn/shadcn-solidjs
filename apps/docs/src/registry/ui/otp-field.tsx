import type { Component, ComponentProps, ValidComponent } from "solid-js";
import { Show, splitProps } from "solid-js";

import type { DynamicProps, InputProps, RootProps } from "@corvu/otp-field";
import OtpField from "@corvu/otp-field";

import { cn } from "~/lib/utils.ts";
import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";

export const REGEXP_ONLY_DIGITS = "^\\d*$";
export const REGEXP_ONLY_CHARS = "^[a-zA-Z]*$";
export const REGEXP_ONLY_DIGITS_AND_CHARS = "^[a-zA-Z0-9]*$";

type OTPFieldProps<T extends ValidComponent = "div"> = RootProps<T> & {
  class?: string;
};

const OTPField = <T extends ValidComponent = "div">(
  props: DynamicProps<T, OTPFieldProps<T>>,
) => {
  const [local, others] = splitProps(props as OTPFieldProps, ["class"]);
  return (
    <OtpField
      class={cn(
        "cn-input-otp flex items-center has-disabled:opacity-50",
        local.class,
      )}
      {...others}
    />
  );
};

type OTPFieldInputProps<T extends ValidComponent = "input"> = InputProps<T> & {
  class?: string;
};

const OTPFieldInput = <T extends ValidComponent = "input">(
  props: DynamicProps<T, OTPFieldInputProps<T>>,
) => {
  const [local, others] = splitProps(props as OTPFieldInputProps, ["class"]);
  return (
    <OtpField.Input
      data-slot="input-otp"
      class={cn("cn-input-otp-input disabled:cursor-not-allowed", local.class)}
      {...others}
    />
  );
};

const OTPFieldGroup: Component<ComponentProps<"div">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <div
      data-slot="input-otp-group"
      class={cn("cn-input-otp-group flex items-center", local.class)}
      {...others}
    />
  );
};

const OTPFieldSlot: Component<ComponentProps<"div"> & { index: number }> = (
  props,
) => {
  const [local, others] = splitProps(props, ["class", "index"]);
  const context = OtpField.useContext();
  const char = () => context.value()[local.index];
  const isActive = () => context.activeSlots().includes(local.index);
  const showFakeCaret = () =>
    context.value().length === local.index && context.isInserting();

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive()}
      class={cn(
        "cn-input-otp-slot relative flex items-center justify-center data-[active=true]:z-10",
        local.class,
      )}
      {...others}
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

const OTPFieldSeparator: Component<ComponentProps<"div">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <div
      data-slot="input-otp-separator"
      class={cn("cn-input-otp-separator flex items-center", local.class)}
      role="separator"
      {...others}
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
  OTPField,
  OTPFieldGroup,
  OTPFieldInput,
  OTPFieldSeparator,
  OTPFieldSlot,
};

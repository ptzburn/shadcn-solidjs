import type { Component, ComponentProps, ValidComponent } from "solid-js";
import { Show, splitProps } from "solid-js";

import type { DynamicProps, RootProps } from "@corvu/otp-field";
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
        "cn-input-otp flex items-center disabled:cursor-not-allowed has-[:disabled]:opacity-50",
        local.class,
      )}
      {...others}
    />
  );
};

const OTPFieldInput = OtpField.Input;

const OTPFieldGroup: Component<ComponentProps<"div">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return <div class={cn("flex items-center", local.class)} {...others} />;
};

const OTPFieldSlot: Component<ComponentProps<"div"> & { index: number }> = (
  props,
) => {
  const [local, others] = splitProps(props, ["class", "index"]);
  const context = OtpField.useContext();
  const char = () => context.value()[local.index];
  const showFakeCaret = () =>
    context.value().length === local.index && context.isInserting();

  return (
    <div
      class={cn(
        "cn-input-otp-slot group relative flex items-center justify-center",
        local.class,
      )}
      {...others}
    >
      <div
        class={cn(
          "absolute inset-0 z-10 transition-all group-first:rounded-l-md group-last:rounded-r-md",
          context.activeSlots().includes(local.index) &&
            "ring-2 ring-ring ring-offset-background",
        )}
      />
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
  return (
    <div {...props}>
      <IconPlaceholder
        lucide="dot"
        tabler="point-filled"
        ph="dot"
        ri="circle-fill"
        hugeicons="record"
        class="size-6"
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

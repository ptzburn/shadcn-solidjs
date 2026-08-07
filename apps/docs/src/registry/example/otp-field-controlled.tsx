import { createSignal, Show } from "solid-js";

import {
  OTPField,
  OTPFieldGroup,
  OTPFieldInput,
  OTPFieldSlot,
} from "~/registry/ui/otp-field.tsx";

export default function OTPFieldControlled() {
  const [value, setValue] = createSignal("");

  return (
    <div class="space-y-2">
      <OTPField
        maxLength={6}
        value={value()}
        onValueChange={(value) => setValue(value)}
      >
        <OTPFieldInput />
        <OTPFieldGroup>
          <OTPFieldSlot index={0} />
          <OTPFieldSlot index={1} />
          <OTPFieldSlot index={2} />
          <OTPFieldSlot index={3} />
          <OTPFieldSlot index={4} />
          <OTPFieldSlot index={5} />
        </OTPFieldGroup>
      </OTPField>
      <div class="text-center text-sm">
        <Show
          when={value() !== ""}
          fallback="Enter your one-time password."
        >
          You entered: {value()}
        </Show>
      </div>
    </div>
  );
}

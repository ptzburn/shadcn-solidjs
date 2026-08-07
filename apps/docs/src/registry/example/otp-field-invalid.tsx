import { createSignal } from "solid-js";

import {
  OTPField,
  OTPFieldGroup,
  OTPFieldInput,
  OTPFieldSeparator,
  OTPFieldSlot,
} from "~/registry/ui/otp-field.tsx";

export default function OTPFieldInvalid() {
  const [value, setValue] = createSignal("000000");

  return (
    <OTPField maxLength={6} value={value()} onValueChange={setValue}>
      <OTPFieldInput />
      <OTPFieldGroup>
        <OTPFieldSlot index={0} aria-invalid />
        <OTPFieldSlot index={1} aria-invalid />
      </OTPFieldGroup>
      <OTPFieldSeparator />
      <OTPFieldGroup>
        <OTPFieldSlot index={2} aria-invalid />
        <OTPFieldSlot index={3} aria-invalid />
      </OTPFieldGroup>
      <OTPFieldSeparator />
      <OTPFieldGroup>
        <OTPFieldSlot index={4} aria-invalid />
        <OTPFieldSlot index={5} aria-invalid />
      </OTPFieldGroup>
    </OTPField>
  );
}

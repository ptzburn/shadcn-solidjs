import {
  InputOTP,
  InputOTPGroup,
  InputOTPInput,
  InputOTPSeparator,
  InputOTPSlot,
} from "~/registry/ui/input-otp.tsx";

import { createSignal } from "solid-js";

export default function InputOTPInvalid() {
  const [value, setValue] = createSignal("000000");

  return (
    <InputOTP maxLength={6} value={value()} onChange={setValue}>
      <InputOTPInput />
      <InputOTPGroup>
        <InputOTPSlot index={0} aria-invalid="true" />
        <InputOTPSlot index={1} aria-invalid="true" />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot index={2} aria-invalid="true" />
        <InputOTPSlot index={3} aria-invalid="true" />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot index={4} aria-invalid="true" />
        <InputOTPSlot index={5} aria-invalid="true" />
      </InputOTPGroup>
    </InputOTP>
  );
}

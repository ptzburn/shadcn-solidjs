import {
  InputOTP,
  InputOTPGroup,
  InputOTPInput,
  InputOTPSlot,
} from "~/registry/ui/input-otp.tsx";

import { createSignal } from "solid-js";

export default function InputOTPDemo() {
  const [value, setValue] = createSignal("123456");

  return (
    <InputOTP maxLength={6} value={value()} onChange={setValue}>
      <InputOTPInput />
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
  );
}

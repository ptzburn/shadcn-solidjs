import {
  InputOTP,
  InputOTPGroup,
  InputOTPInput,
  InputOTPSlot,
} from "~/registry/ui/input-otp.tsx";

import { createSignal, Show } from "solid-js";

export default function InputOTPControlled() {
  const [value, setValue] = createSignal("");

  return (
    <div class="space-y-2">
      <InputOTP
        maxLength={6}
        value={value()}
        onChange={(value) => setValue(value)}
      >
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

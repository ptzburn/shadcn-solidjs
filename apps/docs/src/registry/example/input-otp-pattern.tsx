import { Field, FieldLabel } from "~/registry/ui/field.tsx";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPInput,
  InputOTPSlot,
  REGEXP_ONLY_DIGITS,
} from "~/registry/ui/input-otp.tsx";

export default function InputOTPPattern() {
  return (
    <Field class="w-fit">
      <FieldLabel for="digits-only">Digits Only</FieldLabel>
      <InputOTP maxLength={6}>
        <InputOTPInput id="digits-only" pattern={REGEXP_ONLY_DIGITS} />
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
    </Field>
  );
}

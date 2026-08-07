import { Field, FieldLabel } from "~/registry/ui/field.tsx";
import {
  OTPField,
  OTPFieldGroup,
  OTPFieldInput,
  OTPFieldSlot,
  REGEXP_ONLY_DIGITS,
} from "~/registry/ui/otp-field.tsx";

export default function OTPFieldPattern() {
  return (
    <Field class="w-fit">
      <FieldLabel for="digits-only">Digits Only</FieldLabel>
      <OTPField maxLength={6}>
        <OTPFieldInput id="digits-only" pattern={REGEXP_ONLY_DIGITS} />
        <OTPFieldGroup>
          <OTPFieldSlot index={0} />
          <OTPFieldSlot index={1} />
          <OTPFieldSlot index={2} />
          <OTPFieldSlot index={3} />
          <OTPFieldSlot index={4} />
          <OTPFieldSlot index={5} />
        </OTPFieldGroup>
      </OTPField>
    </Field>
  );
}

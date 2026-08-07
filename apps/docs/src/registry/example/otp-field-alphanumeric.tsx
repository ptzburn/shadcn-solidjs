import {
  OTPField,
  OTPFieldGroup,
  OTPFieldInput,
  OTPFieldSeparator,
  OTPFieldSlot,
  REGEXP_ONLY_DIGITS_AND_CHARS,
} from "~/registry/ui/otp-field.tsx";

export default function OTPFieldAlphanumeric() {
  return (
    <OTPField maxLength={6}>
      <OTPFieldInput pattern={REGEXP_ONLY_DIGITS_AND_CHARS} />
      <OTPFieldGroup>
        <OTPFieldSlot index={0} />
        <OTPFieldSlot index={1} />
        <OTPFieldSlot index={2} />
      </OTPFieldGroup>
      <OTPFieldSeparator />
      <OTPFieldGroup>
        <OTPFieldSlot index={3} />
        <OTPFieldSlot index={4} />
        <OTPFieldSlot index={5} />
      </OTPFieldGroup>
    </OTPField>
  );
}

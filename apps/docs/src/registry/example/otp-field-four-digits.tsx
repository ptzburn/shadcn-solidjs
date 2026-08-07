import {
  OTPField,
  OTPFieldGroup,
  OTPFieldInput,
  OTPFieldSlot,
  REGEXP_ONLY_DIGITS,
} from "~/registry/ui/otp-field.tsx";

export default function OTPFieldFourDigits() {
  return (
    <OTPField maxLength={4}>
      <OTPFieldInput pattern={REGEXP_ONLY_DIGITS} />
      <OTPFieldGroup>
        <OTPFieldSlot index={0} />
        <OTPFieldSlot index={1} />
        <OTPFieldSlot index={2} />
        <OTPFieldSlot index={3} />
      </OTPFieldGroup>
    </OTPField>
  );
}

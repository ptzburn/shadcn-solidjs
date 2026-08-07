import {
  OTPField,
  OTPFieldGroup,
  OTPFieldInput,
  OTPFieldSeparator,
  OTPFieldSlot,
} from "~/registry/ui/otp-field.tsx";

export default function OTPFieldDisabled() {
  return (
    <OTPField maxLength={6} value="123456">
      <OTPFieldInput id="disabled" disabled />
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

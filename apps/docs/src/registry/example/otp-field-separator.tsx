import {
  OTPField,
  OTPFieldGroup,
  OTPFieldInput,
  OTPFieldSeparator,
  OTPFieldSlot,
} from "~/registry/ui/otp-field.tsx";

export default function OTPFieldWithSeparator() {
  return (
    <OTPField maxLength={6}>
      <OTPFieldInput />
      <OTPFieldGroup>
        <OTPFieldSlot index={0} />
        <OTPFieldSlot index={1} />
      </OTPFieldGroup>
      <OTPFieldSeparator />
      <OTPFieldGroup>
        <OTPFieldSlot index={2} />
        <OTPFieldSlot index={3} />
      </OTPFieldGroup>
      <OTPFieldSeparator />
      <OTPFieldGroup>
        <OTPFieldSlot index={4} />
        <OTPFieldSlot index={5} />
      </OTPFieldGroup>
    </OTPField>
  );
}

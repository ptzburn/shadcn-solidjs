import {
  InputOTP,
  InputOTPGroup,
  InputOTPInput,
  InputOTPSlot,
  REGEXP_ONLY_DIGITS,
} from "~/registry/ui/input-otp.tsx";

export default function InputOTPFourDigits() {
  return (
    <InputOTP maxLength={4}>
      <InputOTPInput pattern={REGEXP_ONLY_DIGITS} />
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
        <InputOTPSlot index={3} />
      </InputOTPGroup>
    </InputOTP>
  );
}

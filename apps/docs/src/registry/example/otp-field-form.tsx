import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";
import { Button } from "~/registry/ui/button.tsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/registry/ui/card.tsx";
import { Field, FieldDescription, FieldLabel } from "~/registry/ui/field.tsx";
import {
  OTPField,
  OTPFieldGroup,
  OTPFieldInput,
  OTPFieldSeparator,
  OTPFieldSlot,
} from "~/registry/ui/otp-field.tsx";

export default function OTPFieldForm() {
  return (
    <Card class="mx-auto max-w-md">
      <CardHeader>
        <CardTitle>Verify your login</CardTitle>
        <CardDescription>
          Enter the verification code we sent to your email address:{" "}
          <span class="font-medium">m@example.com</span>.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Field>
          <div class="flex items-center justify-between">
            <FieldLabel for="otp-verification">Verification code</FieldLabel>
            <Button variant="outline" size="xs">
              <IconPlaceholder
                lucide="refresh-cw"
                tabler="refresh"
                ph="arrows-clockwise"
                ri="refresh-line"
                hugeicons="refresh"
              />
              Resend Code
            </Button>
          </div>
          <OTPField maxLength={6}>
            <OTPFieldInput id="otp-verification" required />
            <OTPFieldGroup class="*:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl">
              <OTPFieldSlot index={0} />
              <OTPFieldSlot index={1} />
              <OTPFieldSlot index={2} />
            </OTPFieldGroup>
            <OTPFieldSeparator class="mx-2" />
            <OTPFieldGroup class="*:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl">
              <OTPFieldSlot index={3} />
              <OTPFieldSlot index={4} />
              <OTPFieldSlot index={5} />
            </OTPFieldGroup>
          </OTPField>
          <FieldDescription>
            <a href="#">I no longer have access to this email address.</a>
          </FieldDescription>
        </Field>
      </CardContent>
      <CardFooter>
        <Field>
          <Button type="submit" class="w-full">
            Verify
          </Button>
          <div class="text-sm text-muted-foreground">
            Having trouble signing in?{" "}
            <a
              href="#"
              class="underline underline-offset-4 transition-colors hover:text-primary"
            >
              Contact support
            </a>
          </div>
        </Field>
      </CardFooter>
    </Card>
  );
}

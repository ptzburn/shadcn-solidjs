import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";
import { Alert, AlertDescription, AlertTitle } from "~/registry/ui/alert.tsx";

export default function AlertDemo() {
  return (
    <div class="grid w-full max-w-md items-start gap-4">
      <Alert>
        <IconPlaceholder
          lucide="circle-check"
          tabler="circle-check"
          ph="check-circle"
          ri="checkbox-circle-line"
          hugeicons="checkmark-circle-02"
        />
        <AlertTitle>Payment successful</AlertTitle>
        <AlertDescription>
          Your payment of $29.99 has been processed. A receipt has been sent to
          your email address.
        </AlertDescription>
      </Alert>
      <Alert>
        <IconPlaceholder
          lucide="info"
          tabler="info-circle"
          ph="info"
          ri="information-line"
          hugeicons="information-circle"
        />
        <AlertTitle>New feature available</AlertTitle>
        <AlertDescription>
          We've added dark mode support. You can enable it in your account
          settings.
        </AlertDescription>
      </Alert>
    </div>
  );
}

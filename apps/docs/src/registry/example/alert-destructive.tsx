import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";
import { Alert, AlertDescription, AlertTitle } from "~/registry/ui/alert.tsx";

export default function AlertDestructive() {
  return (
    <Alert variant="destructive" class="max-w-md">
      <IconPlaceholder
        lucide="circle-alert"
        tabler="exclamation-circle"
        ph="warning-circle"
        ri="error-warning-line"
        hugeicons="alert-circle"
      />
      <AlertTitle>Payment failed</AlertTitle>
      <AlertDescription>
        Your payment could not be processed. Please check your payment method
        and try again.
      </AlertDescription>
    </Alert>
  );
}

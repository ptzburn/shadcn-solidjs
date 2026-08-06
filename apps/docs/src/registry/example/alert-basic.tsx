import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";
import { Alert, AlertDescription, AlertTitle } from "~/registry/ui/alert.tsx";

export default function AlertBasic() {
  return (
    <Alert class="max-w-md">
      <IconPlaceholder
        lucide="circle-check"
        tabler="circle-check"
        ph="check-circle"
        ri="checkbox-circle-line"
        hugeicons="checkmark-circle-02"
      />
      <AlertTitle>Account updated successfully</AlertTitle>
      <AlertDescription>
        Your profile information has been saved. Changes will be reflected
        immediately.
      </AlertDescription>
    </Alert>
  );
}

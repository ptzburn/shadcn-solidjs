import { IconTerminal } from "~/components/icons.tsx";
import { Alert, AlertDescription, AlertTitle } from "~/registry/ui/alert.tsx";

export default function AlertDemo() {
  return (
    <Alert>
      <IconTerminal />
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        You can add components to your app using the cli.
      </AlertDescription>
    </Alert>
  );
}

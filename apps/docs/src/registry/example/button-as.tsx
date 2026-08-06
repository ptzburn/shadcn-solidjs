import { A } from "@solidjs/router";

import { Button } from "~/registry/ui/button.tsx";

export default function ButtonAs() {
  return (
    <Button as={A} href="/login">
      Login
    </Button>
  );
}

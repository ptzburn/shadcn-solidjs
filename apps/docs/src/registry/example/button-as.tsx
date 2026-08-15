import { Button } from "~/registry/ui/button.tsx";

export default function ButtonAs() {
  return (
    <Button as="a" variant="secondary" size="sm" href="#">
      Login
    </Button>
  );
}

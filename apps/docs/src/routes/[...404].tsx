import { Button } from "~/registry/ui/button.tsx";

export default function NotFound() {
  return (
    <div class="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 class="font-semibold text-3xl tracking-tight">
        Oops! Page not found.
      </h1>
      <p class="text-muted-foreground">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Button as="a" href="/">
        Go back home
      </Button>
    </div>
  );
}

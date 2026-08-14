import { Button } from "~/registry/ui/button.tsx";

export default function Home() {
  return (
    <section class="flex flex-col items-start gap-4">
      <h1 class="font-semibold text-3xl tracking-tight">
        shadcn-solidjs on Solid 2
      </h1>
      <p class="text-muted-foreground">
        A stripped-down playground for porting the component registry to SolidJS
        2.0 and Kobalte 2. One component so far.
      </p>
      <Button as="a" href="/docs/components/button">
        Button docs
      </Button>
    </section>
  );
}

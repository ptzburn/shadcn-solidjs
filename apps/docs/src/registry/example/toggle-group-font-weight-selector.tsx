import { Field, FieldDescription, FieldLabel } from "~/registry/ui/field.tsx";

import { ToggleGroup, ToggleGroupItem } from "~/registry/ui/toggle-group.tsx";
import { createSignal } from "solid-js";

export default function ToggleGroupFontWeightSelector() {
  const [fontWeight, setFontWeight] = createSignal("normal");

  return (
    <Field>
      <FieldLabel>Font Weight</FieldLabel>
      <ToggleGroup
        value={fontWeight()}
        onChange={(value) => setFontWeight(value ?? "")}
        variant="outline"
        spacing={2}
        size="lg"
      >
        <ToggleGroupItem
          value="light"
          aria-label="Light"
          class="flex size-16 flex-col items-center justify-center rounded-xl"
        >
          <span class="font-light text-2xl leading-none">Aa</span>
          <span class="text-muted-foreground text-xs">Light</span>
        </ToggleGroupItem>
        <ToggleGroupItem
          value="normal"
          aria-label="Normal"
          class="flex size-16 flex-col items-center justify-center rounded-xl"
        >
          <span class="font-normal text-2xl leading-none">Aa</span>
          <span class="text-muted-foreground text-xs">Normal</span>
        </ToggleGroupItem>
        <ToggleGroupItem
          value="medium"
          aria-label="Medium"
          class="flex size-16 flex-col items-center justify-center rounded-xl"
        >
          <span class="font-medium text-2xl leading-none">Aa</span>
          <span class="text-muted-foreground text-xs">Medium</span>
        </ToggleGroupItem>
        <ToggleGroupItem
          value="bold"
          aria-label="Bold"
          class="flex size-16 flex-col items-center justify-center rounded-xl"
        >
          <span class="font-bold text-2xl leading-none">Aa</span>
          <span class="text-muted-foreground text-xs">Bold</span>
        </ToggleGroupItem>
      </ToggleGroup>
      <FieldDescription>
        Use{" "}
        <code class="rounded-md bg-muted px-1 py-0.5 font-mono">
          font-{fontWeight()}
        </code>{" "}
        to set the font weight.
      </FieldDescription>
    </Field>
  );
}

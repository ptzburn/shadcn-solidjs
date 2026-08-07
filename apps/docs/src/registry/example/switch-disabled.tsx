import { Field, FieldLabel } from "~/registry/ui/field.tsx";
import { Switch, SwitchControl, SwitchThumb } from "~/registry/ui/switch.tsx";

export default function SwitchDisabled() {
  return (
    <Field orientation="horizontal" data-disabled class="w-fit">
      <Switch id="switch-disabled-unchecked" disabled>
        <SwitchControl>
          <SwitchThumb />
        </SwitchControl>
      </Switch>
      <FieldLabel for="switch-disabled-unchecked-input">Disabled</FieldLabel>
    </Field>
  );
}

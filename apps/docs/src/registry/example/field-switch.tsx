import { Field, FieldLabel } from "~/registry/ui/field.tsx";
import { Switch, SwitchControl, SwitchThumb } from "~/registry/ui/switch.tsx";

export default function FieldSwitch() {
  return (
    <Field orientation="horizontal" class="w-fit">
      <FieldLabel for="2fa-input">Multi-factor authentication</FieldLabel>
      <Switch id="2fa" name="2fa">
        <SwitchControl>
          <SwitchThumb />
        </SwitchControl>
      </Switch>
    </Field>
  );
}

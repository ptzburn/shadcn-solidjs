import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from "~/registry/ui/field.tsx";
import { Switch, SwitchControl, SwitchThumb } from "~/registry/ui/switch.tsx";

export default function SwitchInvalid() {
  return (
    <Field orientation="horizontal" class="max-w-sm" data-invalid>
      <FieldContent>
        <FieldLabel for="switch-terms-input">
          Accept terms and conditions
        </FieldLabel>
        <FieldDescription>
          You must accept the terms and conditions to continue.
        </FieldDescription>
      </FieldContent>
      <Switch id="switch-terms" validationState="invalid">
        <SwitchControl>
          <SwitchThumb />
        </SwitchControl>
      </Switch>
    </Field>
  );
}

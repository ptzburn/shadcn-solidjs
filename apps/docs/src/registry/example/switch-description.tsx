import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from "~/registry/ui/field.tsx";
import { Switch, SwitchControl, SwitchThumb } from "~/registry/ui/switch.tsx";

export default function SwitchDescription() {
  return (
    <Field orientation="horizontal" class="max-w-sm">
      <FieldContent>
        <FieldLabel for="switch-focus-mode-input">
          Share across devices
        </FieldLabel>
        <FieldDescription>
          Focus is shared across devices, and turns off when you leave the app.
        </FieldDescription>
      </FieldContent>
      <Switch id="switch-focus-mode">
        <SwitchControl>
          <SwitchThumb />
        </SwitchControl>
      </Switch>
    </Field>
  );
}

import { Field, FieldGroup, FieldLabel } from "~/registry/ui/field.tsx";
import { Switch, SwitchControl, SwitchThumb } from "~/registry/ui/switch.tsx";

export default function SwitchSizes() {
  return (
    <FieldGroup class="w-full max-w-[10rem]">
      <Field orientation="horizontal">
        <Switch id="switch-size-sm">
          <SwitchControl size="sm">
            <SwitchThumb />
          </SwitchControl>
        </Switch>
        <FieldLabel for="switch-size-sm-input">Small</FieldLabel>
      </Field>
      <Field orientation="horizontal">
        <Switch id="switch-size-default">
          <SwitchControl size="default">
            <SwitchThumb />
          </SwitchControl>
        </Switch>
        <FieldLabel for="switch-size-default-input">Default</FieldLabel>
      </Field>
    </FieldGroup>
  );
}

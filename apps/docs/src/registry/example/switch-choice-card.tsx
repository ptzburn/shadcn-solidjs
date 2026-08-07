import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "~/registry/ui/field.tsx";
import { Switch, SwitchControl, SwitchThumb } from "~/registry/ui/switch.tsx";

export default function SwitchChoiceCard() {
  return (
    <FieldGroup class="w-full max-w-sm">
      <FieldLabel for="switch-share-input">
        <Field orientation="horizontal">
          <FieldContent>
            <FieldTitle>Share across devices</FieldTitle>
            <FieldDescription>
              Focus is shared across devices, and turns off when you leave the
              app.
            </FieldDescription>
          </FieldContent>
          <Switch id="switch-share">
            <SwitchControl>
              <SwitchThumb />
            </SwitchControl>
          </Switch>
        </Field>
      </FieldLabel>
      <FieldLabel for="switch-notifications-input">
        <Field orientation="horizontal">
          <FieldContent>
            <FieldTitle>Enable notifications</FieldTitle>
            <FieldDescription>
              Receive notifications when focus mode is enabled or disabled.
            </FieldDescription>
          </FieldContent>
          <Switch id="switch-notifications" defaultChecked>
            <SwitchControl>
              <SwitchThumb />
            </SwitchControl>
          </Switch>
        </Field>
      </FieldLabel>
    </FieldGroup>
  );
}

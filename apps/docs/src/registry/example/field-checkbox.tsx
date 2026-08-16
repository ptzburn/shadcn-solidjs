import { Checkbox } from "~/registry/ui/checkbox.tsx";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "~/registry/ui/field.tsx";

export default function FieldCheckbox() {
  return (
    <FieldGroup class="w-full max-w-xs">
      <FieldSet>
        <FieldLegend variant="label">
          Show these items on the desktop
        </FieldLegend>
        <FieldDescription>
          Select the items you want to show on the desktop.
        </FieldDescription>
        <FieldGroup class="gap-3">
          <Field orientation="horizontal">
            <Checkbox
              id="finder-pref-9k2-hard-disks-ljj"
              name="finder-pref-9k2-hard-disks-ljj"
              defaultChecked
            />
            <FieldLabel
              for="finder-pref-9k2-hard-disks-ljj-input"
              class="font-normal"
            >
              Hard disks
            </FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <Checkbox
              id="finder-pref-9k2-external-disks-1yg"
              name="finder-pref-9k2-external-disks-1yg"
            />
            <FieldLabel
              for="finder-pref-9k2-external-disks-1yg-input"
              class="font-normal"
            >
              External disks
            </FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <Checkbox
              id="finder-pref-9k2-cds-dvds-fzt"
              name="finder-pref-9k2-cds-dvds-fzt"
            />
            <FieldLabel
              for="finder-pref-9k2-cds-dvds-fzt-input"
              class="font-normal"
            >
              CDs, DVDs, and iPods
            </FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <Checkbox
              id="finder-pref-9k2-connected-servers-6l2"
              name="finder-pref-9k2-connected-servers-6l2"
            />
            <FieldLabel
              for="finder-pref-9k2-connected-servers-6l2-input"
              class="font-normal"
            >
              Connected servers
            </FieldLabel>
          </Field>
        </FieldGroup>
      </FieldSet>
      <FieldSeparator />
      <Field orientation="horizontal">
        <Checkbox
          id="finder-pref-9k2-sync-folders-nep"
          name="finder-pref-9k2-sync-folders-nep"
          defaultChecked
        />
        <FieldContent>
          <FieldLabel for="finder-pref-9k2-sync-folders-nep-input">
            Sync Desktop & Documents folders
          </FieldLabel>
          <FieldDescription>
            Your Desktop & Documents folders are being synced with iCloud Drive.
            You can access them from other devices.
          </FieldDescription>
        </FieldContent>
      </Field>
    </FieldGroup>
  );
}

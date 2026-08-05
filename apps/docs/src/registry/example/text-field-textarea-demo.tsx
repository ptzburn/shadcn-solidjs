import { TextField, TextFieldTextArea } from "~/registry/ui/text-field.tsx";

export default function TextareaDemo() {
  return (
    <TextField>
      <TextFieldTextArea placeholder="Type your message here." />
    </TextField>
  );
}

import { TextField, TextFieldInput } from "~/registry/ui/text-field.tsx";

export function Search() {
  return (
    <div>
      <TextField>
        <TextFieldInput
          type="search"
          placeholder="Search..."
          class="md:w-[100px] lg:w-[300px]"
        />
      </TextField>
    </div>
  );
}

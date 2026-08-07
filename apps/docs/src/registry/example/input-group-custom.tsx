import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
} from "~/registry/ui/input-group.tsx";

export default function InputGroupCustom() {
  return (
    <div class="grid w-full max-w-sm gap-6">
      <InputGroup>
        <textarea
          data-slot="input-group-control"
          class="flex field-sizing-content min-h-16 w-full resize-none rounded-md bg-transparent px-3 py-2.5 text-base outline-none transition-[color,box-shadow] md:text-sm"
          placeholder="Autoresize textarea..."
        />
        <InputGroupAddon align="block-end">
          <InputGroupButton class="ml-auto" size="sm" variant="default">
            Submit
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}

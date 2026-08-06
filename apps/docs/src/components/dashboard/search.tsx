import { Input } from "~/registry/ui/input.tsx";

export function Search() {
  return (
    <div>
      <Input
        type="search"
        placeholder="Search..."
        class="md:w-[100px] lg:w-[300px]"
      />
    </div>
  );
}

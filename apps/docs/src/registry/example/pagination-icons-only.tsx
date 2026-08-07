import { Field, FieldLabel } from "~/registry/ui/field.tsx";
import {
  Pagination,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "~/registry/ui/pagination.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/registry/ui/select.tsx";

const ROWS_PER_PAGE = ["10", "25", "50", "100"];

export default function PaginationIconsOnly() {
  return (
    <div class="flex w-full items-center justify-between gap-4">
      <Field orientation="horizontal" class="w-fit">
        <FieldLabel for="select-rows-per-page">Rows per page</FieldLabel>
        <Select
          defaultValue="25"
          options={ROWS_PER_PAGE}
          itemComponent={(props) => (
            <SelectItem item={props.item}>{props.item.rawValue}</SelectItem>
          )}
        >
          <SelectTrigger
            id="select-rows-per-page"
            aria-label="Rows per page"
            class="w-20"
          >
            <SelectValue<string>>
              {(state) => state.selectedOption()}
            </SelectValue>
          </SelectTrigger>
          <SelectContent />
        </Select>
      </Field>
      <Pagination
        count={10}
        defaultPage={2}
        class="mx-0 w-auto"
        itemComponent={(props) => (
          <PaginationItem page={props.page}>{props.page}</PaginationItem>
        )}
        ellipsisComponent={() => <PaginationEllipsis />}
      >
        <PaginationPrevious />
        <PaginationNext />
      </Pagination>
    </div>
  );
}

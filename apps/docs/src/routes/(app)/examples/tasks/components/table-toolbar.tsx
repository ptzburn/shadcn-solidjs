import type { RowData, Table } from "@tanstack/solid-table";

import { IconX } from "~/components/icons.tsx";
import { Button } from "~/registry/ui/button.tsx";
import { TextField, TextFieldInput } from "~/registry/ui/text-field.tsx";

import { priorities, statuses } from "./data.tsx";
import type { TaskTableFeatures } from "./data-table.tsx";
import { TableFacetedFilter } from "./table-faceted-filter.tsx";
import { TableViewOptions } from "./table-view-options.tsx";

type DataTableToolbarProps<TData extends RowData> = {
  table: Table<TaskTableFeatures, TData>;
};

export function TableToolbar<TData extends RowData>(
  props: DataTableToolbarProps<TData>,
) {
  const isFiltered = () => props.table.atoms.columnFilters.get().length > 0;

  return (
    <div class="flex items-center justify-between">
      <div class="flex flex-1 items-center space-x-2">
        <TextField
          value={(props.table.getColumn("title")?.getFilterValue() as string) ??
            ""}
          onChange={(value) =>
            props.table.getColumn("title")?.setFilterValue(value)}
        >
          <TextFieldInput
            placeholder="Filter tasks..."
            class="h-8 w-[150px] lg:w-[250px]"
          />
        </TextField>
        {props.table.getColumn("status") && (
          <TableFacetedFilter
            column={props.table.getColumn("status")}
            title="Status"
            options={statuses}
          />
        )}
        {props.table.getColumn("priority") && (
          <TableFacetedFilter
            column={props.table.getColumn("priority")}
            title="Priority"
            options={priorities}
          />
        )}
        {isFiltered() && (
          <Button
            variant="ghost"
            onClick={() => props.table.resetColumnFilters()}
            class="h-8 px-2 lg:px-3"
          >
            Reset
            <IconX />
          </Button>
        )}
      </div>
      <TableViewOptions table={props.table} />
    </div>
  );
}

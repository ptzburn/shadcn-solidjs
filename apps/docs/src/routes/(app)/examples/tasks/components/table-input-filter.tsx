import type { ComponentProps } from "solid-js";
import { splitProps } from "solid-js";

import type { Column, RowData } from "@tanstack/solid-table";

import { TextField, TextFieldInput } from "~/registry/ui/text-field.tsx";

import type { TaskTableFeatures } from "./data-table.tsx";

type TableInputFilterProps<TData extends RowData, TValue> =
  & ComponentProps<typeof TextFieldInput>
  & {
    column?: Column<TaskTableFeatures, TData, TValue>;
  };

export function TableInputFilter<TData extends RowData, TValue>(
  props: TableInputFilterProps<TData, TValue>,
) {
  const [local, others] = splitProps(props, ["column"]);
  return (
    <TextField
      value={(local.column?.getFilterValue() as string) ?? ""}
      onChange={(value) => local.column?.setFilterValue(value)}
    >
      <TextFieldInput {...others} />
    </TextField>
  );
}

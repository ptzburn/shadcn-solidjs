import type { ComponentProps } from "solid-js";
import { splitProps } from "solid-js";

import type { Column, RowData } from "@tanstack/solid-table";

import { Input } from "~/registry/ui/input.tsx";

import type { TaskTableFeatures } from "./data-table.tsx";

type TableInputFilterProps<TData extends RowData, TValue> =
  & ComponentProps<typeof Input>
  & {
    column?: Column<TaskTableFeatures, TData, TValue>;
  };

export function TableInputFilter<TData extends RowData, TValue>(
  props: TableInputFilterProps<TData, TValue>,
) {
  const [local, others] = splitProps(props, ["column"]);
  return (
    <Input
      value={(local.column?.getFilterValue() as string) ?? ""}
      onInput={(e) => local.column?.setFilterValue(e.currentTarget.value)}
      {...others}
    />
  );
}

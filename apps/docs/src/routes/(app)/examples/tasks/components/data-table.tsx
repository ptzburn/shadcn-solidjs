import { createSignal, For, Show } from "solid-js";
import { createAsync, query } from "@solidjs/router";

import type {
  ColumnDef,
  ColumnFiltersState,
  ColumnVisibilityState,
  RowData,
  RowSelectionState,
  SortingState,
} from "@tanstack/solid-table";
import {
  columnFacetingFeature,
  columnFilteringFeature,
  columnVisibilityFeature,
  createCoreRowModel,
  createFacetedRowModel,
  createFacetedUniqueValues,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  createTable,
  filterFns,
  flexRender,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFns,
  tableFeatures,
} from "@tanstack/solid-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/registry/ui/table.tsx";

import { TablePagination } from "./table-pagination.tsx";
import { TableToolbar } from "./table-toolbar.tsx";

export const features = tableFeatures({
  rowSelectionFeature,
  columnVisibilityFeature,
  columnFilteringFeature,
  columnFacetingFeature,
  rowSortingFeature,
  rowPaginationFeature,
  coreRowModel: createCoreRowModel(),
  filteredRowModel: createFilteredRowModel(),
  facetedRowModel: createFacetedRowModel(),
  facetedUniqueValues: createFacetedUniqueValues(),
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
  filterFns,
  sortFns,
});

export type TaskTableFeatures = typeof features;

type DataTableProps<TData extends RowData> = {
  columns: ColumnDef<TaskTableFeatures, TData>[];
  data: TData[];
};

// deno-lint-ignore require-await
const getData = query(async () => {
  "use server";
  // Fetch data from your api
  return [
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "m@example.com",
    },
    // ...
  ];
}, "getData");

export function DataTable<TData extends RowData>(
  props: DataTableProps<TData>,
) {
  const [rowSelection, setRowSelection] = createSignal<RowSelectionState>({});
  const [columnVisibility, setColumnVisibility] = createSignal<
    ColumnVisibilityState
  >(
    {},
  );
  const [columnFilters, setColumnFilters] = createSignal<ColumnFiltersState>(
    [],
  );
  const [sorting, setSorting] = createSignal<SortingState>([]);

  const _data = createAsync(() => getData());

  const table = createTable({
    features,
    get data() {
      return props.data;
    },
    get columns() {
      return props.columns;
    },
    state: {
      get sorting() {
        return sorting();
      },
      get columnVisibility() {
        return columnVisibility();
      },
      get rowSelection() {
        return rowSelection();
      },
      get columnFilters() {
        return columnFilters();
      },
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
  });

  return (
    <div class="space-y-4">
      <TableToolbar table={table} />
      <div class="rounded-md border">
        <Table>
          <TableHeader>
            <For each={table.getHeaderGroups()}>
              {(headerGroup) => (
                <TableRow>
                  <For each={headerGroup.headers}>
                    {(header) => (
                      <TableHead colSpan={header.colSpan}>
                        <Show when={!header.isPlaceholder}>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                        </Show>
                      </TableHead>
                    )}
                  </For>
                </TableRow>
              )}
            </For>
          </TableHeader>
          <TableBody>
            <Show
              when={table.getRowModel().rows?.length}
              fallback={
                <TableRow>
                  <TableCell
                    colSpan={props.columns.length}
                    class="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              }
            >
              <For each={table.getRowModel().rows}>
                {(row) => (
                  <TableRow data-state={row.getIsSelected() && "selected"}>
                    <For each={row.getVisibleCells()}>
                      {(cell) => (
                        <TableCell>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      )}
                    </For>
                  </TableRow>
                )}
              </For>
            </Show>
          </TableBody>
        </Table>
      </div>
      <TablePagination table={table} />
    </div>
  );
}

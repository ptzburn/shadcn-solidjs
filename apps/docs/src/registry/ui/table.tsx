import type { ComponentProps } from "@solidjs/web";
import { cn } from "~/lib/utils.ts";
import type { Component } from "solid-js";

import { omit } from "solid-js";

const Table: Component<ComponentProps<"table">> = (props) => {
  const others = omit(props, "class");
  return (
    <div
      data-slot="table-container"
      class="relative w-full overflow-x-auto"
    >
      <table
        data-slot="table"
        class={cn("w-full caption-bottom text-sm", props.class)}
        {...others}
      />
    </div>
  );
};

const TableHeader: Component<ComponentProps<"thead">> = (props) => {
  const others = omit(props, "class");
  return (
    <thead
      data-slot="table-header"
      class={cn("[&_tr]:border-b", props.class)}
      {...others}
    />
  );
};

const TableBody: Component<ComponentProps<"tbody">> = (props) => {
  const others = omit(props, "class");
  return (
    <tbody
      data-slot="table-body"
      class={cn("[&_tr:last-child]:border-0", props.class)}
      {...others}
    />
  );
};

const TableFooter: Component<ComponentProps<"tfoot">> = (props) => {
  const others = omit(props, "class");
  return (
    <tfoot
      data-slot="table-footer"
      class={cn(
        "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
        props.class,
      )}
      {...others}
    />
  );
};

const TableRow: Component<ComponentProps<"tr">> = (props) => {
  const others = omit(props, "class");
  return (
    <tr
      data-slot="table-row"
      class={cn(
        "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted has-aria-expanded:bg-muted/50",
        props.class,
      )}
      {...others}
    />
  );
};

const TableHead: Component<ComponentProps<"th">> = (props) => {
  const others = omit(props, "class");
  return (
    <th
      data-slot="table-head"
      class={cn(
        "h-10 whitespace-nowrap px-2 text-left align-middle font-medium text-foreground [&:has([data-slot=checkbox])]:pr-0 [&:has([role=checkbox])]:pr-0",
        props.class,
      )}
      {...others}
    />
  );
};

const TableCell: Component<ComponentProps<"td">> = (props) => {
  const others = omit(props, "class");
  return (
    <td
      data-slot="table-cell"
      class={cn(
        "whitespace-nowrap p-2 align-middle [&:has([data-slot=checkbox])]:pr-0 [&:has([role=checkbox])]:pr-0",
        props.class,
      )}
      {...others}
    />
  );
};

const TableCaption: Component<ComponentProps<"caption">> = (props) => {
  const others = omit(props, "class");
  return (
    <caption
      data-slot="table-caption"
      class={cn("mt-4 text-muted-foreground text-sm", props.class)}
      {...others}
    />
  );
};

export {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
};

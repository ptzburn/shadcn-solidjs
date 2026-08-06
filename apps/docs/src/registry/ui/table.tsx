import { cn } from "~/lib/utils.ts";
import type { Component, ComponentProps } from "solid-js";

import { splitProps } from "solid-js";

const Table: Component<ComponentProps<"table">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <div
      data-slot="table-container"
      class="cn-table-container"
    >
      <table
        data-slot="table"
        class={cn("cn-table", local.class)}
        {...others}
      />
    </div>
  );
};

const TableHeader: Component<ComponentProps<"thead">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <thead
      data-slot="table-header"
      class={cn("cn-table-header", local.class)}
      {...others}
    />
  );
};

const TableBody: Component<ComponentProps<"tbody">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <tbody
      data-slot="table-body"
      class={cn("cn-table-body", local.class)}
      {...others}
    />
  );
};

const TableFooter: Component<ComponentProps<"tfoot">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <tfoot
      data-slot="table-footer"
      class={cn(
        "cn-table-footer",
        local.class,
      )}
      {...others}
    />
  );
};

const TableRow: Component<ComponentProps<"tr">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <tr
      data-slot="table-row"
      class={cn(
        "cn-table-row has-aria-expanded:bg-muted/50",
        local.class,
      )}
      {...others}
    />
  );
};

const TableHead: Component<ComponentProps<"th">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <th
      data-slot="table-head"
      class={cn(
        "cn-table-head",
        local.class,
      )}
      {...others}
    />
  );
};

const TableCell: Component<ComponentProps<"td">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <td
      data-slot="table-cell"
      class={cn(
        "cn-table-cell",
        local.class,
      )}
      {...others}
    />
  );
};

const TableCaption: Component<ComponentProps<"caption">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <caption
      data-slot="table-caption"
      class={cn("cn-table-caption", local.class)}
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

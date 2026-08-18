import type { ComponentProps } from "@solidjs/web";
import { cn } from "~/lib/utils.ts";
import type { Component } from "solid-js";

import { omit } from "solid-js";

const Table: Component<ComponentProps<"table">> = (props) => {
  const others = omit(props, "class");
  return (
    <div
      data-slot="table-container"
      class="cn-table-container"
    >
      <table
        data-slot="table"
        class={cn("cn-table", props.class)}
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
      class={cn("cn-table-header", props.class)}
      {...others}
    />
  );
};

const TableBody: Component<ComponentProps<"tbody">> = (props) => {
  const others = omit(props, "class");
  return (
    <tbody
      data-slot="table-body"
      class={cn("cn-table-body", props.class)}
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
        "cn-table-footer",
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
        "cn-table-row has-aria-expanded:bg-muted/50",
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
        "cn-table-head",
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
        "cn-table-cell",
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
      class={cn("cn-table-caption", props.class)}
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

// Hand-authored stand-in for the generated registry index: main generates
// this file with scripts/build-registry.ts, which is not ported yet. Only
// the demos whose registry dependencies exist on this branch are listed.
// Replace with the generated file once the registry build lands.
import type { Component } from "solid-js";

import { lazy } from "solid-js";

type IndexEntry = {
  name: string;
  type: "example";
  component: Component;
};

export const Index: Record<string, IndexEntry> = {
  "accordion-demo": {
    name: "accordion-demo",
    type: "example",
    component: lazy(() => import("~/registry/example/accordion-demo.tsx")),
  },
  "alert-demo": {
    name: "alert-demo",
    type: "example",
    component: lazy(() => import("~/registry/example/alert-demo.tsx")),
  },
  "badge-demo": {
    name: "badge-demo",
    type: "example",
    component: lazy(() => import("~/registry/example/badge-demo.tsx")),
  },
  "button-demo": {
    name: "button-demo",
    type: "example",
    component: lazy(() => import("~/registry/example/button-demo.tsx")),
  },
  "dropdown-menu-demo": {
    name: "dropdown-menu-demo",
    type: "example",
    component: lazy(() => import("~/registry/example/dropdown-menu-demo.tsx")),
  },
  "tooltip-demo": {
    name: "tooltip-demo",
    type: "example",
    component: lazy(() => import("~/registry/example/tooltip-demo.tsx")),
  },
};

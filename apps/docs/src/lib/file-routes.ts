/**
 * Local copy of `fileRoutes` from `@solidjs/router/fs` (2.0.0-next.16).
 *
 * solid-js 2.0.0-rc.1 moved `lazy()`'s bundler-injected module URL to the
 * third argument — `lazy(fn, options?, moduleUrl?)` — to make room for the
 * `{ export }` options bag, and its dev build throws when the second
 * argument is still a string. The router's adapter predates that change
 * and calls `lazy(ref.import, ref.src)`, which takes the dev server down on
 * first render. This is the same adapter with the call updated; drop it and
 * import `fileRoutes` from `@solidjs/router/fs` again once the router ships
 * against rc.1.
 */
import type {
  FileRouteEagerRef,
  FileRouteEntry,
  FileRouteLazyRef,
  FileRoutesFrom,
} from "@solidjs/router/fs";

import type { Component } from "solid-js";
import { lazy } from "solid-js";

type ComponentRef =
  | FileRouteLazyRef<{ default: Component }>
  | FileRouteEagerRef<{
    default: Component;
  }>;

export function fileRoutes<const T extends readonly FileRouteEntry[]>(
  entries: T,
): FileRoutesFrom<T> {
  const components = new Map<string, Component>();
  const componentOf = (ref: ComponentRef): Component => {
    if ("require" in ref) {
      return ref.require().default;
    }
    let component = components.get(ref.src);
    if (!component) {
      component = lazy(ref.import, undefined, ref.src);
      components.set(ref.src, component);
    }
    return component;
  };
  const toRoute = (entry: FileRouteEntry): unknown => {
    const config = entry.$$route?.require().route ?? {};
    return {
      ...config,
      path: entry.path,
      component: entry.$component
        ? componentOf(entry.$component as ComponentRef)
        : undefined,
      info: { ...config.info, filesystem: true },
      children: entry.children ? entry.children.map(toRoute) : undefined,
    };
  };
  return entries.map(toRoute) as unknown as FileRoutesFrom<T>;
}

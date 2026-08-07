import path from "node:path";
import process from "node:process";

import type { RegistryConfig } from "../config/schema.ts";
import { isUrl, resolveItemAddress } from "./address.ts";
import { buildItemUrl } from "./builder.ts";
import { REGISTRY_THEME_URL } from "./constants.ts";
import { RegistryNotFoundError } from "./errors.ts";
import { fetchRegistryItem } from "./fetcher.ts";
import type {
  RegistryItem,
  RegistryItemCss,
  RegistryItemCssVars,
  RegistryItemFile,
  RegistryResolvedItemsTree,
} from "./schema.ts";

export interface ResolveOptions {
  registries?: RegistryConfig;
  iconLibrary?: string;
}

interface ResolvedNode {
  key: string;
  item: RegistryItem;
  /** Keys of this item's registryDependencies. */
  deps: string[];
}

/**
 * Canonical identity for an address: two spellings that resolve to the same
 * URL dedupe, while same-named items from different registries stay distinct.
 */
function addressKey(address: string, options: ResolveOptions): string {
  const parsed = resolveItemAddress(address);
  if (parsed.kind === "url") return parsed.url;
  if (parsed.kind === "file") return path.resolve(process.cwd(), parsed.path);

  const built = buildItemUrl(parsed, options)?.url ?? address;
  return isUrl(built) ? built : path.resolve(process.cwd(), built);
}

/**
 * A registry template that does not resolve to an http(s) URL is treated as a
 * filesystem path, so `REGISTRY_URL` can point at a built `public/r` directory
 * without a server in front of it.
 */
function fetchFrom(
  location: string,
  headers?: Record<string, string>,
): Promise<RegistryItem> {
  return isUrl(location)
    ? fetchRegistryItem({ url: location, headers })
    : fetchRegistryItem({ path: location });
}

async function fetchByAddress(
  address: string,
  options: ResolveOptions,
): Promise<RegistryItem> {
  const parsed = resolveItemAddress(address);
  if (parsed.kind === "url") {
    return await fetchRegistryItem({ url: parsed.url });
  }
  if (parsed.kind === "file") {
    return await fetchRegistryItem({ path: parsed.path });
  }

  const built = buildItemUrl(parsed, options);
  if (!built) {
    throw new Error(`Could not build a URL for "${address}".`);
  }

  try {
    return await fetchFrom(built.url, built.headers);
  } catch (error) {
    // Themes carry no files and so sit outside the icon-library fan-out that
    // the item template addresses. Only a bare name against the built-in
    // registry can mean a theme, so the retry is scoped to that.
    if (!(error instanceof RegistryNotFoundError) || parsed.kind !== "name") {
      throw error;
    }
    return await fetchFrom(REGISTRY_THEME_URL.replace("{name}", parsed.name));
  }
}

/**
 * Walks registryDependencies breadth-first, fetching each item once. The
 * `visited` set makes cycles terminate rather than recurse forever.
 */
async function collectNodes(
  addresses: string[],
  options: ResolveOptions,
): Promise<Map<string, ResolvedNode>> {
  const nodes = new Map<string, ResolvedNode>();
  const visited = new Set<string>();
  let frontier = addresses;

  while (frontier.length > 0) {
    const pending = frontier.filter((address) => {
      const key = addressKey(address, options);
      if (visited.has(key)) return false;
      visited.add(key);
      return true;
    });

    const fetched = await Promise.all(
      pending.map(async (address) => ({
        key: addressKey(address, options),
        item: await fetchByAddress(address, options),
      })),
    );

    const next: string[] = [];
    for (const { key, item } of fetched) {
      const deps = item.registryDependencies ?? [];
      nodes.set(key, {
        key,
        item,
        deps: deps.map((dep) => addressKey(dep, options)),
      });
      next.push(...deps);
    }
    frontier = next;
  }

  return nodes;
}

/**
 * Kahn's algorithm, so an item is always written after everything it depends
 * on. Cycles are tolerated rather than fatal: whatever is left over when the
 * queue drains is appended in insertion order, matching upstream.
 */
function topologicalSort(nodes: Map<string, ResolvedNode>): RegistryItem[] {
  const inDegree = new Map<string, number>();
  const dependents = new Map<string, string[]>();

  for (const key of nodes.keys()) {
    inDegree.set(key, 0);
    dependents.set(key, []);
  }

  for (const node of nodes.values()) {
    for (const dep of node.deps) {
      if (!nodes.has(dep)) continue;
      inDegree.set(node.key, (inDegree.get(node.key) ?? 0) + 1);
      dependents.get(dep)!.push(node.key);
    }
  }

  const queue = [...nodes.keys()].filter((key) => inDegree.get(key) === 0);
  const ordered: RegistryItem[] = [];
  const emitted = new Set<string>();

  while (queue.length > 0) {
    const key = queue.shift()!;
    ordered.push(nodes.get(key)!.item);
    emitted.add(key);

    for (const dependent of dependents.get(key) ?? []) {
      const degree = (inDegree.get(dependent) ?? 0) - 1;
      inDegree.set(dependent, degree);
      if (degree === 0) queue.push(dependent);
    }
  }

  for (const [key, node] of nodes) {
    if (!emitted.has(key)) ordered.push(node.item);
  }

  return ordered;
}

function mergeCss(
  target: RegistryItemCss,
  source: RegistryItemCss,
): RegistryItemCss {
  const result: RegistryItemCss = { ...target };
  for (const [key, value] of Object.entries(source)) {
    const existing = result[key];
    result[key] = typeof value === "object" && typeof existing === "object" &&
        existing !== null
      ? mergeCss(existing, value)
      : value;
  }
  return result;
}

function mergeCssVars(
  target: RegistryItemCssVars,
  source: RegistryItemCssVars,
): RegistryItemCssVars {
  return {
    theme: { ...target.theme, ...source.theme },
    light: { ...target.light, ...source.light },
    dark: { ...target.dark, ...source.dark },
  };
}

/** Later files win, keyed by where they will be written. */
function deduplicateFiles(files: RegistryItemFile[]): RegistryItemFile[] {
  const byTarget = new Map<string, RegistryItemFile>();
  for (const file of files) {
    byTarget.set(file.target ?? file.path, file);
  }
  return [...byTarget.values()];
}

/**
 * Resolves addresses and everything they depend on into a single ordered set
 * of items. Theme items are stable-sorted to the front so CSS variables are
 * established before the components that reference them.
 */
export async function resolveRegistryItems(
  addresses: string[],
  options: ResolveOptions = {},
): Promise<RegistryItem[]> {
  const nodes = await collectNodes(addresses, options);
  const ordered = topologicalSort(nodes);

  return [
    ...ordered.filter((item) => item.type === "registry:theme"),
    ...ordered.filter((item) => item.type !== "registry:theme"),
  ];
}

/** Collapses resolved items into the single payload the updaters consume. */
export async function resolveRegistryTree(
  addresses: string[],
  options: ResolveOptions = {},
): Promise<RegistryResolvedItemsTree> {
  const items = await resolveRegistryItems(addresses, options);

  const dependencies = new Set<string>();
  const devDependencies = new Set<string>();
  const files: RegistryItemFile[] = [];
  const docs: string[] = [];
  let cssVars: RegistryItemCssVars | undefined;
  let css: RegistryItemCss | undefined;

  for (const item of items) {
    for (const dep of item.dependencies ?? []) dependencies.add(dep);
    for (const dep of item.devDependencies ?? []) devDependencies.add(dep);
    if (item.files) files.push(...item.files);
    if (item.docs) docs.push(item.docs);
    if (item.cssVars) cssVars = mergeCssVars(cssVars ?? {}, item.cssVars);
    if (item.css) css = mergeCss(css ?? {}, item.css);
  }

  return {
    dependencies: [...dependencies],
    devDependencies: [...devDependencies],
    files: deduplicateFiles(files),
    docs,
    ...(cssVars ? { cssVars } : {}),
    ...(css ? { css } : {}),
  };
}

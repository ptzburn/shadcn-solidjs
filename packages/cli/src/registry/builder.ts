import process from "node:process";

import type { RegistryConfig, RegistryConfigItem } from "../config/schema.ts";
import { type ItemAddress, resolveItemAddress } from "./address.ts";
import {
  BUILTIN_REGISTRIES,
  DEFAULT_ICON_LIBRARY,
  DEFAULT_REGISTRY,
  DEFAULT_STYLE,
} from "./constants.ts";
import { RegistryNotConfiguredError } from "./errors.ts";

export interface BuildUrlOptions {
  registries?: RegistryConfig;
  iconLibrary?: string;
  style?: string;
}

export interface BuiltUrl {
  url: string;
  headers?: Record<string, string>;
}

/** Expands `${VAR}` against the environment, as upstream does. */
function expandEnvVars(value: string): string {
  return value.replace(/\$\{(\w+)\}/g, (_, key) => process.env[key] ?? "");
}

/**
 * Drops a header whose variables did not expand, so an unset token yields no
 * Authorization header rather than a broken one.
 */
function shouldIncludeHeader(rawValue: string): boolean {
  const referenced = rawValue.match(/\$\{(\w+)\}/g);
  if (!referenced) return true;
  return referenced.every((ref) => {
    const key = ref.slice(2, -1);
    return Boolean(process.env[key]);
  });
}

function normalizeRegistryConfigItem(item: RegistryConfigItem): {
  url: string;
  params?: Record<string, string>;
  headers?: Record<string, string>;
} {
  return typeof item === "string" ? { url: item } : item;
}

function applyTemplate(
  template: string,
  item: string,
  iconLibrary: string,
  style: string,
): string {
  return template
    .replaceAll("{name}", item)
    .replaceAll("{iconLibrary}", iconLibrary)
    .replaceAll("{style}", style);
}

function appendParams(url: string, params?: Record<string, string>): string {
  if (!params || Object.keys(params).length === 0) return url;
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    const expanded = expandEnvVars(value);
    if (expanded) search.set(key, expanded);
  }
  const query = search.toString();
  if (!query) return url;
  return url + (url.includes("?") ? "&" : "?") + query;
}

/**
 * Turns an item address into a fetchable URL. Returns null for addresses that
 * are already concrete (a raw URL or a local file), which the fetcher handles
 * directly.
 */
export function buildItemUrl(
  address: ItemAddress,
  options: BuildUrlOptions = {},
): BuiltUrl | null {
  if (address.kind === "url" || address.kind === "file") {
    return null;
  }

  const iconLibrary = options.iconLibrary ?? DEFAULT_ICON_LIBRARY;
  const style = options.style ?? DEFAULT_STYLE;
  const registryName = address.kind === "namespace"
    ? address.registry
    : DEFAULT_REGISTRY;
  const item = address.kind === "namespace" ? address.item : address.name;

  const registries: Record<string, RegistryConfigItem> = {
    ...BUILTIN_REGISTRIES,
    ...(options.registries ?? {}),
  };

  const configured = registries[registryName];
  if (!configured) {
    throw new RegistryNotConfiguredError(registryName);
  }

  const { url, params, headers } = normalizeRegistryConfigItem(configured);
  const templated = expandEnvVars(
    applyTemplate(url, item, iconLibrary, style),
  );

  const resolvedHeaders: Record<string, string> = {};
  for (const [key, value] of Object.entries(headers ?? {})) {
    if (shouldIncludeHeader(value)) {
      resolvedHeaders[key] = expandEnvVars(value);
    }
  }

  return {
    url: appendParams(templated, params),
    headers: Object.keys(resolvedHeaders).length > 0
      ? resolvedHeaders
      : undefined,
  };
}

/** Convenience wrapper for the common "string in, URL out" case. */
export function buildUrlForItem(
  address: string,
  options: BuildUrlOptions = {},
): BuiltUrl | null {
  return buildItemUrl(resolveItemAddress(address), options);
}

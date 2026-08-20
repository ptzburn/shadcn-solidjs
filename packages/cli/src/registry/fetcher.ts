import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

import { isUrl } from "./address.ts";
import {
  RegistryFetchError,
  RegistryForbiddenError,
  RegistryNotFoundError,
  RegistryParseError,
  RegistryUnauthorizedError,
} from "./errors.ts";
import {
  type RegistryIndex,
  registryIndexSchema,
  type RegistryItem,
  registryItemSchema,
} from "./schema.ts";

const ACCEPT = "application/vnd.shadcn.v1+json, application/json;q=0.9";

const cache = new Map<string, Promise<unknown>>();

/** Exposed so tests can start from a clean slate. */
export function clearRegistryCache(): void {
  cache.clear();
}

async function readJsonFromUrl(
  url: string,
  headers?: Record<string, string>,
): Promise<unknown> {
  let response: Response;
  try {
    response = await fetch(url, {
      headers: { Accept: ACCEPT, "User-Agent": "shadcn-solidjs", ...headers },
    });
  } catch (cause) {
    throw new RegistryFetchError(url, undefined, { cause });
  }

  if (!response.ok) {
    switch (response.status) {
      case 401:
        throw new RegistryUnauthorizedError(url);
      case 403:
        throw new RegistryForbiddenError(url);
      case 404:
        throw new RegistryNotFoundError(url);
      default:
        throw new RegistryFetchError(url, response.status);
    }
  }

  const body = await response.text();
  const contentType = response.headers.get("content-type") ?? "";

  // A registry served from a single-page app answers an unknown path with its
  // HTML shell and a 200, so the 404 branch above never fires and the item
  // reads as a parse failure ("Unexpected token '<'"). Report the miss it
  // actually is. The content-type is not enough on its own: registries do
  // serve JSON as text/plain, so the body has to look like markup too.
  if (!/\bjson\b/i.test(contentType) && /^\s*</.test(body)) {
    throw new RegistryNotFoundError(url);
  }

  try {
    return JSON.parse(body);
  } catch (cause) {
    throw new RegistryFetchError(url, response.status, { cause });
  }
}

async function readJsonFromFile(filePath: string): Promise<unknown> {
  const resolved = path.resolve(process.cwd(), filePath);
  try {
    return JSON.parse(await readFile(resolved, "utf8"));
  } catch (cause) {
    throw new RegistryNotFoundError(resolved, { cause });
  }
}

/** Fetches and caches raw JSON from a URL or a local path. */
export function fetchJson(
  source: { url: string; headers?: Record<string, string> } | { path: string },
): Promise<unknown> {
  const key = JSON.stringify(source);
  const cached = cache.get(key);
  if (cached) return cached;

  const pending = "path" in source
    ? readJsonFromFile(source.path)
    : readJsonFromUrl(source.url, source.headers);

  cache.set(key, pending);
  return pending;
}

export async function fetchRegistryItem(
  source: { url: string; headers?: Record<string, string> } | { path: string },
): Promise<RegistryItem> {
  const raw = await fetchJson(source);
  const parsed = registryItemSchema.safeParse(raw);
  if (!parsed.success) {
    throw new RegistryParseError(
      "path" in source ? source.path : source.url,
      parsed.error,
    );
  }
  return parsed.data;
}

/** Accepts a filesystem path too, so `REGISTRY_URL` can point at `public/r`. */
export async function fetchRegistryIndex(
  location: string,
): Promise<RegistryIndex> {
  const raw = await fetchJson(
    isUrl(location) ? { url: location } : { path: location },
  );
  const parsed = registryIndexSchema.safeParse(raw);
  if (!parsed.success) {
    throw new RegistryParseError(location, parsed.error);
  }
  return parsed.data;
}

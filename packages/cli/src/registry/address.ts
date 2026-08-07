/**
 * How an item was asked for on the command line.
 *
 * Upstream also resolves a `github` scheme (`owner/repo/item#ref`); that is
 * not ported yet.
 */
export type ItemAddress =
  | { kind: "url"; url: string }
  | { kind: "file"; path: string }
  | { kind: "namespace"; registry: string; item: string }
  | { kind: "name"; name: string };

const NAMESPACE_RE = /^(@[a-zA-Z0-9](?:[a-zA-Z0-9-_]*[a-zA-Z0-9])?)\/(.+)$/;

export function isUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function isLocalFile(value: string): boolean {
  return (
    value.endsWith(".json") &&
    (value.startsWith(".") || value.startsWith("/") || value.includes("/"))
  );
}

/** Splits `@acme/button` into its registry and item halves. */
export function parseNamespace(
  value: string,
): { registry: string; item: string } | null {
  const match = value.match(NAMESPACE_RE);
  if (!match) return null;
  return { registry: match[1], item: match[2] };
}

export function resolveItemAddress(address: string): ItemAddress {
  if (isUrl(address)) {
    return { kind: "url", url: address };
  }

  if (isLocalFile(address)) {
    return { kind: "file", path: address };
  }

  const namespaced = parseNamespace(address);
  if (namespaced) {
    return { kind: "namespace", ...namespaced };
  }

  return { kind: "name", name: address };
}

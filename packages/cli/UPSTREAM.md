# Upstream mapping

Where this CLI's files came from in
[shadcn-ui/ui](https://github.com/shadcn-ui/ui) (`packages/shadcn/src/`), and
why each one diverges. Paths in the _upstream_ column are relative to that
directory.

Kept deliberately bit-compatible: the `registry:*` type vocabulary, the
`components.json` field names, and `@namespace/item` addressing. Those are what
let third-party registries interoperate.

## Ported

| Ours                        | Upstream                                            | Divergence                                                                                                                                                                                                                                                                                                               |
| --------------------------- | --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `src/registry/schema.ts`    | `registry/schema.ts` (item half)                    | zod 4 rather than 3. Trimmed to the fields this registry emits — no `extends`, `tailwind`, `envVars`, `font`, or the `registry:base`/`registry:font` discriminated union. `registryResolvedItemsTreeSchema` is ours.                                                                                                     |
| `src/config/schema.ts`      | `registry/schema.ts` (config half)                  | Dropped `rsc` (no RSC in Solid), `style` (this registry has no styles), and `tailwind.config` (v4 only, where upstream's own updater returns immediately). **Not `.strict()`** — upstream rejects unknown keys, so a `components.json` carried from a React project fails outright instead of on the fields that matter. |
| `src/registry/constants.ts` | `registry/constants.ts`                             | `{iconLibrary}` replaces upstream's `{style}` placeholder. Built-in namespace is `@shadcn-solid`. `REGISTRY_THEME_URL` is ours — see the note below.                                                                                                                                                                     |
| `src/registry/errors.ts`    | `registry/errors.ts`                                | Trimmed to the raised cases. All carry `cause`.                                                                                                                                                                                                                                                                          |
| `src/registry/address.ts`   | `registry/address.ts` + `registry/parser.ts`        | Merged into one file. **The `github` scheme (`owner/repo/item#ref`) is not ported.**                                                                                                                                                                                                                                     |
| `src/registry/builder.ts`   | `registry/builder.ts` + `registry/env.ts`           | `${VAR}` expansion inlined rather than a separate module. Unlike upstream, the built-in registry _can_ be overridden by `registries` in `components.json`; upstream throws.                                                                                                                                              |
| `src/registry/fetcher.ts`   | `registry/fetcher.ts`                               | Global `fetch` instead of `undici` — both runtimes provide it. No proxy support, no RFC-7807 error-body parsing. Cache key is the plain source descriptor, not a sha.                                                                                                                                                    |
| `src/registry/resolver.ts`  | `registry/resolver.ts` + parts of `registry/api.ts` | Node identity is the resolved URL rather than `sha256(source‖name)`; same distinctness, less machinery. No `AsyncLocalStorage` header context — headers travel with the built URL. Merge is a focused function over `cssVars`/`css`/deps instead of the `deepmerge` dependency.                                          |

## Not ported

**Transformers.** `transform-rsc` and `transform-next` (no RSC, no Next),
`transform-aschild` and `transform-render` (Radix/Base-UI specific),
`transform-legacy-icons`, `transform-font`, `transform-menu`.

`transform-cleanup` is deliberately **excluded**: it strips all `cn-*` markers,
but this registry ships `cn-rtl-flip` and `cn-toast` as allowlisted selector
hooks — `cn-toast` is styled by solid-sonner. Stripping them breaks styling.

**Updaters.** `update-tailwind-config` and `update-tailwind-content` (v4 has no
config file), `update-fonts`.

**Commands.** Everything outside `init` and `add`: `build`, `diff`, `migrate`,
`info`, `view`, `search`, `eject`, `mcp`, `preset`, `registry`.

## Notes

**Icon libraries are resolved at build time.** Upstream's `transform-icons`
rewrites `<IconPlaceholder lucide="X" tabler="Y" …/>` at install time. This repo
resolves the identical marker during `build-registry.ts` into five per-library
variants under `r/icons/<library>/`, so the CLI selects a URL rather than
running a transformer. `iconLibrary` is therefore a path segment, not a codemod
input.

**Themes are addressed separately.** Every ui, lib, and hook item is reachable
under `r/icons/<library>/`, including items that carry no icons — deliberate, so
resolving `registryDependencies` never needs a fallback path. Themes are the
exception: they carry no files, are emitted to `r/themes/<name>.json`, and so
need `REGISTRY_THEME_URL`.

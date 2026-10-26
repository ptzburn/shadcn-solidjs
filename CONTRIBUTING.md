# Contributing

Thanks for your interest in contributing. This document covers how the repo is
laid out and how to run things locally.

## Prerequisites

The repo runs in a dev container (`.devcontainer/`) with everything it needs:
Node 24 and pnpm, Claude Code, the GitHub CLI and the project's VS Code
extensions. Open the repository in VS Code and run **Dev Containers: Reopen in
Container**; the first build runs `pnpm install`.

Outside the container you need [Node](https://nodejs.org) 24 or newer and
[pnpm](https://pnpm.io). The version in `packageManager` in `package.json` is
the one to use; pnpm switches itself to it. Then:

```sh
pnpm install
```

`node_modules/` in the container is a Docker volume, not the checkout's
folder, so the container keeps its own Linux builds of the native packages.
After pulling a dependency change, run `pnpm install` inside the container.

## Layout

A [pnpm workspace](https://pnpm.io/workspaces):

```
package.json          # workspace root: scripts, Node and pnpm versions, Vite+
pnpm-workspace.yaml   # members, the Vite catalog, dependency build approvals
vite.config.ts        # workspace-wide Oxfmt, Oxlint and Vitest settings
apps/
  docs/               # the docs site (Solid 2 app on Vite)
    scripts/lib/      # the ~/ resolve hook the registry scripts run with
    src/lib/          # cn(), clamp(), toggleValue(), use-id hook
    src/registry/     # the components themselves, plus styles/themes/icons
    src/scripts/      # registry + icon + token build scripts
    public/r/         # the generated registry served at /r
packages/
  solid/              # @ptzburn/shadcn-solid: unstyled primitives, built by tsdown
```

Dependencies are added per member as code arrives, at their latest versions.
The toolchain is [Vite+](https://viteplus.dev) (`vp`): Vite, Vitest, Oxlint and
Oxfmt in one dependency, configured in the root `vite.config.ts`. Code style is
Oxfmt's defaults.

## Commands

From the repo root:

```sh
pnpm dev     # run the docs site (port 3228)
pnpm build   # build the registry, then the docs site
pnpm start   # serve the built site as Cloudflare does (port 3228)
pnpm test    # run all tests across the workspace
pnpm lint    # lint all members
pnpm fmt     # format all members
pnpm check   # format check, lint and type check in one pass
```

Commit `pnpm-lock.yaml` when it changes.

## Git hooks

[lefthook](https://lefthook.dev) runs `pnpm check` before every commit.
`pnpm install` sets the hook up — lefthook is the one dependency whose install
script `allowBuilds` in `pnpm-workspace.yaml` lets run — so there is no
separate install step.

A failing check aborts the commit. To bypass the hook for one commit:

```sh
LEFTHOOK=0 git commit -m "..."
```

## The registry

`apps/docs/src/registry/` holds the source of truth for every component. The
generated registry under `apps/docs/public/r/` is what the shadcn CLI actually
fetches, and it is committed. After changing anything under `src/registry/`, regenerate
it:

```sh
pnpm build:registry
```

That fans every item out across 8 styles and 5 icon libraries, rebuilds the icon
modules and docs tokens, and formats the output. Commit the result alongside
your change.

The scripts behind it run on plain Node, which strips types natively, with
`apps/docs/scripts/lib/alias.mjs` resolving the `~/` alias the way
`tsconfig.json` and `vite.config.ts` do. Keep their import chain to erasable
TypeScript and explicit `.ts` extensions.

## Testing the registry locally

Components install with the [shadcn CLI](https://ui.shadcn.com/docs/cli). Every
item names the items it depends on by URL — the CLI would resolve a bare name
against ui.shadcn.com and install its React component — so a build points
those URLs at the live site. To test registry changes end to end, build with
`REGISTRY_ORIGIN` set to a local server and serve the result:

```sh
# terminal 1 — build with local dependency URLs, then serve the build
REGISTRY_ORIGIN=http://localhost:3228 pnpm build
pnpm start

# terminal 2 — from a test project with the ~ alias and Tailwind in place
npx shadcn@latest init http://localhost:3228/r/init/neutral.json
# then, in components.json:
#   "registries": { "@shadcn-solidjs": "http://localhost:3228/r/styles/nova/icons/lucide/{name}.json" }
npx shadcn@latest add @shadcn-solidjs/dialog
```

Run `pnpm build:registry` again without `REGISTRY_ORIGIN` before committing,
so the committed registry points at the live site.

`@kobalte/core` is pinned in every item to the exact version `apps/docs`
installs, because its npm `latest` is the Solid 1 release; the build reads it
from `apps/docs/package.json`. Other dependencies are left unversioned.

## Deploying the docs

The docs site is static. `pnpm build` renders every page through the server
build at build time ([`prerender-crawler`](https://github.com/solidjs/prerender-crawler))
and writes it to `apps/docs/dist/client` as `<route>.html`, next to the
Markdown exports and the registry JSON. Cloudflare Workers serves that
directory as static assets (`apps/docs/wrangler.jsonc`): no Worker script runs,
so requests cost no CPU time, and a path with no file gets the prerendered
`404.html`.

The crawl finds pages by following links from `/`, and `app.tsx` announces the
router's static routes so a page nothing links to is still rendered. It does
not follow `<iframe src>`. Prerendering happens without a request, so it sees
no cookies: anything rendered from a cookie must render the default first and
apply the stored value after hydration, as the style, base-color and
color-mode scripts in `Document.tsx` do for the root element.

**CI deploys on every push to `main`**, after the checks pass, with the
`CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` repository secrets. To
deploy by hand, run `pnpm --filter ./apps/docs run deploy` after
`pnpm exec wrangler login` in `apps/docs`.

## Porting from upstream

This project tracks [shadcn/ui](https://ui.shadcn.com). When porting a
component, keep the divergence deliberate.

The registry is installed by the shadcn CLI, so it stays a standard shadcn
registry: the `registry:*` item types and the item schema at
`https://ui.shadcn.com/schema/registry-item.json`. A change the shadcn CLI
cannot install needs a good reason and an end-to-end test as described above.

## Before opening a PR

The pre-commit hook already covers formatting, linting and type-checking. Tests
are not in the hook, so run them yourself:

```sh
pnpm test
```

## Workarounds to retest on upgrades

Each entry names a deliberate deviation, the package versions it was last
confirmed against, and how to check whether a newer release makes it
unnecessary. Retest when `solid-js`, `@solidjs/web`, or `@kobalte/core` move.

### Dialog-family portals come from `@solidjs/web`, not Kobalte

`dialog.tsx`, `sheet.tsx`, `alert-dialog.tsx`, and `drawer.tsx` alias their
`*Portal` to `Portal` from `@solidjs/web` instead of the Kobalte primitive's
`Portal`. Last confirmed necessary on `solid-js@2.0.0-rc.18` with
`@kobalte/core@2.0.0-alpha.4` (2026-10-26).

Why: Kobalte's `Dialog.Portal` is Solid's `Portal` inside a `Show` driven by the
dialog's presence signals, with the dismissable layer as the portal's direct
child. On `solid-js` 2.0.0-rc.1 and later that layer's `onSettled` registration
runs before its ref write is visible, so it never joins the layer stack and
Escape and outside clicks do nothing. Popover, menu, select, and tooltip are
unaffected because their positioner element sits between the portal and the
layer. Drawer reuses Dialog's portal, and the command palette is built on our
Dialog.

To retest after bumping either package, in each of the four files change
`const XPortal = Portal;` back to `const XPortal = XPrimitive.Portal;`, run the
docs dev server, open the dialog, sheet, alert dialog, and drawer previews, and
check three things: `document.body.style.pointerEvents` becomes `none` while
open, Escape closes it, and a click outside closes it. If all three hold on
every page, keep the Kobalte portals and delete this entry. If any fails, revert
to `Portal` from `@solidjs/web`. The drawer's closing animation takes several
seconds on the dev server, so give it that long before calling it stuck; the
broken state shows up earlier anyway, as `pointerEvents` staying empty.

### `resolve.dedupe` for the Solid packages

Kept as a guard in `apps/docs/vite.config.ts` so the bundle can never carry two
reactive runtimes. `@kobalte/core@2.0.0-alpha.4` and `@kobalte/utils@2.0.0-alpha.1`
pin their `solid-js` peer to exactly `2.0.0-rc.16`, older than the installed
`2.0.0-rc.18`; pnpm resolves both to the app's copy with a warning,
and `pnpm-workspace.yaml` pins `@solidjs/signals` to the same release candidate
because `solid-js` declares a caret range on it. Safe to drop once Kobalte's
peer ranges accept the installed Solid without a warning. Check with
`ls node_modules/.pnpm | grep -E '^(solid-js|@solidjs\+web|@solidjs\+signals)@'`:
one directory each.

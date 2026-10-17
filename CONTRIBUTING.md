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
  cli/                # @ptzburn/shadcn-solidjs: the component installer
    src/commands/     # init, add
    UPSTREAM.md       # file-by-file mapping to shadcn's own CLI
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
pnpm start   # serve the built site (port 3228)
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
generated registry under `apps/docs/public/r/` is what the CLI actually fetches,
and it is committed. After changing anything under `src/registry/`, regenerate
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

## Running the CLI locally

Run the CLI from source rather than the published package, and point it at a
local registry so `init` and `add` test your changes instead of what is live:

```sh
# terminal 1 — serve the registry
pnpm dev

# terminal 2 — run the CLI against it, from your test project
REGISTRY_URL=http://localhost:3228/r \
  node /path/to/shadcn-solidjs/packages/cli/src/index.ts init
```

`REGISTRY_URL` and `SHADCN_SOLIDJS_URL` are both overridable — see
`packages/cli/src/registry/constants.ts`.

The source runs on Node directly, so it is held to the syntax Node's type
stripping accepts (`erasableSyntaxOnly` and `verbatimModuleSyntax` in
`packages/cli/tsconfig.json`): no parameter properties or enums, and type-only
imports marked `type`.

## Publishing

The CLI is published to npm as `@ptzburn/shadcn-solidjs`, built by
[tsdown](https://tsdown.dev) into one ESM file with the shebang from
`src/index.ts`. `packages/cli/README.md` is the package page on npm.

### Releasing

Bump `version` in `packages/cli/package.json` and `VERSION` in
`packages/cli/src/version.ts` together — `version.test.ts` fails if they drift.
`publishConfig.tag` in `package.json` decides where the version lands: `beta`
for a pre-release, `latest` for a stable version, and the same test fails if the
tag disagrees with the version. When the line changes — beta to stable — also
update the `@beta` tag in `packages/cli/README.md` and the module doc of
`packages/cli/src/index.ts`.

**npm publishes from CI.** Pushing the bump to `main` or `solid2` runs
[`.github/workflows/ci.yml`](.github/workflows/ci.yml), which checks and tests
the workspace, builds the CLI and runs `npm publish`. It skips when the version
is already on npm, so pushes that don't bump are no-ops, and it authenticates
with npm trusted publishing — the job's OIDC token, no secret to rotate, and
npm attaches a provenance attestation to the version. Pull requests that touch
the CLI get the same checks plus an `npm publish --dry-run`.

Publishing by hand still works:

```sh
pnpm --filter ./packages/cli build
cd packages/cli && npm publish
```

It needs the account's one-time password and carries no provenance.

## Porting from upstream

This project tracks [shadcn/ui](https://ui.shadcn.com). When porting a component
or a CLI change, keep the divergence deliberate and record it — for CLI files,
that means a row in [`packages/cli/UPSTREAM.md`](packages/cli/UPSTREAM.md)
explaining what differs and why.

The registry stays wire-compatible with shadcn's: the `registry:*` item types,
the `components.json` field names, and `@namespace/item` addressing. Changes
that break that compatibility need a good reason.

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
`Portal`. Last confirmed necessary on `solid-js@2.0.0-rc.13` with
`@kobalte/core@2.0.0-alpha.2` (2026-10-01).

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
to `Portal` from `@solidjs/web`.

### Server-side rendering stays off in the docs

`ssr: false` in `apps/docs/vite.config.ts`. Last confirmed necessary on
`solid-js@2.0.0-rc.13` (2026-10-01). A component that reads a memo inside a
forwarded JSX prop and resolves its tag through `Dynamic`, which is the shape of
every Kobalte polymorphic primitive, gets hydration ids two slots ahead of what
the client computes, so its children are never claimed. Retest by setting
`ssr: true` together with `ssr.noExternal: true` and loading the button and tabs
pages with the console open: any "Hydration key miss" warning or "Hydration
Mismatch" error means it is still needed.

### `resolve.dedupe` for the Solid packages

Kept as a guard in `apps/docs/vite.config.ts` so the bundle can never carry two
reactive runtimes. `@kobalte/core@2.0.0-alpha.2` pins its `solid-js` peer to
exactly `2.0.0-rc.3`; a fresh `deno install` resolves that to the app's copy
with a warning, but a lockfile written against an earlier release candidate can
keep a second copy alive. Safe to drop once Kobalte's peer range accepts the
installed Solid.

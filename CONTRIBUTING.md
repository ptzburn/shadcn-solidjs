# Contributing

Thanks for your interest in contributing. This document covers how the repo is
laid out and how to run things locally.

## Prerequisites

[Deno](https://deno.com) 2.x. There is no Node.js or package-manager step — the
workspace is Deno-native and dependencies resolve from `deno.json` files.

## Layout

A [Deno workspace](https://docs.deno.com/runtime/fundamentals/workspaces/):

```
deno.json            # workspace root: members, tasks, fmt config
apps/
  docs/              # the docs site (SolidStart app)
    deno.json        # member deps + "~/" -> "./src/" alias (mirrors tsconfig paths)
    src/lib/         # cn(), clamp(), toggleValue(), use-id hook
    src/registry/    # the components themselves, plus styles/themes/icons
    src/scripts/     # registry + icon + token build scripts
    public/r/        # the generated registry served at /r
packages/
  cli/               # shadcn-solidjs: the component installer
    deno.json        # member deps + JSR package name/version/exports
    src/commands/    # init, add
    UPSTREAM.md      # file-by-file mapping to shadcn's own CLI
```

Dependencies are added per member as code arrives, at their latest versions.
Code style follows `deno fmt` defaults.

## Commands

From the repo root:

```sh
deno task dev     # run the docs site (port 3228)
deno task build   # build the registry, then the docs site
deno task start   # serve the built site (honours PORT, defaults to 3000)
deno task test    # run all tests across the workspace
deno task lint    # lint all members
deno task fmt     # format all members
deno task check   # type-check everything
```

Commit `deno.lock` when it changes.

## Git hooks

[lefthook](https://lefthook.dev) runs `deno lint --fix`, `deno fmt` and
`deno task check` before every commit. `deno install` sets the hooks up — the
`allowScripts` entry in `deno.json` is what lets lefthook's postinstall write
them — so there is no separate install step.

Jobs are skipped when nothing is staged, and a failing type check aborts the
commit. To bypass the hook for one commit:

```sh
LEFTHOOK=0 git commit -m "..."
```

## The registry

`apps/docs/src/registry/` holds the source of truth for every component. The
generated registry under `apps/docs/public/r/` is what the CLI actually fetches,
and it is committed. After changing anything under `src/registry/`, regenerate
it:

```sh
deno task --cwd=apps/docs build:registry
```

That fans every item out across 8 styles and 5 icon libraries, rebuilds the icon
modules and docs tokens, and formats the output. Commit the result alongside
your change.

## Running the CLI locally

Run the CLI from source rather than the published package, and point it at a
local registry so `init` and `add` test your changes instead of what is live:

```sh
# terminal 1 — serve the registry
deno task dev

# terminal 2 — run the CLI against it, from your test project
REGISTRY_URL=http://localhost:3228/r \
  deno run -A /path/to/shadcn-solidjs/packages/cli/src/index.ts init
```

`REGISTRY_URL` and `SHADCN_SOLIDJS_URL` are both overridable — see
`packages/cli/src/registry/constants.ts`.

## Dual publishing

The CLI is written against `node:` builtins rather than `Deno.*` globals, so a
single source tree runs under both runtimes: published to JSR for
`deno run -A jsr:@ptzburn/shadcn-solidjs`, and to npm via
[dnt](https://github.com/denoland/dnt) for `npx @ptzburn/shadcn-solidjs@latest`.
`deno pack` cannot build it — it does not emit a `package.json` `bin` field.

Keep new CLI code on `node:` builtins so both targets keep working.

### Releasing

Bump `version` in `packages/cli/deno.json` and `VERSION` in
`packages/cli/src/version.ts` together — `version_test.ts` fails if they drift,
and the npm build reads `VERSION`.

Every command below runs from `packages/cli`:

```sh
cd packages/cli

# JSR
deno publish --dry-run
deno publish

# npm
deno task build:npm
(cd npm && npm publish)
```

The npm publish runs in a subshell so the block leaves you in `packages/cli` and
can be run again. `packages/cli/npm` has its own generated `package.json`, and
`deno task` picks that up if you are standing in it — "No tasks found in
configuration file" means you are one directory too deep.

The `build:npm` task is defined on the `packages/cli` member, so running it from
the repo root needs `deno task --cwd=packages/cli build:npm` instead.

`build:npm` writes to `packages/cli/npm/`, which is gitignored and excluded from
`deno fmt`/`lint`/`check` in the root `deno.json`. Don't commit it.

Two things the build depends on and would break quietly:

- **No shebang in `src/index.ts`.** dnt writes one into the npm bin; a second
  copy in the source lands underneath it and parses as code.
- **`compilerOptions.target` is pinned to ES2022 in the build script.** dnt's
  default is older than `new Error(msg, { cause })` and `array.at(-1)`, both of
  which this code uses.

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
deno task test
```

# deno-monorepo

A Deno-native rebuild of [solid-ui](https://github.com/stefan-karger/solid-ui)
(aceternity-solid), using
[Deno workspaces](https://docs.deno.com/runtime/fundamentals/workspaces/). The
structure maps 1:1 to the original pnpm/turbo monorepo:

```
deno.json            # workspace root: members, tasks, fmt config
apps/
  docs/              # the docs site (SolidStart app in the original)
    deno.json        # member deps + "~/" -> "./src/" alias (mirrors tsconfig paths)
    src/lib/         # cn(), clamp(), toggleValue(), use-id hook
packages/
  cli/               # shadcn-solidjs: the component installer
    deno.json        # member deps + JSR package name/version/exports
    src/commands/    # init, add
```

The CLI is written against `node:` builtins rather than `Deno.*` globals, so a
single source tree runs under both runtimes: published to JSR for
`deno run -A jsr:@ptzburn/shadcn-solidjs`, and to npm via
[dnt](https://github.com/denoland/dnt) for `npx shadcn-solidjs@latest`.
`deno pack` cannot build it — it does not emit a `package.json` `bin` field.

Porting happens gradually, file-for-file. Dependencies are added per member as
code arrives, at their latest versions. Code style follows `deno fmt` defaults.

## Commands (from the repo root)

```sh
deno task test    # run all tests across the workspace
deno task lint    # lint all members
deno task fmt     # format all members
deno task check   # type-check everything
```

Commit `deno.lock` when it changes.

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
  cli/               # shadcn-solidjs (not yet ported)
```

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

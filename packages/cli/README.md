# shadcn-solidjs

A CLI for adding [SolidJS](https://www.solidjs.com) components to your project.
It installs components from [shadcn-solidjs](https://v2.shadcn-solidjs.com), the
SolidJS port of [shadcn/ui](https://ui.shadcn.com) built on
[Kobalte](https://kobalte.dev) and Tailwind CSS — code you copy into your
project and own outright.

> **Note:** this is the **Solid 2.0** line, published under the `beta` tag while
> Solid 2.0 and Kobalte 2.0 are pre-release. The Solid 1.x line stays on
> `latest`.

## init

Use the `init` command to set up a project.

The `init` command writes `components.json`, seeds your stylesheet with the base
color's tokens, and adds the `cn` util.

```bash
npx @ptzburn/shadcn-solidjs@beta init
```

## add

Use the `add` command to add components to your project.

The `add` command adds a component to your project and installs all required
dependencies.

```bash
npx @ptzburn/shadcn-solidjs@beta add [component]
```

### Example

```bash
npx @ptzburn/shadcn-solidjs@beta add button card dialog
```

Pass `--all` to add every component:

```bash
npx @ptzburn/shadcn-solidjs@beta add --all
```

## Deno

The same CLI is published to [JSR](https://jsr.io/@ptzburn/shadcn-solidjs). JSR
has no dist-tags, so `^0.2.0-beta.0` is what follows the beta line there — it
resolves to the newest beta today and to `0.2.x` once it is stable:

```bash
deno x -A jsr:@ptzburn/shadcn-solidjs@^0.2.0-beta.0 init
```

## Documentation

Visit [v2.shadcn-solidjs.com/docs/cli](https://v2.shadcn-solidjs.com/docs/cli)
to view the documentation.

## License

Licensed under the
[MIT license](https://github.com/ptzburn/shadcn-solidjs/blob/main/LICENSE).

> **Note:** this is a community project. It is not affiliated with, nor endorsed
> by, shadcn or Vercel.

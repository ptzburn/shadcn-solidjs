# shadcn-solidjs

**An unofficial, community-led [SolidJS](https://www.solidjs.com) port of
[shadcn/ui](https://ui.shadcn.com).**

Accessible, customizable components that you copy into your project and own
outright. Free. Open Source. **Use this to build your own component library.**

> [!NOTE]
> The npm package is scoped — `@ptzburn/shadcn-solidjs`, not `shadcn-solidjs`.
> The unscoped name is taken. Once installed, the command is `shadcn-solidjs`.

## Why

shadcn/ui isn't a component library you install and import from — it's a
collection of components you copy into your codebase and own. No wrapper to
fight, no theme API to learn: when a button needs to behave differently, you
edit the button.

shadcn-solidjs brings that model to SolidJS. Same components, same design
tokens, rebuilt on Solid's reactivity and on headless primitives from
[Kobalte](https://kobalte.dev), [corvu](https://corvu.dev), and
[Ark UI](https://ark-ui.com).

## Documentation

Visit [shadcn-solidjs.com/docs](https://shadcn-solidjs.com/docs) to view the
documentation.

## Quick start

Initialize a project — this writes `components.json`, sets up your stylesheet
and base color, and adds the `cn` helper:

```bash
npx @ptzburn/shadcn-solidjs@latest init
```

Then add components:

```bash
npx @ptzburn/shadcn-solidjs@latest add button card dialog
```

Running on Deno? Skip the npm build and use the JSR package directly:

```bash
deno run -A jsr:@ptzburn/shadcn-solidjs init
```

Installation guides are available for **SolidStart**, **Vite** and **Astro**,
plus a manual setup path.

## What's inside

- **59 components**, Accordion through Tooltip.
- **8 styles** — Nova, Vega, Maia, Lyra, Mira, Luma, Sera and Rhea. These mirror
  upstream's, so a component looks here the way it looks on ui.shadcn.com.
- **5 icon libraries** — [Lucide](https://lucide.dev),
  [Tabler](https://tabler.io/icons), [Phosphor](https://phosphoricons.com),
  [Remix Icon](https://remixicon.com) and [Hugeicons](https://hugeicons.com).
  You pick one at `init` and it's baked into the code you receive.
- **24 themes**, installable like any other registry item.
- **Dark mode** guides for SolidStart, Vite and Astro.

Every item is addressable under both a style and an icon-library prefix, so
adding a component never pulls in an icon set you didn't choose.

## Registry compatibility

The CLI is a port of shadcn's own, and stays deliberately wire-compatible with
it: the `registry:*` item types, the `components.json` field names, and
`@namespace/item` addressing all match. Any registry that speaks that format is
addressable — including your own, and including private ones:

```jsonc
// components.json
{
  "registries": {
    "@acme": "https://acme.com/r/{name}.json"
  }
}
```

Two deliberate differences: `{iconLibrary}` replaces upstream's `{style}` URL
placeholder, and the `github:owner/repo/item` scheme is not implemented. See
[`packages/cli/UPSTREAM.md`](packages/cli/UPSTREAM.md) for the full file-by-file
mapping and the reasoning behind each divergence.

## Built with

[Solid](https://www.solidjs.com) · [Tailwind CSS v4](https://tailwindcss.com) ·
[Kobalte](https://kobalte.dev) · [corvu](https://corvu.dev) ·
[Ark UI](https://ark-ui.com) · [TanStack Table](https://tanstack.com/table) ·
[Embla Carousel](https://www.embla-carousel.com) ·
[Modular Forms](https://modularforms.dev) · [Chart.js](https://www.chartjs.org)

## Contributing

This is a Deno-native monorepo. See [CONTRIBUTING.md](CONTRIBUTING.md) for the
workspace layout, the task commands, and how to run the docs site and CLI
locally.

## Credits

- [shadcn](https://github.com/shadcn) for [shadcn/ui](https://ui.shadcn.com),
  the design system and the registry model this port follows.
- [huntabyte/shadcn-svelte](https://github.com/huntabyte/shadcn-svelte) and
  [unovue/shadcn-vue](https://github.com/unovue/shadcn-vue) for showing what a
  good port of it looks like.
- [Kobalte](https://kobalte.dev) and [corvu](https://corvu.dev) for the
  accessible Solid primitives that most of these components are built on.

## License

Licensed under the [MIT license](LICENSE).

> [!NOTE]
> This is a community project. It is not affiliated with, nor endorsed by,
> shadcn or Vercel.

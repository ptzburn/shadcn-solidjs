# shadcn-solidjs

**An unofficial, community-led [SolidJS](https://www.solidjs.com) port of
[shadcn/ui](https://ui.shadcn.com).**

Accessible, customizable components that you copy into your project and own
outright. Free. Open Source. **Use this to build your own component library.**

## Why

shadcn/ui isn't a component library you install and import from — it's a
collection of components you copy into your codebase and own. No wrapper to
fight, no theme API to learn: when a button needs to behave differently, you
edit the button.

shadcn-solidjs brings that model to SolidJS. Same components, same design
tokens, rebuilt on Solid's reactivity and on headless primitives from
[Kobalte](https://kobalte.dev).

> [!NOTE]
> This is the **Solid 2.0** line, published under the `beta` tag while Solid 2.0
> and Kobalte 2.0 are pre-release. The Solid 1.x line stays on `latest` at
> [shadcn-solidjs.com](https://shadcn-solidjs.com).

## Documentation

Visit [v2.shadcn-solidjs.com/docs](https://v2.shadcn-solidjs.com/docs) to view
the documentation.

## Quick start

Initialize a project — this writes `components.json`, sets up your stylesheet
and base color, and adds the `cn` helper:

```bash
npx @ptzburn/shadcn-solidjs@beta init
```

Then add components:

```bash
npx @ptzburn/shadcn-solidjs@beta add button card dialog
```

Running on Deno? `dx` is Deno's `npx`:

```bash
dx -A npm:@ptzburn/shadcn-solidjs@beta init
```

The installation guide walks through a project created from the official Solid
2.0 templates.

## What's inside

- **57 components**, Accordion through Tooltip.
- **8 styles** — Nova, Vega, Maia, Lyra, Mira, Luma, Sera and Rhea. These mirror
  shadcn/ui's, so a component looks here the way it looks on ui.shadcn.com.
- **5 icon libraries** — [Lucide](https://lucide.dev),
  [Tabler](https://tabler.io/icons), [Phosphor](https://phosphoricons.com),
  [Remix Icon](https://remixicon.com) and [Hugeicons](https://hugeicons.com).
  You pick one at `init` and it's baked into the code you receive.
- **24 themes**, installable like any other registry item.
- **Dark mode** guide, with a `color-mode` helper that mirrors Kobalte's.

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

[Solid 2.0](https://www.solidjs.com) ·
[Tailwind CSS v4](https://tailwindcss.com) · [Kobalte](https://kobalte.dev) ·
[Embla Carousel](https://www.embla-carousel.com)

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
- [Kobalte](https://kobalte.dev) for the accessible Solid primitives these
  components are built on.

## License

Licensed under the [MIT license](LICENSE).

> [!NOTE]
> This is a community project. It is not affiliated with, nor endorsed by,
> shadcn or Vercel.

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
> Built for **Solid 2.0** and published under the `beta` tag while Solid 2.0
> and Kobalte 2.0 are pre-release.

## Documentation

Visit [shadcn-solidjs.com/docs](https://shadcn-solidjs.com/docs) to view the
documentation.

## Quick start

Components install with the [shadcn CLI](https://ui.shadcn.com/docs/cli).
Initialize a project — this writes `components.json`, sets up your stylesheet
and base color, and adds the `cn` helper:

```bash
npx shadcn@latest init https://shadcn-solidjs.com/r/init/neutral.json
```

Add the registry to `components.json`; the URL picks the style and icon
library:

```jsonc
{
  "registries": {
    "@shadcn-solidjs": "https://shadcn-solidjs.com/r/styles/nova/icons/lucide/{name}.json",
  },
}
```

Then add components:

```bash
npx shadcn@latest add @shadcn-solidjs/button @shadcn-solidjs/card @shadcn-solidjs/dialog
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
  The registry URL picks one, and it's baked into the code you receive.
- **24 themes**, installable like any other registry item.
- **Dark mode** guide, with a `color-mode` helper that mirrors Kobalte's.

Every item is addressable under both a style and an icon-library prefix, so
adding a component never pulls in an icon set you didn't choose.

## Registry

Every item is a standard [shadcn registry](https://ui.shadcn.com/docs/registry)
item, installed by the shadcn CLI. Items name the components they depend on by
URL within the same style and icon library, so one `registries` entry decides
both for everything you add, and `@kobalte/core` is pinned to the version the
components are tested against.

## Built with

[Solid 2.0](https://www.solidjs.com) ·
[Tailwind CSS v4](https://tailwindcss.com) · [Kobalte](https://kobalte.dev) ·
[Embla Carousel](https://www.embla-carousel.com)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for the workspace layout, the commands,
and how to test the registry locally.

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

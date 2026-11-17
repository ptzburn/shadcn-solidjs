// Solid 2 replacement for the solid-mdx runtime (solid-mdx is compiled
// against Solid 1: mergeProps, solid-js/web, Context.Provider). Same three
// exports, so vite.config.ts can point providerImportSource here.
//
// Like solid-mdx, the default context maps every HTML/SVG tag to a Dynamic
// wrapper: compiled MDX spreads `useMDXComponents()` into its `_components`
// map, so the tags must exist as real own properties (a lazy Proxy getter
// would not survive the spread).
import { Dynamic, type JSX } from "@solidjs/web";
import { mdxTags } from "~/lib/mdx/tags.ts";

import { type Component, createContext, untrack, useContext } from "solid-js";

type MDXComponents = Record<string, Component<any>>;

const defaultComponents: MDXComponents = Object.fromEntries(
  mdxTags.map((tag) => [
    tag,
    (props: Record<string, unknown>) => <Dynamic component={tag} {...props} />,
  ]),
);

const MDXContext = createContext<MDXComponents>(defaultComponents);

// The map is read once. Compiled MDX copies it into a plain object at the top
// of every page anyway, so a lazy merge() here would only turn that copy into
// one untracked reactive read per tag.
function MDXProvider(props: { components?: MDXComponents; children?: JSX.Element }) {
  const parent = useContext(MDXContext);
  const value = { ...parent, ...untrack(() => props.components) };
  return <MDXContext value={value}>{props.children}</MDXContext>;
}

function useMDXComponents(): MDXComponents {
  return useContext(MDXContext);
}

export { MDXContext, MDXProvider, useMDXComponents };

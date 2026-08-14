import { MDXComponents } from "~/components/mdx-components.tsx";
import { MDXProvider } from "~/lib/mdx/provider.tsx";

import "~/styles/mdx.css";

import type { ParentProps } from "solid-js";

export default function DocsLayout(props: ParentProps) {
  return (
    <MDXProvider components={MDXComponents}>
      <article class="typeset w-full flex-1 pb-16 sm:pb-0">
        {props.children}
      </article>
    </MDXProvider>
  );
}

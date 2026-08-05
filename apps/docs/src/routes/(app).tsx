import { type ParentProps, Suspense } from "solid-js";

import { MDXProvider } from "solid-mdx";

import { MDXComponents } from "~/components/mdx-components.tsx";
import { SiteFooter } from "~/components/site-footer.tsx";
import { SiteHeader } from "~/components/site-header.tsx";

export default function AppLayout(props: ParentProps) {
  return (
    <MDXProvider components={MDXComponents}>
      <div
        data-slot="layout"
        class="group/layout group/body relative z-10 flex min-h-svh flex-col overscroll-none bg-background"
      >
        <SiteHeader />
        <main class="flex min-h-0 flex-1 flex-col">
          <Suspense>{props.children}</Suspense>
        </main>
        <SiteFooter />
      </div>
    </MDXProvider>
  );
}

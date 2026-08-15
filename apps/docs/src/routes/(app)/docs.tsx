import { DocsSidebar } from "~/components/docs-sidebar.tsx";
import { MDXComponents } from "~/components/mdx-components.tsx";
import { MDXProvider } from "~/lib/mdx/provider.tsx";
import { SidebarProvider } from "~/registry/ui/sidebar.tsx";

import "~/styles/mdx.css";

import type { ParentProps } from "solid-js";

// Reduced from main: DocsPager and the TableOfContents column return with
// the remaining chrome.
export default function DocsLayout(props: ParentProps) {
  return (
    <div class="container-wrapper flex flex-1 flex-col px-2">
      <SidebarProvider
        class="[--top-spacing:0] lg:[--top-spacing:calc(var(--spacing)*4)] min-h-min flex-1 items-start px-0 lg:grid lg:grid-cols-[var(--sidebar-width)_minmax(0,1fr)]"
        style={{ "--sidebar-width": "calc(var(--spacing) * 72)" }}
      >
        <DocsSidebar />
        <div class="h-full w-full">
          <div
            data-slot="docs"
            class="flex scroll-mt-24 items-stretch pb-8 text-[1.05rem] sm:text-[15px] xl:w-full"
          >
            <div class="flex min-w-0 flex-1 flex-col">
              <div class="h-(--top-spacing) shrink-0" />
              <div class="mx-auto flex w-full min-w-0 max-w-160 flex-1 flex-col gap-6 px-4 py-6 text-foreground md:px-0 lg:py-8 dark:text-foreground">
                <MDXProvider components={MDXComponents}>
                  <article class="typeset w-full flex-1 pb-16 *:data-[slot=alert]:first:mt-0 sm:pb-0">
                    {props.children}
                  </article>
                </MDXProvider>
              </div>
            </div>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
}

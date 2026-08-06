import type { RouteProps } from "@solidjs/router";
import { MDXProvider } from "solid-mdx";

import { DocsPager } from "~/components/docs-pager.tsx";
import { DocsSidebar } from "~/components/docs-sidebar.tsx";
import { MDXComponents } from "~/components/mdx-components.tsx";
import { TableOfContents } from "~/components/toc.tsx";
import { SidebarProvider } from "~/registry/ui/sidebar.tsx";

import "~/styles/mdx.css";

export default function DocsLayout(props: RouteProps<string>) {
  return (
    <div class="container-wrapper flex flex-1 flex-col px-2">
      <SidebarProvider
        class="min-h-min flex-1 items-start px-0 [--top-spacing:0] lg:grid lg:grid-cols-[var(--sidebar-width)_minmax(0,1fr)] lg:[--top-spacing:calc(var(--spacing)*4)]"
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
                  <article class="w-full flex-1 pb-16 sm:pb-0">
                    {props.children}
                  </article>
                </MDXProvider>
                <DocsPager />
              </div>
            </div>
            <div class="sticky top-[calc(var(--header-height)+1px)] z-30 ml-auto hidden h-[90svh] w-(--sidebar-width) flex-col gap-4 overflow-hidden overscroll-none pb-8 xl:flex">
              <div class="h-(--top-spacing) shrink-0" />
              <div class="scroll-fade no-scrollbar flex flex-col gap-8 overflow-y-auto px-8">
                <TableOfContents />
              </div>
            </div>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
}

import { type ParentProps, Suspense } from "solid-js";

import { MDXProvider } from "solid-mdx";

import Footer from "~/components/footer.tsx";
import { MDXComponents } from "~/components/mdx-components.tsx";
import Navbar from "~/components/navbar.tsx";

export default function DocsLayout(props: ParentProps) {
  return (
    <MDXProvider components={MDXComponents}>
      <div data-wrapper="" class="border-border/40 dark:border-border">
        <div class="mx-auto w-full border-border/40 min-[1800px]:max-w-screen-2xl min-[1800px]:border-x dark:border-border">
          <Navbar />
          <div class="flex-1">
            <Suspense>{props.children}</Suspense>
          </div>
          <Footer />
        </div>
      </div>
    </MDXProvider>
  );
}

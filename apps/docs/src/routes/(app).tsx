import { SiteFooter } from "~/components/site-footer.tsx";
import { SiteHeader } from "~/components/site-header.tsx";

import type { ParentProps } from "solid-js";

export default function AppLayout(props: ParentProps) {
  return (
    <>
      <div
        data-slot="layout"
        class="group/body group/layout relative z-10 flex min-h-svh flex-col overscroll-none bg-background"
      >
        <SiteHeader />
        <main class="flex min-h-0 flex-1 flex-col">{props.children}</main>
        <SiteFooter />
      </div>
    </>
  );
}

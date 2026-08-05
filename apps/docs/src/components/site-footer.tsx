import type { JSX } from "solid-js";

function FooterLink(props: { href: string; children: JSX.Element }) {
  return (
    <a
      href={props.href}
      target="_blank"
      rel="noreferrer"
      class="font-medium underline underline-offset-4"
    >
      {props.children}
    </a>
  );
}

export function SiteFooter() {
  return (
    <footer class="group-has-[.docs-nav]/body:pb-20 group-has-[[data-slot=docs]]/body:hidden dark:bg-transparent group-has-[.docs-nav]/body:sm:pb-0">
      <div class="container-wrapper px-4 xl:px-6">
        <div class="flex h-(--footer-height) items-center justify-between">
          <div class="w-full px-1 text-center text-xs leading-loose text-muted-foreground sm:text-sm">
            Built by{" "}
            <FooterLink href="https://twitter.com/shadcn">shadcn</FooterLink> at
            {" "}
            <FooterLink href="https://vercel.com">Vercel</FooterLink>. The
            source code is available on{" "}
            <FooterLink href="https://github.com/stefan-karger/solid-ui">
              GitHub
            </FooterLink>.
          </div>
        </div>
      </div>
    </footer>
  );
}

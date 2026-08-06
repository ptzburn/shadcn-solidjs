import { A } from "@solidjs/router";

import { ExamplesNav } from "~/components/examples-nav.tsx";
import { IconBrandGithub } from "~/components/icons.tsx";
import { Mail } from "~/components/mail/index.tsx";
import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "~/components/page-header.tsx";
import { PageNav } from "~/components/page-nav.tsx";
import { Button } from "~/registry/ui/button.tsx";

export default function Home() {
  return (
    <>
      <PageHeader>
        <PageHeaderHeading>Build your component library.</PageHeaderHeading>
        <PageHeaderDescription>
          Beautifully designed components that you can copy and paste into your
          apps.
        </PageHeaderDescription>
        <p class="text-sm text-[#4d83c4] dark:text-[#93c4e9]">
          This is an unofficial port of{" "}
          <A
            href="https://github.com/shadcn-ui/ui"
            target="_blank"
            rel="noreferrer"
            class="font-medium underline underline-offset-4"
          >
            shadcn/ui
          </A>{" "}
          and{" "}
          <A
            href="https://github.com/tremorlabs/tremor-raw"
            target="_blank"
            rel="noreferrer"
            class="font-medium underline underline-offset-4"
          >
            tremor-raw
          </A>{" "}
          to Solid.
        </p>
        <PageActions>
          <Button as={A} size="sm" href="/docs/introduction">
            Get Started
          </Button>
          <Button
            as={A}
            variant="ghost"
            size="sm"
            href="https://github.com/stefan-karger/solid-ui"
            target="_blank"
            rel="noreferrer"
          >
            <IconBrandGithub /> GitHub
          </Button>
        </PageActions>
      </PageHeader>
      <PageNav class="hidden md:flex">
        <ExamplesNav class="flex-1 overflow-hidden [&>a:first-child]:text-primary" />
      </PageNav>
      <div class="container-wrapper section-soft flex flex-1 flex-col pb-6">
        <div class="container theme-container hidden flex-1 scroll-mt-20 flex-col md:flex">
          <div class="flex flex-col overflow-hidden rounded-lg border bg-background bg-clip-padding md:flex-1 xl:rounded-xl [&>div]:p-0">
            <Mail />
          </div>
        </div>
      </div>
    </>
  );
}

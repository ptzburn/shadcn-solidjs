import { A, type RouteProps } from "@solidjs/router";

import { ExamplesNav } from "~/components/examples-nav.tsx";
import { MetaTags } from "~/components/meta-tags.tsx";
import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "~/components/page-header.tsx";
import { PageNav } from "~/components/page-nav.tsx";
import { Button } from "~/registry/ui/button.tsx";

const title = "The Foundation for your Design System";
const description =
  "A set of beautifully designed components that you can customize, extend, and build on. Start here then make it your own. Open Source. Open Code.";

export default function ExamplesLayout(props: RouteProps<string>) {
  return (
    <>
      <MetaTags title={title} description={description} />
      <PageHeader>
        <PageHeaderHeading class="max-w-4xl">{title}</PageHeaderHeading>
        <PageHeaderDescription>{description}</PageHeaderDescription>
        <PageActions>
          <Button as={A} size="sm" href="/docs/installation">
            Get Started
          </Button>
          <Button
            as={A}
            size="sm"
            variant="ghost"
            href="/docs/components/accordion"
          >
            View Components
          </Button>
        </PageActions>
      </PageHeader>
      <PageNav id="examples" class="hidden md:flex">
        <ExamplesNav class="flex-1 overflow-hidden [&>a:first-child]:text-primary" />
      </PageNav>
      <div class="container-wrapper section-soft flex flex-1 flex-col pb-6">
        <div class="container theme-container flex flex-1 scroll-mt-20 flex-col">
          <div class="flex flex-col overflow-hidden rounded-lg border bg-background bg-clip-padding md:flex-1 xl:rounded-xl">
            {props.children}
          </div>
        </div>
      </div>
    </>
  );
}

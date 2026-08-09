import { A } from "@solidjs/router";

import { CardsDemo } from "~/components/cards/index.tsx";
import { MetaTags } from "~/components/meta-tags.tsx";
import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "~/components/page-header.tsx";
import { Button } from "~/registry/ui/button.tsx";

const title = "The Foundation for your Design System";
const description =
  "A set of beautifully designed components that you can customize, extend, and build on. Start here then make it your own. Open Source. Open Code.";

export default function Home() {
  return (
    <div class="flex flex-1 flex-col">
      <MetaTags title={title} description={description} />
      <PageHeader class="md:**:[.container]:pb-8 lg:**:[.container]:pb-12">
        <PageHeaderHeading class="max-w-4xl">{title}</PageHeaderHeading>
        <PageHeaderDescription>{description}</PageHeaderDescription>
        <PageActions>
          <Button as={A} size="sm" href="/docs/introduction">
            Get Started
          </Button>
        </PageActions>
      </PageHeader>
      <div class="container-wrapper flex-1 p-0">
        <div class="container overflow-hidden px-0 lg:max-w-none">
          <CardsDemo />
        </div>
      </div>
    </div>
  );
}

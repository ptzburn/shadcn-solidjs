import { For } from "solid-js";
import { A } from "@solidjs/router";

import { Index } from "~/__registry__/index.tsx";
import { BlockDisplay } from "~/components/block-display.tsx";
import { MetaTags } from "~/components/meta-tags.tsx";
import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "~/components/page-header.tsx";
import { Button } from "~/registry/ui/button.tsx";

const title = "Building Blocks for the Web";
const description =
  "Clean, modern building blocks. Copy and paste into your apps. Works with all Solid frameworks. Open Source. Free forever.";

function getAllBlocks() {
  return Object.values(Index)
    .filter((block) => block.type === "block" && !block.name.startsWith("demo"))
    .map((block) => block.name);
}

export default function Blocks() {
  return (
    <>
      <MetaTags title={title} description={description} />
      <PageHeader>
        <PageHeaderHeading>{title}</PageHeaderHeading>
        <PageHeaderDescription>{description}</PageHeaderDescription>
        <PageActions>
          <Button as="a" size="sm" href="#blocks">
            Browse Blocks
          </Button>
          <Button
            as={A}
            variant="ghost"
            size="sm"
            href="/docs/components/accordion"
          >
            View Components
          </Button>
        </PageActions>
      </PageHeader>
      <div class="container-wrapper section-soft flex-1 md:py-12">
        <div class="container">
          <section id="blocks" class="grid scroll-mt-24 gap-24 lg:gap-48">
            <For each={getAllBlocks()}>
              {(name) => <BlockDisplay name={name} />}
            </For>
          </section>
        </div>
      </div>
    </>
  );
}

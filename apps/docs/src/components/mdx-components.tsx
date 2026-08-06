import { type ComponentProps } from "solid-js";

import { ComponentPreview } from "~/components/component-preview.tsx";
import { ComponentSource } from "~/components/component-source.tsx";
import { CodeBlockCommand } from "~/components/code-block-command.tsx";
import { CopyButton } from "~/components/copy-button.tsx";
import { MDXHeader } from "~/components/mdx-header.tsx";
import { cn } from "~/lib/utils.ts";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/registry/ui/accordion.tsx";
import { Alert, AlertDescription, AlertTitle } from "~/registry/ui/alert.tsx";
import { Callout } from "~/registry/ui/callout.tsx";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/registry/ui/tabs.tsx";

export const MDXComponents = {
  h1: (props: ComponentProps<"h1">) => {
    return <h1 data-toc="" {...props} />;
  },
  h2: (props: ComponentProps<"h2">) => {
    return <h2 data-toc="" {...props} />;
  },
  h3: (props: ComponentProps<"h3">) => {
    return <h3 data-toc="" {...props} />;
  },
  h4: (props: ComponentProps<"h4">) => {
    return <h4 data-toc="" {...props} />;
  },
  h5: (props: ComponentProps<"h5">) => {
    return <h5 data-toc="" {...props} />;
  },
  h6: (props: ComponentProps<"h6">) => {
    return <h6 data-toc="" {...props} />;
  },
  a: (props: ComponentProps<"a">) => {
    return (
      <a
        target={props.href?.includes("http") ? "_blank" : "_self"}
        {...props}
      />
    );
  },
  pre: (props: ComponentProps<"pre">) => {
    let preRef: HTMLPreElement | undefined;
    return (
      <div class="group relative">
        <pre
          ref={preRef}
          class={cn(
            "code group no-scrollbar max-h-[650px] min-w-0 overflow-x-auto bg-transparent py-4 outline-none",
          )}
        >
          {props.children}
        </pre>
        <CopyButton
          class="absolute right-4 top-4"
          content={preRef?.querySelector("code")?.innerText ?? ""}
        />
      </div>
    );
  },
  Step: (props: ComponentProps<"h3">) => (
    <h3
      class="font-heading mt-8 scroll-m-20 text-xl font-semibold tracking-tight"
      {...props}
    />
  ),
  Steps: (props: ComponentProps<"div">) => (
    <div
      class="[&>h3]:step steps mb-12 ml-4 border-l pl-8 [counter-reset:step]"
      {...props}
    />
  ),
  Tabs: (props: ComponentProps<typeof Tabs>) => (
    <Tabs class="relative mt-6 w-full" {...props} />
  ),
  TabsList: (props: ComponentProps<typeof TabsList>) => (
    <TabsList
      class="w-full justify-start rounded-none border-b bg-transparent p-0"
      {...props}
    />
  ),
  TabsTrigger: (props: ComponentProps<typeof TabsTrigger>) => (
    <TabsTrigger
      class="relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[selected]:border-b-primary data-[selected]:text-foreground data-[selected]:shadow-none"
      {...props}
    />
  ),
  TabsContent: (props: ComponentProps<typeof TabsContent>) => (
    <TabsContent
      class="relative [&_h3.font-heading]:text-base [&_h3.font-heading]:font-semibold"
      {...props}
    />
  ),
  LinkedCard: (props: ComponentProps<"a">) => (
    <a
      class="flex w-full flex-col items-center rounded-xl border bg-card p-6 text-card-foreground shadow transition-colors hover:bg-muted/50 sm:p-10"
      {...props}
    />
  ),
  MDXHeader,
  CodeBlockCommand,
  ComponentPreview,
  ComponentSource,
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Alert,
  AlertTitle,
  AlertDescription,
  Callout,
};

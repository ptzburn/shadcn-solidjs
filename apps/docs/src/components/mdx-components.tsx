import { type ComponentProps } from "solid-js";

import { ComponentPreview } from "~/components/component-preview.tsx";
import { ComponentSource } from "~/components/component-source.tsx";
import { getIconForLanguageExtension } from "~/components/icons.tsx";
import { CodeBlockCommand } from "~/components/code-block-command.tsx";
import { CodeTabs } from "~/components/code-tabs.tsx";
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
    // The copy button anchors to the figure (position: relative in
    // mdx.css), so a title bar pulls it up into the bar like upstream.
    return (
      <div class="group">
        <pre
          ref={preRef}
          data-not-typeset=""
          class={cn(
            "code group no-scrollbar max-h-[650px] min-w-0 overflow-x-auto bg-transparent py-4 outline-none",
          )}
        >
          {props.children}
        </pre>
        <CopyButton
          class="absolute top-3 right-2"
          content={preRef?.querySelector("code")?.innerText ?? ""}
        />
      </div>
    );
  },
  figcaption: (props: ComponentProps<"figcaption"> & {
    "data-language"?: string;
  }) => (
    <figcaption
      {...props}
      class={cn(
        "flex items-center gap-2 text-code-foreground [&_svg]:size-4 [&_svg]:text-code-foreground [&_svg]:opacity-70",
        props.class,
      )}
    >
      {props["data-language"] &&
        getIconForLanguageExtension(props["data-language"])}
      {props.children}
    </figcaption>
  ),
  Step: (props: ComponentProps<"h3">) => <h3 {...props} />,
  Steps: (props: ComponentProps<"div">) => (
    <div
      {...props}
      class={cn(
        "steps mb-12 [counter-reset:step] md:ml-4 md:border-l md:pl-8 [&>h3]:step",
        props.class,
      )}
    />
  ),
  Tabs: (props: ComponentProps<typeof Tabs>) => (
    <Tabs class="relative mt-6 w-full" {...props} />
  ),
  TabsList: (props: ComponentProps<typeof TabsList>) => (
    <TabsList
      class="justify-start gap-4 rounded-none bg-transparent px-0"
      {...props}
    />
  ),
  TabsTrigger: (props: ComponentProps<typeof TabsTrigger>) => (
    <TabsTrigger
      class="rounded-none border-0 border-b-2 border-transparent bg-transparent px-0 pb-3 text-base text-muted-foreground hover:text-primary dark:hover:text-primary data-selected:border-primary data-selected:bg-transparent data-selected:text-foreground data-selected:shadow-none! dark:data-selected:border-primary dark:data-selected:bg-transparent"
      {...props}
    />
  ),
  TabsContent: (props: ComponentProps<typeof TabsContent>) => (
    <TabsContent
      class="relative [&_h3.font-heading]:text-base [&_h3.font-heading]:font-medium [&>.steps]:mt-6"
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
  CodeTabs,
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

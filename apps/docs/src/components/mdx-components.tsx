import type { ComponentProps } from "@solidjs/web";
import { ComponentPreview } from "~/components/component-preview.tsx";
import { CopyButton } from "~/components/copy-button.tsx";
import { MDXHeader } from "~/components/mdx-header.tsx";
import { cn } from "~/lib/utils.ts";

// Reduced from main: the remaining registry-backed entries
// (ComponentSource, CodeTabs, Tabs, Accordion, Alert, Callout, ...) return
// together with their chrome components.
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
  // Static passthroughs for every tag markdown emits. The provider's default
  // map renders unmapped tags through Dynamic, and a hydration-keyed Dynamic
  // child inside a Kobalte primitive (e.g. a <p> wrapped inside <Button>)
  // computes a mismatched hydration key under Solid 2 RC and crashes
  // hydration. Plain elements hydrate structurally and dodge that entirely.
  p: (props: ComponentProps<"p">) => <p {...props} />,
  em: (props: ComponentProps<"em">) => <em {...props} />,
  strong: (props: ComponentProps<"strong">) => <strong {...props} />,
  del: (props: ComponentProps<"del">) => <del {...props} />,
  code: (props: ComponentProps<"code">) => <code {...props} />,
  span: (props: ComponentProps<"span">) => <span {...props} />,
  div: (props: ComponentProps<"div">) => <div {...props} />,
  blockquote: (props: ComponentProps<"blockquote">) => (
    <blockquote
      {...props}
    />
  ),
  ul: (props: ComponentProps<"ul">) => <ul {...props} />,
  ol: (props: ComponentProps<"ol">) => <ol {...props} />,
  li: (props: ComponentProps<"li">) => <li {...props} />,
  table: (props: ComponentProps<"table">) => <table {...props} />,
  thead: (props: ComponentProps<"thead">) => <thead {...props} />,
  tbody: (props: ComponentProps<"tbody">) => <tbody {...props} />,
  tr: (props: ComponentProps<"tr">) => <tr {...props} />,
  th: (props: ComponentProps<"th">) => <th {...props} />,
  td: (props: ComponentProps<"td">) => <td {...props} />,
  figure: (props: ComponentProps<"figure">) => <figure {...props} />,
  img: (props: ComponentProps<"img">) => <img {...props} />,
  hr: (props: ComponentProps<"hr">) => <hr {...props} />,
  br: (props: ComponentProps<"br">) => <br {...props} />,
  input: (props: ComponentProps<"input">) => <input {...props} />,
  section: (props: ComponentProps<"section">) => <section {...props} />,
  sup: (props: ComponentProps<"sup">) => <sup {...props} />,
  sub: (props: ComponentProps<"sub">) => <sub {...props} />,
  a: (props: ComponentProps<"a">) => {
    return (
      <a
        target={typeof props.href === "string" && props.href.includes("http")
          ? "_blank"
          : "_self"}
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
            "code group no-scrollbar min-w-0 overflow-x-auto bg-transparent py-4 outline-none",
          )}
        >
          {props.children}
        </pre>
        <CopyButton content={preRef?.querySelector("code")?.innerText ?? ""} />
      </div>
    );
  },
  figcaption: (
    props: ComponentProps<"figcaption"> & {
      "data-language"?: string;
    },
  ) => (
    <figcaption
      {...props}
      class={cn(
        "flex items-center gap-2 text-code-foreground [&_svg]:size-4 [&_svg]:text-code-foreground [&_svg]:opacity-70",
        props.class,
      )}
    >
      {props.children}
    </figcaption>
  ),
  Step: (props: ComponentProps<"h3">) => <h3 {...props} />,
  Steps: (props: ComponentProps<"div">) => (
    <div
      {...props}
      class={cn(
        "[&>h3]:step [counter-reset:step] steps mb-12 md:ml-4 md:border-l md:pl-8",
        props.class,
      )}
    />
  ),
  LinkedCard: (props: ComponentProps<"a">) => (
    <a
      data-not-typeset
      class="flex w-full flex-col items-center rounded-2xl bg-surface p-6 text-surface-foreground transition-colors hover:bg-surface/80 sm:p-10"
      {...props}
    />
  ),
  ComponentPreview,
  MDXHeader,
};

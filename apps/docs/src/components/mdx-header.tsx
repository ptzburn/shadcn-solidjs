import { Meta, Title } from "@solidjs/meta";

type HeaderProps = {
  title: string;
  description: string;
};

// Reduced from main: no pager, copy-page, or meta-tags machinery yet.
export function MDXHeader(props: HeaderProps) {
  return (
    <div data-not-typeset="" class="flex flex-col gap-2 pb-8">
      <Title>{`${props.title} - shadcn-solidjs`}</Title>
      <Meta name="description" content={props.description} />
      <h1 class="scroll-m-24 font-semibold text-3xl tracking-tight">
        {props.title}
      </h1>
      <p class="text-balance text-muted-foreground text-[1.05rem] sm:text-base md:max-w-[80%]">
        {props.description}
      </p>
    </div>
  );
}

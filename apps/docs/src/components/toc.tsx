import { useLocation } from "@solidjs/router";
import type { Accessor, Setter } from "solid-js";
import { createEffect, createSignal, For, Loading } from "solid-js";

type TocItem = {
  depth: number;
  text: string;
  slug: string;
};

function updateHeadings(setter: Setter<TocItem[]>) {
  if (document.getElementsByTagName("article").length === 0) {
    setTimeout(() => updateHeadings(setter), 1);
    return;
  }

  setter(
    [
      ...document
        .getElementsByTagName("article")[0]
        .querySelectorAll(
          "h1[data-toc], h2[data-toc], h3[data-toc], h4[data-toc], h5[data-toc], h6[data-toc]",
        ),
    ].map((element) => ({
      depth: Number(element.tagName.substring(1)),
      text: element.textContent!,
      slug: element.id,
    })),
  );
}

function getHeadingsFromToc(tableOfContents: TocItem[]) {
  return tableOfContents.map(({ slug }) => {
    const el = document.getElementById(slug);

    if (!el) {
      return;
    }

    const style = globalThis.getComputedStyle(el);
    const scrollMt = parseFloat(style.scrollMarginTop) + 1;
    const puffer = 50;

    const top = globalThis.scrollY + el.getBoundingClientRect().top - scrollMt -
      puffer;

    return { slug, top };
  });
}

function useCurrentSection(tableOfContents: Accessor<TocItem[] | undefined>) {
  const [currentSection, setCurrentSection] = createSignal(
    tableOfContents()?.[0]?.slug,
  );

  createEffect(() => tableOfContents(), (toc) => {
    if (toc == null || toc.length === 0) {
      return;
    }

    const headings = getHeadingsFromToc(toc);

    function onScroll() {
      const top = globalThis.scrollY;
      let current = headings[0]?.slug;

      for (const heading of headings) {
        if (heading == null) {
          continue;
        }

        if (top >= heading.top) {
          current = heading.slug;
        } else {
          break;
        }
      }
      setCurrentSection(current);
    }

    globalThis.addEventListener("scroll", onScroll, { passive: true });

    onScroll();

    return () => {
      globalThis.removeEventListener("scroll", onScroll);
    };
  });

  return currentSection;
}

// Effects only run on the client under Solid 2, so main's isServer guards
// fall away; its createEffect(on(...)) pairs map onto the two-arg form.
export function TableOfContents() {
  const location = useLocation();

  const [toc, setToc] = createSignal<TocItem[]>([]);
  createEffect(() => location.pathname, () => {
    updateHeadings(setToc);
  });

  const currentSection = useCurrentSection(toc);

  createEffect(() => currentSection(), (current) => {
    const element = document.querySelector(
      `a[data-toc-slug="${current}"]`,
    );

    element?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  });

  return (
    <nav
      aria-labelledby="on-this-page-title"
      class="flex flex-col gap-2 p-4 pt-0 text-sm"
    >
      <Loading>
        <p
          id="on-this-page-title"
          class="h-6 bg-background font-medium text-muted-foreground text-xs"
        >
          On This Page
        </p>
        <For each={toc()}>
          {(section) => (
            <a
              data-toc-slug={section.slug}
              data-active={section.slug === currentSection()
                ? "true"
                : undefined}
              data-depth={section.depth}
              class="text-muted-foreground text-[0.8rem] no-underline transition-colors hover:text-foreground data-[depth=3]:pl-4 data-[depth=4]:pl-6 data-[active=true]:font-medium data-[active=true]:text-foreground"
              href={`${location.pathname}#${section.slug}`}
            >
              {section.text}
            </a>
          )}
        </For>
      </Loading>
    </nav>
  );
}

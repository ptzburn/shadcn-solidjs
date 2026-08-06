import type { ComponentProps } from "solid-js";
import { For, splitProps } from "solid-js";
import { A, useLocation } from "@solidjs/router";

import { cn } from "~/lib/utils.ts";

const examples = [
  {
    name: "Mail",
    href: "/examples/mail",
  },
  {
    name: "Dashboard",
    href: "/examples/dashboard",
  },
  {
    name: "Cards",
    href: "/examples/cards",
  },
  {
    name: "Tasks",
    href: "/examples/tasks",
  },
  {
    name: "Authentication",
    href: "/examples/authentication",
  },
];

export function ExamplesNav(props: ComponentProps<"div">) {
  const [local, others] = splitProps(props, ["class"]);
  const location = useLocation();

  return (
    <div class={cn("flex items-center", local.class)} {...others}>
      <div class="no-scrollbar flex max-w-[96%] items-center overflow-x-auto md:max-w-[600px] lg:max-w-none">
        <ExampleLink
          example={{ name: "Examples", href: "/" }}
          isActive={location.pathname === "/"}
        />
        <For each={examples}>
          {(example) => (
            <ExampleLink
              example={example}
              isActive={location.pathname.startsWith(example.href)}
            />
          )}
        </For>
      </div>
    </div>
  );
}

function ExampleLink(props: {
  example: (typeof examples)[number];
  isActive: boolean;
}) {
  return (
    <A
      href={props.example.href}
      class="flex h-7 items-center justify-center gap-2 px-4 text-center text-base font-medium text-muted-foreground transition-colors hover:text-primary data-[active=true]:text-primary"
      data-active={props.isActive}
    >
      {props.example.name}
    </A>
  );
}

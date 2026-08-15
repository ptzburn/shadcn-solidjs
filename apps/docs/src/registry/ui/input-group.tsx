import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import type { ComponentProps, JSX, ValidComponent } from "@solidjs/web";
import { cn } from "~/lib/utils.ts";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import type { Component } from "solid-js";
import { merge, omit } from "solid-js";
import { Button, type ButtonProps } from "./button.tsx";

import { Input } from "./input.tsx";
import { Textarea } from "./textarea.tsx";

const InputGroup: Component<ComponentProps<"div">> = (props) => {
  const others = omit(props, "class");
  return (
    <div
      data-slot="input-group"
      role="group"
      class={cn(
        "group/input-group relative flex h-8 w-full min-w-0 items-center rounded-lg border border-input outline-none transition-colors dark:bg-input/30 dark:has-disabled:bg-input/80 dark:has-[[data-slot][aria-invalid=true]]:ring-destructive/40 has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-start]]:h-auto has-[>textarea]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-start]]:flex-col has-[[data-slot][aria-invalid=true]]:border-destructive has-disabled:bg-input/50 has-disabled:opacity-50 has-[[data-slot][aria-invalid=true]]:ring-3 has-[[data-slot][aria-invalid=true]]:ring-destructive/20 in-data-[slot=combobox-content]:focus-within:border-inherit in-data-[slot=combobox-content]:focus-within:ring-0 has-[[data-slot=input-group-control]:focus-visible]:border-ring has-[>[data-align=block-end]]:[&>input]:pt-3 has-[>[data-align=inline-end]]:[&>input]:pr-1.5 has-[>[data-align=block-start]]:[&>input]:pb-3 has-[>[data-align=inline-start]]:[&>input]:pl-1.5 has-[[data-slot=input-group-control]:focus-visible]:ring-3 has-[[data-slot=input-group-control]:focus-visible]:ring-ring/50",
        props.class,
      )}
      {...others}
    />
  );
};

const inputGroupAddonVariants = cva(
  "flex h-auto cursor-text select-none items-center justify-center gap-2 py-1.5 text-muted-foreground text-sm font-medium group-data-[disabled=true]/input-group:opacity-50 [&>kbd]:rounded-[calc(var(--radius)-5px)] [&>svg:not([class*='size-'])]:size-4",
  {
    variants: {
      align: {
        "inline-start":
          "order-first pl-2 has-[>button]:ml-[-0.3rem] has-[>kbd]:ml-[-0.15rem]",
        "inline-end":
          "order-last pr-2 has-[>button]:mr-[-0.3rem] has-[>kbd]:mr-[-0.15rem]",
        "block-start":
          "order-first w-full justify-start px-2.5 pt-2 group-has-[>input]/input-group:pt-2 [.border-b]:pb-2",
        "block-end":
          "order-last w-full justify-start px-2.5 pb-2 group-has-[>input]/input-group:pb-2 [.border-t]:pt-2",
      },
    },
    defaultVariants: {
      align: "inline-start",
    },
  },
);

type InputGroupAddonProps =
  & ComponentProps<"div">
  & VariantProps<typeof inputGroupAddonVariants>;

const InputGroupAddon: Component<InputGroupAddonProps> = (rawProps) => {
  const props = merge({ align: "inline-start" as const }, rawProps);
  const others = omit(props, "class", "align");

  const handleClick: JSX.EventHandler<HTMLDivElement, MouseEvent> = (e) => {
    if ((e.target as HTMLElement).closest("button")) {
      return;
    }
    e.currentTarget.parentElement?.querySelector("input")?.focus();
  };

  return (
    <div
      role="group"
      data-slot="input-group-addon"
      data-align={props.align}
      class={cn(inputGroupAddonVariants({ align: props.align }), props.class)}
      onClick={handleClick}
      {...others}
    />
  );
};

const inputGroupButtonVariants = cva(
  "flex items-center gap-2 text-sm shadow-none",
  {
    variants: {
      size: {
        xs:
          "h-6 gap-1 rounded-[calc(var(--radius)-3px)] px-1.5 [&>svg:not([class*='size-'])]:size-3.5",
        sm: "",
        "icon-xs":
          "size-6 rounded-[calc(var(--radius)-3px)] p-0 has-[>svg]:p-0",
        "icon-sm": "size-8 p-0 has-[>svg]:p-0",
      },
    },
    defaultVariants: {
      size: "xs",
    },
  },
);

// Kobalte's ButtonRootProps carries only the primitive's own options, so the
// intrinsic element props upstream gets from `ComponentProps<typeof Button>`
// (onClick, title, …) arrive through PolymorphicProps instead.
type InputGroupButtonProps<T extends ValidComponent = "button"> =
  & Omit<ButtonProps<T>, "size">
  & VariantProps<typeof inputGroupButtonVariants>;

const InputGroupButton = <T extends ValidComponent = "button">(
  rawProps: PolymorphicProps<T, InputGroupButtonProps<T>>,
) => {
  const props = merge(
    { type: "button" as const, variant: "ghost" as const, size: "xs" as const },
    rawProps as InputGroupButtonProps,
  );
  const others = omit(props, "class", "size", "variant", "type");
  return (
    <Button
      type={props.type}
      data-size={props.size}
      variant={props.variant}
      class={cn(inputGroupButtonVariants({ size: props.size }), props.class)}
      {...others}
    />
  );
};

const InputGroupText: Component<ComponentProps<"span">> = (props) => {
  const others = omit(props, "class");
  return (
    <span
      class={cn(
        "flex items-center gap-2 text-muted-foreground text-sm [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
        props.class,
      )}
      {...others}
    />
  );
};

const InputGroupInput: Component<ComponentProps<"input">> = (props) => {
  const others = omit(props, "class");
  return (
    <Input
      data-slot="input-group-control"
      class={cn(
        "flex-1 rounded-none border-0 bg-transparent shadow-none ring-0 focus-visible:ring-0 disabled:bg-transparent dark:bg-transparent dark:disabled:bg-transparent aria-invalid:ring-0",
        props.class,
      )}
      {...others}
    />
  );
};

const InputGroupTextarea: Component<ComponentProps<"textarea">> = (props) => {
  const others = omit(props, "class");
  return (
    <Textarea
      data-slot="input-group-control"
      class={cn(
        "flex-1 resize-none rounded-none border-0 bg-transparent py-2 shadow-none ring-0 focus-visible:ring-0 disabled:bg-transparent dark:bg-transparent dark:disabled:bg-transparent aria-invalid:ring-0",
        props.class,
      )}
      {...others}
    />
  );
};

export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
};

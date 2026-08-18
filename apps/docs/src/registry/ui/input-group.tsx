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
        "cn-input-group group/input-group relative flex w-full min-w-0 items-center outline-none has-[>textarea]:h-auto",
        props.class,
      )}
      {...others}
    />
  );
};

const inputGroupAddonVariants = cva(
  "cn-input-group-addon flex cursor-text items-center justify-center select-none",
  {
    variants: {
      align: {
        "inline-start": "cn-input-group-addon-align-inline-start order-first",
        "inline-end": "cn-input-group-addon-align-inline-end order-last",
        "block-start":
          "cn-input-group-addon-align-block-start order-first w-full justify-start",
        "block-end":
          "cn-input-group-addon-align-block-end order-last w-full justify-start",
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
  "cn-input-group-button flex items-center shadow-none",
  {
    variants: {
      size: {
        xs: "cn-input-group-button-size-xs",
        sm: "cn-input-group-button-size-sm",
        "icon-xs": "cn-input-group-button-size-icon-xs",
        "icon-sm": "cn-input-group-button-size-icon-sm",
      },
    },
    defaultVariants: {
      size: "xs",
    },
  },
);

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
        "cn-input-group-text flex items-center [&_svg]:pointer-events-none",
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
        "cn-input-group-input flex-1",
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
        "cn-input-group-textarea flex-1 resize-none",
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

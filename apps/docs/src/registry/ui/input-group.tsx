import { Button, type ButtonProps } from "./button.tsx";
import { Input } from "./input.tsx";
import { Textarea } from "./textarea.tsx";
import { cn } from "~/lib/utils.ts";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";

import type { Component, ComponentProps, JSX } from "solid-js";
import { mergeProps, splitProps } from "solid-js";

const InputGroup: Component<ComponentProps<"div">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <div
      data-slot="input-group"
      role="group"
      class={cn(
        "group/input-group cn-input-group relative flex w-full min-w-0 items-center outline-none has-[>textarea]:h-auto",
        local.class,
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
  const props = mergeProps({ align: "inline-start" as const }, rawProps);
  const [local, others] = splitProps(props, ["class", "align"]);

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
      data-align={local.align}
      class={cn(inputGroupAddonVariants({ align: local.align }), local.class)}
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

type InputGroupButtonProps =
  & Omit<ButtonProps, "size">
  & VariantProps<typeof inputGroupButtonVariants>;

const InputGroupButton: Component<InputGroupButtonProps> = (rawProps) => {
  const props = mergeProps(
    { type: "button" as const, variant: "ghost" as const, size: "xs" as const },
    rawProps,
  );
  const [local, others] = splitProps(props, [
    "class",
    "size",
    "variant",
    "type",
  ]);
  return (
    <Button
      type={local.type}
      data-size={local.size}
      variant={local.variant}
      class={cn(inputGroupButtonVariants({ size: local.size }), local.class)}
      {...others}
    />
  );
};

const InputGroupText: Component<ComponentProps<"span">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <span
      class={cn(
        "cn-input-group-text flex items-center [&_svg]:pointer-events-none",
        local.class,
      )}
      {...others}
    />
  );
};

const InputGroupInput: Component<ComponentProps<"input">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <Input
      data-slot="input-group-control"
      class={cn(
        "cn-input-group-input flex-1",
        local.class,
      )}
      {...others}
    />
  );
};

const InputGroupTextarea: Component<ComponentProps<"textarea">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <Textarea
      data-slot="input-group-control"
      class={cn(
        "cn-input-group-textarea flex-1 resize-none",
        local.class,
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

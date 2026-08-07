import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import { Polymorphic } from "@kobalte/core/polymorphic";

import { cn } from "~/lib/utils.ts";
import type { ButtonProps } from "./button.tsx";
import { Button } from "./button.tsx";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import type { Component, ComponentProps, ValidComponent } from "solid-js";

import { splitProps } from "solid-js";

const attachmentVariants = cva(
  "cn-attachment group/attachment relative flex max-w-full min-w-0 shrink-0 flex-wrap border bg-card text-card-foreground transition-colors has-[>a,>button]:hover:bg-muted/50 data-[state=error]:border-destructive/30 data-[state=idle]:border-dashed",
  {
    variants: {
      size: {
        default: "cn-attachment-size-default",
        sm: "cn-attachment-size-sm",
        xs: "cn-attachment-size-xs",
      },
      orientation: {
        horizontal: "cn-attachment-orientation-horizontal items-center",
        vertical: "cn-attachment-orientation-vertical flex-col",
      },
    },
    defaultVariants: {
      size: "default",
      orientation: "horizontal",
    },
  },
);

type AttachmentProps =
  & ComponentProps<"div">
  & VariantProps<typeof attachmentVariants>
  & {
    state?: "idle" | "uploading" | "processing" | "error" | "done";
  };

const Attachment: Component<AttachmentProps> = (props) => {
  const [local, others] = splitProps(props, [
    "class",
    "state",
    "size",
    "orientation",
  ]);
  return (
    <div
      data-slot="attachment"
      data-state={local.state ?? "done"}
      data-size={local.size ?? "default"}
      data-orientation={local.orientation ?? "horizontal"}
      class={cn(
        attachmentVariants({
          size: local.size,
          orientation: local.orientation,
        }),
        local.class,
      )}
      {...others}
    />
  );
};

const attachmentMediaVariants = cva(
  "cn-attachment-media relative flex aspect-square shrink-0 items-center justify-center overflow-hidden group-data-[state=error]/attachment:bg-destructive/10 group-data-[state=error]/attachment:text-destructive [&_svg]:pointer-events-none",
  {
    variants: {
      variant: {
        icon: "cn-attachment-media-variant-icon",
        image:
          "cn-attachment-media-variant-image *:[img]:aspect-square *:[img]:w-full *:[img]:object-cover",
      },
    },
    defaultVariants: {
      variant: "icon",
    },
  },
);

type AttachmentMediaProps =
  & ComponentProps<"div">
  & VariantProps<typeof attachmentMediaVariants>;

const AttachmentMedia: Component<AttachmentMediaProps> = (props) => {
  const [local, others] = splitProps(props, ["class", "variant"]);
  return (
    <div
      data-slot="attachment-media"
      data-variant={local.variant ?? "icon"}
      class={cn(
        attachmentMediaVariants({ variant: local.variant }),
        local.class,
      )}
      {...others}
    />
  );
};

const AttachmentContent: Component<ComponentProps<"div">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <div
      data-slot="attachment-content"
      class={cn("cn-attachment-content max-w-full min-w-0 flex-1", local.class)}
      {...others}
    />
  );
};

const AttachmentTitle: Component<ComponentProps<"span">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <span
      data-slot="attachment-title"
      class={cn(
        "cn-attachment-title block max-w-full min-w-0 truncate group-data-[state=processing]/attachment:shimmer group-data-[state=uploading]/attachment:shimmer",
        local.class,
      )}
      {...others}
    />
  );
};

const AttachmentDescription: Component<ComponentProps<"span">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <span
      data-slot="attachment-description"
      class={cn(
        "cn-attachment-description block min-w-0 truncate text-muted-foreground group-data-[state=error]/attachment:text-destructive/80",
        "max-w-full",
        local.class,
      )}
      {...others}
    />
  );
};

const AttachmentActions: Component<ComponentProps<"div">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <div
      data-slot="attachment-actions"
      class={cn(
        "cn-attachment-actions flex shrink-0 items-center",
        local.class,
      )}
      {...others}
    />
  );
};

const AttachmentAction = <T extends ValidComponent = "button">(
  props: PolymorphicProps<T, ButtonProps<T>>,
) => {
  const [local, others] = splitProps(props as ButtonProps, [
    "class",
    "variant",
    "size",
  ]);
  return (
    <Button
      data-slot="attachment-action"
      variant={local.variant ?? "ghost"}
      size={local.size ?? "icon-xs"}
      class={cn("cn-attachment-action", local.class)}
      {...others}
    />
  );
};

type AttachmentTriggerProps =
  & ComponentProps<"button">
  & { class?: string | undefined };

const AttachmentTrigger = <T extends ValidComponent = "button">(
  props: PolymorphicProps<T, AttachmentTriggerProps>,
) => {
  const [local, others] = splitProps(props as AttachmentTriggerProps, [
    "class",
    "type",
  ]);
  return (
    <Polymorphic
      as="button"
      data-slot="attachment-trigger"
      // Default the button type, but never stamp `type` onto a polymorphic
      // element that has no such attribute (an anchor, say). Upstream makes
      // the same distinction with `asChild`.
      type={(props.as ?? "button") === "button"
        ? local.type ?? "button"
        : local.type}
      class={cn(
        "cn-attachment-trigger absolute inset-0 z-10 outline-none",
        local.class,
      )}
      {...others}
    />
  );
};

const AttachmentGroup: Component<ComponentProps<"div">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <div
      data-slot="attachment-group"
      class={cn(
        "cn-attachment-group flex min-w-0 scroll-fade-x snap-x snap-mandatory no-scrollbar overflow-x-auto overscroll-x-contain *:data-[slot=attachment]:flex-none *:data-[slot=attachment]:snap-start",
        local.class,
      )}
      {...others}
    />
  );
};

export type { AttachmentMediaProps, AttachmentProps };
export {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
  AttachmentTrigger,
  attachmentVariants,
};

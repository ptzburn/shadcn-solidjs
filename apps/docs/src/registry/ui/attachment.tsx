import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import { Polymorphic } from "@kobalte/core/polymorphic";
import type { ComponentProps, ValidComponent } from "@solidjs/web";
import { cn } from "~/lib/utils.ts";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import type { Component } from "solid-js";
import { omit } from "solid-js";
import type { ButtonProps } from "./button.tsx";

import { Button } from "./button.tsx";

const attachmentVariants = cva(
  "w-fit rounded-xl focus-within:ring-1 focus-within:ring-ring/50 group/attachment relative flex max-w-full min-w-0 shrink-0 flex-wrap border bg-card text-card-foreground transition-colors has-[>a,>button]:hover:bg-muted/50 data-[state=error]:border-destructive/30 data-[state=idle]:border-dashed",
  {
    variants: {
      size: {
        default:
          "gap-2 text-sm has-data-[slot=attachment-content]:px-2.5 has-data-[slot=attachment-content]:py-2 has-data-[slot=attachment-media]:p-2",
        sm:
          "gap-2.5 text-xs has-data-[slot=attachment-content]:px-2 has-data-[slot=attachment-content]:py-1.5 has-data-[slot=attachment-media]:p-1.5",
        xs:
          "gap-1.5 rounded-lg text-xs has-data-[slot=attachment-content]:px-1.5 has-data-[slot=attachment-content]:py-1 has-data-[slot=attachment-media]:p-1",
      },
      orientation: {
        horizontal: "min-w-40 items-center",
        vertical: "w-24 has-data-[slot=attachment-content]:w-30 flex-col",
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
  const others = omit(props, "class", "state", "size", "orientation");
  return (
    <div
      data-slot="attachment"
      data-state={props.state ?? "done"}
      data-size={props.size ?? "default"}
      data-orientation={props.orientation ?? "horizontal"}
      class={cn(
        attachmentVariants({
          size: props.size,
          orientation: props.orientation,
        }),
        props.class,
      )}
      {...others}
    />
  );
};

const attachmentMediaVariants = cva(
  "w-10 rounded-lg bg-muted text-foreground group-data-[size=sm]/attachment:w-8 group-data-[size=xs]/attachment:w-7 group-data-[size=xs]/attachment:rounded-md group-data-[orientation=vertical]/attachment:w-full [&_svg:not([class*='size-'])]:size-4 group-data-[size=xs]/attachment:[&_svg:not([class*='size-'])]:size-3.5 group-data-[orientation=vertical]/attachment:[&_svg:not([class*='size-'])]:size-6 group-data-[orientation=vertical]/attachment:*:data-[slot=spinner]:size-6! relative flex aspect-square shrink-0 items-center justify-center overflow-hidden group-data-[state=error]/attachment:bg-destructive/10 group-data-[state=error]/attachment:text-destructive [&_svg]:pointer-events-none",
  {
    variants: {
      variant: {
        icon: "",
        image:
          "opacity-60 group-data-[state=idle]/attachment:opacity-100 group-data-[state=done]/attachment:opacity-100 *:[img]:aspect-square *:[img]:w-full *:[img]:object-cover",
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
  const others = omit(props, "class", "variant");
  return (
    <div
      data-slot="attachment-media"
      data-variant={props.variant ?? "icon"}
      class={cn(
        attachmentMediaVariants({ variant: props.variant }),
        props.class,
      )}
      {...others}
    />
  );
};

const AttachmentContent: Component<ComponentProps<"div">> = (props) => {
  const others = omit(props, "class");
  return (
    <div
      data-slot="attachment-content"
      class={cn(
        "min-w-0 max-w-full flex-1 leading-tight group-data-[orientation=vertical]/attachment:px-1",
        props.class,
      )}
      {...others}
    />
  );
};

const AttachmentTitle: Component<ComponentProps<"span">> = (props) => {
  const others = omit(props, "class");
  return (
    <span
      data-slot="attachment-title"
      class={cn(
        "group-data-[state=processing]/attachment:shimmer group-data-[state=uploading]/attachment:shimmer block min-w-0 max-w-full truncate font-medium",
        props.class,
      )}
      {...others}
    />
  );
};

const AttachmentDescription: Component<ComponentProps<"span">> = (props) => {
  const others = omit(props, "class");
  return (
    <span
      data-slot="attachment-description"
      class={cn(
        "mt-0.5 block min-w-0 truncate text-muted-foreground text-xs group-data-[state=error]/attachment:text-destructive/80",
        "max-w-full",
        props.class,
      )}
      {...others}
    />
  );
};

const AttachmentActions: Component<ComponentProps<"div">> = (props) => {
  const others = omit(props, "class");
  return (
    <div
      data-slot="attachment-actions"
      class={cn(
        "relative z-20 flex shrink-0 items-center group-data-[orientation=vertical]/attachment:absolute group-data-[orientation=vertical]/attachment:top-3 group-data-[orientation=vertical]/attachment:right-3 group-data-[orientation=vertical]/attachment:gap-1",
        props.class,
      )}
      {...others}
    />
  );
};

const AttachmentAction = <T extends ValidComponent = "button">(
  props: PolymorphicProps<T, ButtonProps<T>>,
) => {
  const local = props as ButtonProps;
  const others = omit(local, "class", "variant", "size");
  return (
    <Button
      data-slot="attachment-action"
      variant={local.variant ?? "ghost"}
      size={local.size ?? "icon-xs"}
      class={cn(local.class)}
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
  const local = props as AttachmentTriggerProps;
  const others = omit(local, "class", "type");
  return (
    <Polymorphic
      as="button"
      data-slot="attachment-trigger"
      type={(props.as ?? "button") === "button"
        ? local.type ?? "button"
        : local.type}
      class={cn(
        "absolute inset-0 z-10 outline-none",
        local.class,
      )}
      {...others}
    />
  );
};

const AttachmentGroup: Component<ComponentProps<"div">> = (props) => {
  const others = omit(props, "class");
  return (
    <div
      data-slot="attachment-group"
      class={cn(
        "no-scrollbar scroll-fade-x flex min-w-0 snap-x snap-mandatory scroll-px-1 gap-3 overflow-x-auto overscroll-x-contain py-1 *:data-[slot=attachment]:flex-none *:data-[slot=attachment]:snap-start",
        props.class,
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

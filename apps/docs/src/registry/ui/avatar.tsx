import * as ImagePrimitive from "@kobalte/core/image";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import type { ComponentProps, ValidComponent } from "@solidjs/web";
import { cn } from "~/lib/utils.ts";
import type { Component } from "solid-js";

import { omit } from "solid-js";

type AvatarRootProps<T extends ValidComponent = "span"> =
  & ImagePrimitive.ImageRootProps<T>
  & {
    class?: string | undefined;
    size?: "default" | "sm" | "lg";
  };

const Avatar = <T extends ValidComponent = "span">(
  props: PolymorphicProps<T, AvatarRootProps<T>>,
) => {
  const local = props as AvatarRootProps;
  const others = omit(local, "class", "size");
  return (
    <ImagePrimitive.Root
      data-slot="avatar"
      data-size={local.size ?? "default"}
      class={cn(
        "group/avatar relative flex size-8 shrink-0 select-none rounded-full after:absolute after:inset-0 after:rounded-full after:border after:border-border after:mix-blend-darken dark:after:mix-blend-lighten data-[size=lg]:size-10 data-[size=sm]:size-6",
        local.class,
      )}
      {...others}
    />
  );
};

type AvatarImageProps<T extends ValidComponent = "img"> =
  & ImagePrimitive.ImageImgProps<T>
  & {
    class?: string | undefined;
  };

const AvatarImage = <T extends ValidComponent = "img">(
  props: PolymorphicProps<T, AvatarImageProps<T>>,
) => {
  const local = props as AvatarImageProps;
  const others = omit(local, "class");
  return (
    <ImagePrimitive.Img
      data-slot="avatar-image"
      class={cn(
        "aspect-square size-full rounded-full object-cover",
        local.class,
      )}
      {...others}
    />
  );
};

type AvatarFallbackProps<T extends ValidComponent = "span"> =
  & ImagePrimitive.ImageFallbackProps<T>
  & { class?: string | undefined };

const AvatarFallback = <T extends ValidComponent = "span">(
  props: PolymorphicProps<T, AvatarFallbackProps<T>>,
) => {
  const local = props as AvatarFallbackProps;
  const others = omit(local, "class");
  return (
    <ImagePrimitive.Fallback
      data-slot="avatar-fallback"
      class={cn(
        "flex size-full items-center justify-center rounded-full bg-muted text-muted-foreground text-sm group-data-[size=sm]/avatar:text-xs",
        local.class,
      )}
      {...others}
    />
  );
};

const AvatarBadge: Component<ComponentProps<"span">> = (props) => {
  const others = omit(props, "class");
  return (
    <span
      data-slot="avatar-badge"
      class={cn(
        "absolute right-0 bottom-0 z-10 inline-flex select-none items-center justify-center rounded-full bg-blend-color bg-primary text-primary-foreground ring-2 ring-background",
        "group-data-[size=sm]/avatar:size-2 group-data-[size=sm]/avatar:[&>svg]:hidden",
        "group-data-[size=default]/avatar:size-2.5 group-data-[size=default]/avatar:[&>svg]:size-2",
        "group-data-[size=lg]/avatar:size-3 group-data-[size=lg]/avatar:[&>svg]:size-2",
        props.class,
      )}
      {...others}
    />
  );
};

const AvatarGroup: Component<ComponentProps<"div">> = (props) => {
  const others = omit(props, "class");
  return (
    <div
      data-slot="avatar-group"
      class={cn(
        "group/avatar-group flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background",
        props.class,
      )}
      {...others}
    />
  );
};

const AvatarGroupCount: Component<ComponentProps<"div">> = (props) => {
  const others = omit(props, "class");
  return (
    <div
      data-slot="avatar-group-count"
      class={cn(
        "relative flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground text-sm ring-2 ring-background [&>svg]:size-4 group-has-data-[size=lg]/avatar-group:size-10 group-has-data-[size=sm]/avatar-group:size-6 group-has-data-[size=lg]/avatar-group:[&>svg]:size-5 group-has-data-[size=sm]/avatar-group:[&>svg]:size-3",
        props.class,
      )}
      {...others}
    />
  );
};

export {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
};

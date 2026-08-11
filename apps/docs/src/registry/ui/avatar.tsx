import * as ImagePrimitive from "@kobalte/core/image";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";

import { cn } from "~/lib/utils.ts";
import type { Component, ComponentProps, ValidComponent } from "solid-js";

import { splitProps } from "solid-js";

type AvatarRootProps<T extends ValidComponent = "span"> =
  & ImagePrimitive.ImageRootProps<T>
  & {
    class?: string | undefined;
    size?: "default" | "sm" | "lg";
  };

const Avatar = <T extends ValidComponent = "span">(
  props: PolymorphicProps<T, AvatarRootProps<T>>,
) => {
  const [local, others] = splitProps(props as AvatarRootProps, [
    "class",
    "size",
  ]);
  return (
    <ImagePrimitive.Root
      data-slot="avatar"
      data-size={local.size ?? "default"}
      class={cn(
        "cn-avatar group/avatar relative flex shrink-0 select-none after:absolute after:inset-0 after:border after:border-border after:mix-blend-darken dark:after:mix-blend-lighten",
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
  const [local, others] = splitProps(props as AvatarImageProps, ["class"]);
  return (
    <ImagePrimitive.Img
      data-slot="avatar-image"
      class={cn(
        "cn-avatar-image aspect-square size-full object-cover",
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
  const [local, others] = splitProps(props as AvatarFallbackProps, ["class"]);
  return (
    <ImagePrimitive.Fallback
      data-slot="avatar-fallback"
      class={cn(
        "cn-avatar-fallback flex size-full items-center justify-center text-sm group-data-[size=sm]/avatar:text-xs",
        local.class,
      )}
      {...others}
    />
  );
};

const AvatarBadge: Component<ComponentProps<"span">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <span
      data-slot="avatar-badge"
      class={cn(
        "cn-avatar-badge absolute right-0 bottom-0 z-10 inline-flex select-none items-center justify-center rounded-full bg-blend-color ring-2",
        "group-data-[size=sm]/avatar:size-2 group-data-[size=sm]/avatar:[&>svg]:hidden",
        "group-data-[size=default]/avatar:size-2.5 group-data-[size=default]/avatar:[&>svg]:size-2",
        "group-data-[size=lg]/avatar:size-3 group-data-[size=lg]/avatar:[&>svg]:size-2",
        local.class,
      )}
      {...others}
    />
  );
};

const AvatarGroup: Component<ComponentProps<"div">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <div
      data-slot="avatar-group"
      class={cn(
        "cn-avatar-group group/avatar-group flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background",
        local.class,
      )}
      {...others}
    />
  );
};

const AvatarGroupCount: Component<ComponentProps<"div">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <div
      data-slot="avatar-group-count"
      class={cn(
        "cn-avatar-group-count relative flex shrink-0 items-center justify-center ring-2 ring-background",
        local.class,
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

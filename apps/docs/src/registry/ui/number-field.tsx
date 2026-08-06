import type { Component, ComponentProps, JSX, ValidComponent } from "solid-js";
import { Show, splitProps } from "solid-js";

import * as NumberFieldPrimitive from "@kobalte/core/number-field";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";

import { cn } from "~/lib/utils.ts";
import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";

const NumberField = NumberFieldPrimitive.Root;

const NumberFieldGroup: Component<ComponentProps<"div">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <div
      class={cn(
        "cn-number-field-group relative",
        local.class,
      )}
      {...others}
    />
  );
};

type NumberFieldLabelProps<T extends ValidComponent = "label"> =
  & NumberFieldPrimitive.NumberFieldLabelProps<T>
  & {
    class?: string | undefined;
  };

const NumberFieldLabel = <T extends ValidComponent = "label">(
  props: PolymorphicProps<T, NumberFieldLabelProps<T>>,
) => {
  const [local, others] = splitProps(props as NumberFieldLabelProps, ["class"]);
  return (
    <NumberFieldPrimitive.Label
      class={cn(
        "cn-number-field-label leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        local.class,
      )}
      {...others}
    />
  );
};

type NumberFieldInputProps<T extends ValidComponent = "input"> =
  & NumberFieldPrimitive.NumberFieldInputProps<T>
  & {
    class?: string | undefined;
  };

const NumberFieldInput = <T extends ValidComponent = "input">(
  props: PolymorphicProps<T, NumberFieldInputProps<T>>,
) => {
  const [local, others] = splitProps(props as NumberFieldInputProps, ["class"]);
  return (
    <NumberFieldPrimitive.Input
      class={cn(
        "cn-number-field-input flex w-full file:border-0 file:bg-transparent placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
        local.class,
      )}
      {...others}
    />
  );
};

type NumberFieldIncrementTriggerProps<T extends ValidComponent = "button"> =
  & NumberFieldPrimitive.NumberFieldIncrementTriggerProps<T>
  & {
    class?: string | undefined;
    children?: JSX.Element;
  };

const NumberFieldIncrementTrigger = <T extends ValidComponent = "button">(
  props: PolymorphicProps<T, NumberFieldIncrementTriggerProps<T>>,
) => {
  const [local, others] = splitProps(
    props as NumberFieldIncrementTriggerProps,
    [
      "class",
      "children",
    ],
  );
  return (
    <NumberFieldPrimitive.IncrementTrigger
      class={cn(
        "cn-number-field-increment-trigger absolute right-1 top-1 inline-flex size-4 items-center justify-center",
        local.class,
      )}
      {...others}
    >
      <Show
        when={local.children}
        fallback={
          <IconPlaceholder
            lucide="chevron-up"
            tabler="chevron-up"
            ph="caret-up"
            ri="arrow-up-s-line"
            hugeicons="arrow-up-01"
            class="size-4"
          />
        }
      >
        {(children) => children()}
      </Show>
    </NumberFieldPrimitive.IncrementTrigger>
  );
};

type NumberFieldDecrementTriggerProps<T extends ValidComponent = "button"> =
  & NumberFieldPrimitive.NumberFieldDecrementTriggerProps<T>
  & {
    class?: string | undefined;
    children?: JSX.Element;
  };

const NumberFieldDecrementTrigger = <T extends ValidComponent = "button">(
  props: PolymorphicProps<T, NumberFieldDecrementTriggerProps<T>>,
) => {
  const [local, others] = splitProps(
    props as NumberFieldDecrementTriggerProps,
    [
      "class",
      "children",
    ],
  );
  return (
    <NumberFieldPrimitive.DecrementTrigger
      class={cn(
        "cn-number-field-decrement-trigger absolute bottom-1 right-1 inline-flex size-4 items-center justify-center",
        local.class,
      )}
      {...others}
    >
      <Show
        when={local.children}
        fallback={
          <IconPlaceholder
            lucide="chevron-down"
            tabler="chevron-down"
            ph="caret-down"
            ri="arrow-down-s-line"
            hugeicons="arrow-down-01"
            class="size-4"
          />
        }
      >
        {(children) => children()}
      </Show>
    </NumberFieldPrimitive.DecrementTrigger>
  );
};

type NumberFieldDescriptionProps<T extends ValidComponent = "div"> =
  & NumberFieldPrimitive.NumberFieldDescriptionProps<T>
  & {
    class?: string | undefined;
  };

const NumberFieldDescription = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, NumberFieldDescriptionProps<T>>,
) => {
  const [local, others] = splitProps(props as NumberFieldDescriptionProps, [
    "class",
  ]);
  return (
    <NumberFieldPrimitive.Description
      class={cn("cn-number-field-description", local.class)}
      {...others}
    />
  );
};

type NumberFieldErrorMessageProps<T extends ValidComponent = "div"> =
  & NumberFieldPrimitive.NumberFieldErrorMessageProps<T>
  & {
    class?: string | undefined;
  };

const NumberFieldErrorMessage = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, NumberFieldErrorMessageProps<T>>,
) => {
  const [local, others] = splitProps(props as NumberFieldErrorMessageProps, [
    "class",
  ]);
  return (
    <NumberFieldPrimitive.ErrorMessage
      class={cn("cn-number-field-error-message", local.class)}
      {...others}
    />
  );
};

export {
  NumberField,
  NumberFieldDecrementTrigger,
  NumberFieldDescription,
  NumberFieldErrorMessage,
  NumberFieldGroup,
  NumberFieldIncrementTrigger,
  NumberFieldInput,
  NumberFieldLabel,
};

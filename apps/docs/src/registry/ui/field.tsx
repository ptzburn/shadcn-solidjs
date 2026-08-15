import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import { Polymorphic } from "@kobalte/core/polymorphic";
import type { ComponentProps, JSX, ValidComponent } from "@solidjs/web";
import { cn } from "~/lib/utils.ts";
import { cva, type VariantProps } from "class-variance-authority";

import { children, createMemo, For, omit, Show } from "solid-js";
import { Label } from "./label.tsx";
import { Separator } from "./separator.tsx";

type FieldSetProps<T extends ValidComponent = "fieldset"> =
  & ComponentProps<T>
  & {
    class?: string | undefined;
  };

const FieldSet = <T extends ValidComponent = "fieldset">(
  props: PolymorphicProps<T, FieldSetProps<T>>,
) => {
  const local = props as FieldSetProps;
  const others = omit(local, "class");

  return (
    <Polymorphic<FieldSetProps>
      as="fieldset"
      data-slot="field-set"
      class={cn(
        "flex flex-col gap-4 has-[>[data-slot=checkbox-group]]:gap-3 has-[>[data-slot=radio-group]]:gap-3",
        local.class,
      )}
      {...others}
    />
  );
};

type FieldLegendProps<T extends ValidComponent = "legend"> =
  & ComponentProps<T>
  & {
    class?: string | undefined;
    variant?: "legend" | "label";
  };

const FieldLegend = <T extends ValidComponent = "legend">(
  props: PolymorphicProps<T, FieldLegendProps<T>>,
) => {
  const local = props as FieldLegendProps;
  const others = omit(local, "class", "variant");

  return (
    <Polymorphic<FieldLegendProps>
      as="legend"
      data-slot="field-legend"
      data-variant={local.variant ?? "legend"}
      class={cn(
        "mb-1.5 font-medium data-[variant=label]:text-sm data-[variant=legend]:text-base",
        local.class,
      )}
      {...others}
    />
  );
};

type FieldGroupProps<T extends ValidComponent = "div"> = ComponentProps<T> & {
  class?: string | undefined;
};

const FieldGroup = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, FieldGroupProps<T>>,
) => {
  const local = props as FieldGroupProps;
  const others = omit(local, "class");

  return (
    <Polymorphic<FieldGroupProps>
      as="div"
      data-slot="field-group"
      class={cn(
        "@container/field-group group/field-group flex w-full flex-col gap-5 *:data-[slot=field-group]:gap-4 data-[slot=checkbox-group]:gap-3",
        local.class,
      )}
      {...others}
    />
  );
};

const fieldVariants = cva(
  "group/field flex w-full gap-2 data-[invalid=true]:text-destructive",
  {
    variants: {
      orientation: {
        // Kobalte's Select.Root renders a real wrapper div (radix's renders
        // nothing), so `*:w-full` lands on the wrapper instead of the
        // trigger; the extra selector reaches one level deeper.
        vertical:
          "flex-col *:w-full [&>.sr-only]:w-auto [&>[data-slot=select]>[data-slot=select-trigger]]:w-full",
        // Kobalte renders no element carrying an explicit checkbox/radio
        // role, so upstream's [role=checkbox]/[role=radio] selectors never
        // match here; the data-slot selectors alongside them do the same job.
        horizontal:
          "flex-row items-center has-[>[data-slot=field-content]]:items-start *:data-[slot=field-label]:flex-auto has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px has-[>[data-slot=field-content]]:[&>[data-slot=checkbox]]:mt-px has-[>[data-slot=field-content]]:[&>[data-slot=radio-group-item]]:mt-px",
        responsive:
          "flex-col *:w-full @md/field-group:flex-row @md/field-group:items-center @md/field-group:*:w-auto @md/field-group:has-[>[data-slot=field-content]]:items-start @md/field-group:*:data-[slot=field-label]:flex-auto [&>.sr-only]:w-auto @md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px @md/field-group:has-[>[data-slot=field-content]]:[&>[data-slot=checkbox]]:mt-px @md/field-group:has-[>[data-slot=field-content]]:[&>[data-slot=radio-group-item]]:mt-px [&>[data-slot=select]>[data-slot=select-trigger]]:w-full @md/field-group:[&>[data-slot=select]>[data-slot=select-trigger]]:w-auto",
      },
    },
    defaultVariants: {
      orientation: "vertical",
    },
  },
);

type FieldProps<T extends ValidComponent = "div"> =
  & ComponentProps<T>
  & VariantProps<typeof fieldVariants>
  & {
    class?: string | undefined;
    orientation?: "vertical" | "horizontal" | "responsive";
  };

const Field = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, FieldProps<T>>,
) => {
  const local = props as FieldProps;
  const others = omit(local, "class", "orientation");

  return (
    <Polymorphic<FieldProps>
      as="div"
      role="group"
      data-slot="field"
      data-orientation={local.orientation ?? "vertical"}
      class={cn(
        fieldVariants({ orientation: local.orientation }),
        local.class,
      )}
      {...others}
    />
  );
};

type FieldContentProps<T extends ValidComponent = "div"> = ComponentProps<T> & {
  class?: string | undefined;
};

const FieldContent = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, FieldContentProps<T>>,
) => {
  const local = props as FieldContentProps;
  const others = omit(local, "class");

  return (
    <Polymorphic<FieldContentProps>
      as="div"
      data-slot="field-content"
      class={cn(
        "group/field-content flex flex-1 flex-col gap-0.5 leading-snug",
        local.class,
      )}
      {...others}
    />
  );
};

type FieldLabelProps<T extends ValidComponent = "label"> = ComponentProps<T> & {
  class?: string | undefined;
};

const FieldLabel = <T extends ValidComponent = "label">(
  props: PolymorphicProps<T, FieldLabelProps<T>>,
) => {
  const local = props as FieldLabelProps;
  const others = omit(local, "class");

  return (
    <Label
      data-slot="field-label"
      class={cn(
        "group/field-label peer/field-label flex w-fit gap-2 leading-snug *:data-[slot=field]:p-2.5 dark:has-data-checked:border-primary/20 dark:has-data-checked:bg-primary/10 has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col has-[>[data-slot=field]]:rounded-lg has-[>[data-slot=field]]:border has-data-checked:border-primary/30 has-data-checked:bg-primary/5 group-data-[disabled=true]/field:opacity-50",
        local.class,
      )}
      {...others}
    />
  );
};

type FieldTitleProps<T extends ValidComponent = "div"> = ComponentProps<T> & {
  class?: string | undefined;
};

const FieldTitle = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, FieldTitleProps<T>>,
) => {
  const local = props as FieldTitleProps;
  const others = omit(local, "class");

  return (
    <Polymorphic<FieldTitleProps>
      as="div"
      data-slot="field-label"
      class={cn(
        "flex w-fit items-center gap-2 font-medium text-sm leading-snug group-data-[disabled=true]/field:opacity-50",
        local.class,
      )}
      {...others}
    />
  );
};

type FieldDescriptionProps<T extends ValidComponent = "p"> =
  & ComponentProps<T>
  & {
    class?: string | undefined;
  };

const FieldDescription = <T extends ValidComponent = "p">(
  props: PolymorphicProps<T, FieldDescriptionProps<T>>,
) => {
  const local = props as FieldDescriptionProps;
  const others = omit(local, "class");

  return (
    <Polymorphic<FieldDescriptionProps>
      as="p"
      data-slot="field-description"
      class={cn(
        "text-left font-normal text-muted-foreground text-sm leading-normal [[data-variant=legend]+&]:-mt-1.5 group-has-[[data-orientation=horizontal]]/field:text-balance",
        "last:mt-0 nth-last-2:-mt-1",
        "[&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary",
        local.class,
      )}
      {...others}
    />
  );
};

type FieldSeparatorProps<T extends ValidComponent = "div"> =
  & ComponentProps<T>
  & {
    class?: string | undefined;
    children?: JSX.Element;
  };

const FieldSeparator = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, FieldSeparatorProps<T>>,
) => {
  const local = props as FieldSeparatorProps;
  const others = omit(local, "class", "children");

  // prevents rendering children twice
  const resolvedChildren = children(() => local.children);
  const hasChildren = () => resolvedChildren.toArray().length !== 0;

  return (
    <Polymorphic<FieldSeparatorProps>
      as="div"
      data-slot="field-separator"
      data-content={hasChildren() ? "true" : "false"}
      class={cn(
        "relative -my-2 h-5 text-sm group-data-[variant=outline]/field-group:-mb-2",
        local.class,
      )}
      {...others}
    >
      <Separator class="absolute inset-0 top-1/2" />
      <Show when={hasChildren()}>
        <span
          class="relative mx-auto block w-fit bg-background px-2 text-muted-foreground"
          data-slot="field-separator-content"
        >
          {resolvedChildren()}
        </span>
      </Show>
    </Polymorphic>
  );
};

type ErrorItem = { message?: string } | undefined;

type FieldErrorProps<T extends ValidComponent = "div"> = ComponentProps<T> & {
  class?: string | undefined;
  children?: JSX.Element;
  errors?: ErrorItem[];
};

const FieldError = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, FieldErrorProps<T>>,
) => {
  const local = props as FieldErrorProps;
  const others = omit(local, "class", "children", "errors");

  // prevents rendering children twice
  const resolvedChildren = children(() => local.children);

  // Reactive memo: computes content only when children or errors change
  const content = createMemo(() => {
    const kids = resolvedChildren.toArray();
    if (kids.length !== 0) {
      return kids;
    }

    const errors = local.errors?.filter((e): e is { message: string } =>
      !!e?.message
    );
    if (!errors || errors.length === 0) {
      return null;
    }

    const uniqueErrors = Array.from(
      new Map(errors.map((e) => [e.message, e])).values(),
    );

    if (uniqueErrors.length === 1) {
      return uniqueErrors[0].message;
    }

    return (
      <ul class="ml-4 flex flex-col list-disc gap-1">
        <For each={uniqueErrors}>
          {(error) => <li>{error.message}</li>}
        </For>
      </ul>
    );
  });

  return (
    <Show when={content()}>
      <Polymorphic<FieldErrorProps>
        as="div"
        role="alert"
        data-slot="field-error"
        class={cn(
          "font-normal text-destructive text-sm",
          local.class,
        )}
        {...others}
      >
        {content()}
      </Polymorphic>
    </Show>
  );
};

export {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
};

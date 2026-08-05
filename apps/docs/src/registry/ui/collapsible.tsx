import * as CollapsiblePrimitive from "@kobalte/core/collapsible";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import type { ValidComponent } from "solid-js";

const Collapsible = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, CollapsiblePrimitive.CollapsibleRootProps<T>>,
) => {
  return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />;
};

const CollapsibleTrigger = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, CollapsiblePrimitive.CollapsibleTriggerProps<T>>,
) => {
  return (
    <CollapsiblePrimitive.Trigger data-slot="collapsible-trigger" {...props} />
  );
};

const CollapsibleContent = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, CollapsiblePrimitive.CollapsibleContentProps<T>>,
) => {
  return (
    <CollapsiblePrimitive.Content data-slot="collapsible-content" {...props} />
  );
};

export { Collapsible, CollapsibleContent, CollapsibleTrigger };

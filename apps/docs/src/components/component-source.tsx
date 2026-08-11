import { CodeCollapsibleWrapper } from "~/components/code-collapsible-wrapper.tsx";

import type { Component, ComponentProps } from "solid-js";

interface ComponentSourceProps extends ComponentProps<"div"> {
  name?: string;
  src?: string;
}

const ComponentSource: Component<ComponentSourceProps> = (props) => {
  return (
    <CodeCollapsibleWrapper class={props.class}>
      {props.children}
    </CodeCollapsibleWrapper>
  );
};

export { ComponentSource };

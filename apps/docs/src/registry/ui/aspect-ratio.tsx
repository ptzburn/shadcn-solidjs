import type { Component, ComponentProps, JSX } from "solid-js";
import { mergeProps, splitProps } from "solid-js";

type AspectRatioProps = ComponentProps<"div"> & { ratio?: number };

const AspectRatio: Component<AspectRatioProps> = (rawProps) => {
  const props = mergeProps({ ratio: 1 / 1 }, rawProps);
  const [local, others] = splitProps(props, ["ratio", "style"]);
  const style = (): JSX.CSSProperties => ({
    ...(typeof local.style === "object" ? local.style : {}),
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  });
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        "padding-bottom": `${100 / local.ratio}%`,
      }}
    >
      <div data-slot="aspect-ratio" style={style()} {...others} />
    </div>
  );
};

export { AspectRatio };

import type { ComponentProps, JSX } from "@solidjs/web";
import type { Component } from "solid-js";
import { merge, omit } from "solid-js";

type AspectRatioProps = ComponentProps<"div"> & { ratio?: number };

const AspectRatio: Component<AspectRatioProps> = (rawProps) => {
  const props = merge({ ratio: 1 / 1 }, rawProps);
  const others = omit(props, "ratio", "style");
  const style = (): JSX.CSSProperties => ({
    ...(typeof props.style === "object" ? props.style : {}),
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
        "padding-bottom": `${100 / props.ratio}%`,
      }}
    >
      <div data-slot="aspect-ratio" style={style()} {...others} />
    </div>
  );
};

export { AspectRatio };

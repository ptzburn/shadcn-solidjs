// Solid 2 port of @shadcn/react/message-scroller (upstream commit 607e8a9,
// packages/react/src/message-scroller). Deliberate divergences from upstream:
// - Distributed as six registry files (message-scroller-{types,geometry,
//   controller,components,primitive}.ts(x) + the styled message-scroller.tsx),
//   not as an npm package.
// - useMessageScrollerScrollable / useMessageScrollerVisibility return Solid
//   accessors (read them in a tracked scope: scrollable().end).
// - MessageScrollerButton is polymorphic through Kobalte's `as`, not Base UI's
//   `render`.
// - Intrinsic attributes are lowercase (`tabindex`, `class`); `inert` is a
//   native boolean attribute.
// - A consumer `ref` on the Root is composed with the frame registration
//   (upstream lets a spread ref replace it).
// Everything else — module split, function names, ref-bag fields, branch order,
// data attributes — mirrors upstream so future upstream diffs apply mechanically.
import {
  MessageScroller as Root,
  MessageScrollerButton as Button,
  MessageScrollerContent as Content,
  MessageScrollerItem as Item,
  MessageScrollerProvider as Provider,
  MessageScrollerViewport as Viewport,
} from "./components.tsx";

const MessageScroller = {
  Provider,
  Root,
  Viewport,
  Content,
  Item,
  Button,
};

export { MessageScroller };

export {
  useMessageScroller,
  useMessageScrollerScrollable,
  useMessageScrollerVisibility,
} from "./components.tsx";

export type {
  MessageScrollerButtonDirection,
  MessageScrollerButtonProps,
  MessageScrollerContentProps,
  MessageScrollerDefaultScrollPosition,
  MessageScrollerItemProps,
  MessageScrollerProps,
  MessageScrollerProviderProps,
  MessageScrollerScrollable,
  MessageScrollerScrollAlign,
  MessageScrollerScrollOptions,
  MessageScrollerViewportProps,
  MessageScrollerVisibilityState,
} from "./types.ts";

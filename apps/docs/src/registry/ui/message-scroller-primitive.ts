import {
  MessageScroller as Root,
  MessageScrollerButton as Button,
  MessageScrollerContent as Content,
  MessageScrollerItem as Item,
  MessageScrollerProvider as Provider,
  MessageScrollerViewport as Viewport,
} from "./message-scroller-components.tsx";

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
} from "./message-scroller-components.tsx";

export type {
  MessageScrollerButtonProps,
  MessageScrollerContentProps,
  MessageScrollerItemProps,
  MessageScrollerViewportProps,
} from "./message-scroller-components.tsx";

export type {
  MessageScrollerButtonDirection,
  MessageScrollerDefaultScrollPosition,
  MessageScrollerProviderProps,
  MessageScrollerScrollable,
  MessageScrollerScrollAlign,
  MessageScrollerScrollOptions,
  MessageScrollerVisibilityState,
} from "./message-scroller-types.ts";

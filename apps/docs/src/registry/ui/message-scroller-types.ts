import type { ComponentProps, JSX } from "@solidjs/web";
import type { Accessor } from "solid-js";

const DEFAULT_SCROLL_EDGE_THRESHOLD = 8;

const DEFAULT_SCROLL_PREVIOUS_ITEM_PEEK = 64;

const DEFAULT_SCROLL_MARGIN = 0;

const SCROLL_POSITION_EPSILON = 0.5;

const AUTOSCROLLING_CLEAR_DELAY = 180;

const USER_SCROLL_KEYS = new Set([
  "ArrowDown",
  "ArrowUp",
  "End",
  "Home",
  "PageDown",
  "PageUp",
  " ",
]);

type MessageScrollerMode =
  | "following-bottom"
  | "free-scrolling"
  | "anchored-to-message"
  | "settling-jump";

type MessageScrollerDefaultScrollPosition = "start" | "end" | "last-anchor";

type MessageScrollerButtonDirection = "start" | "end";

type MessageScrollerScrollAlign = "start" | "center" | "end" | "nearest";

type MessageScrollerScrollOptions = {
  align?: MessageScrollerScrollAlign;
  behavior?: ScrollBehavior;
  scrollMargin?: number;
};

type MessageScrollerScrollable = {
  start: boolean;
  end: boolean;
};

type MessageScrollerVisibilityState = {
  currentAnchorId: string | null;
  visibleMessageIds: string[];
};

type Ref<T> = { current: T };

type MessageScrollerProviderProps = {
  children?: JSX.Element;
  autoScroll?: boolean;
  defaultScrollPosition?: MessageScrollerDefaultScrollPosition;
  scrollEdgeThreshold?: number;
  scrollPreviousItemPeek?: number;
  scrollMargin?: number;
};

type MessageScrollerProps = ComponentProps<"div">;

type MessageScrollerViewportProps = ComponentProps<"div"> & {
  preserveScrollOnPrepend?: boolean;
};

type MessageScrollerContentProps = ComponentProps<"div"> & {
  spacerClassName?: string;
};

type MessageScrollerItemProps = ComponentProps<"div"> & {
  messageId?: string;
  scrollAnchor?: boolean;
};

type MessageScrollerButtonProps = ComponentProps<"button"> & {
  behavior?: ScrollBehavior;
  direction?: MessageScrollerButtonDirection;
};

type MessageScrollerRegisterMessage = (
  messageId: string,
  element: HTMLElement | null,
  removedElement?: HTMLElement | null,
) => void;

type MessageScrollerContextValue = {
  handleContentChange: () => void;
  handleResize: () => void;
  addVisibilitySubscriber: () => void;
  removeVisibilitySubscriber: () => void;
  preserveScrollOnPrependRef: Ref<boolean>;
  scrollToEnd: (options?: MessageScrollerScrollOptions) => boolean;
  scrollToMessage: (
    messageId: string,
    options?: MessageScrollerScrollOptions,
  ) => boolean;
  scrollToStart: (options?: MessageScrollerScrollOptions) => boolean;
  setContentElement: (
    element: HTMLDivElement | null,
    removedElement?: HTMLDivElement | null,
  ) => void;
  setRootElement: (
    element: HTMLDivElement | null,
    removedElement?: HTMLDivElement | null,
  ) => void;
  setSpacerElement: (
    element: HTMLDivElement | null,
    removedElement?: HTMLDivElement | null,
  ) => void;
  setViewportElement: (
    element: HTMLDivElement | null,
    removedElement?: HTMLDivElement | null,
  ) => void;
  scrollableState: Accessor<MessageScrollerScrollable>;
  visibilityState: Accessor<MessageScrollerVisibilityState>;
  syncAfterScroll: () => void;
  userScrollIntent: () => void;
  viewportRef: Ref<HTMLDivElement | null>;
};

const EMPTY_MESSAGE_SCROLLER_SCROLLABLE: MessageScrollerScrollable = {
  start: false,
  end: false,
};

const EMPTY_VISIBLE_MESSAGE_IDS: string[] = [];

const EMPTY_MESSAGE_SCROLLER_VISIBILITY_STATE: MessageScrollerVisibilityState =
  {
    currentAnchorId: null,
    visibleMessageIds: EMPTY_VISIBLE_MESSAGE_IDS,
  };

export {
  AUTOSCROLLING_CLEAR_DELAY,
  DEFAULT_SCROLL_EDGE_THRESHOLD,
  DEFAULT_SCROLL_MARGIN,
  DEFAULT_SCROLL_PREVIOUS_ITEM_PEEK,
  EMPTY_MESSAGE_SCROLLER_SCROLLABLE,
  EMPTY_MESSAGE_SCROLLER_VISIBILITY_STATE,
  EMPTY_VISIBLE_MESSAGE_IDS,
  SCROLL_POSITION_EPSILON,
  USER_SCROLL_KEYS,
};

export type {
  MessageScrollerButtonDirection,
  MessageScrollerButtonProps,
  MessageScrollerContentProps,
  MessageScrollerContextValue,
  MessageScrollerDefaultScrollPosition,
  MessageScrollerItemProps,
  MessageScrollerMode,
  MessageScrollerProps,
  MessageScrollerProviderProps,
  MessageScrollerRegisterMessage,
  MessageScrollerScrollable,
  MessageScrollerScrollAlign,
  MessageScrollerScrollOptions,
  MessageScrollerViewportProps,
  MessageScrollerVisibilityState,
  Ref,
};

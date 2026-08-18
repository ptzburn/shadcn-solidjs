import type { Accessor, Setter } from "solid-js";
import {
  createEffect,
  createRenderEffect,
  createSignal,
  onCleanup,
  untrack,
} from "solid-js";
import {
  getContentBottom,
  getElementScrollTop,
  getElementTop,
  getElementViewportTop,
  getFirstVisibleMessageItem,
  getFlexGap,
  getLastScrollAnchor,
  getMaxScrollTop,
  getMessageScrollerItems,
  getMessageScrollerScrollable,
  getMessageScrollerVisibilityState,
  getNewScrollAnchor,
  getTailSpacerHeight,
  getUnanchoredScrollAnchor,
  hasMultipleNewScrollAnchors,
} from "./message-scroller-geometry.ts";
import {
  AUTOSCROLLING_CLEAR_DELAY,
  DEFAULT_SCROLL_EDGE_THRESHOLD,
  DEFAULT_SCROLL_MARGIN,
  DEFAULT_SCROLL_PREVIOUS_ITEM_PEEK,
  EMPTY_MESSAGE_SCROLLER_SCROLLABLE,
  EMPTY_MESSAGE_SCROLLER_VISIBILITY_STATE,
  SCROLL_POSITION_EPSILON,
} from "./message-scroller-types.ts";
import type {
  MessageScrollerContextValue,
  MessageScrollerDefaultScrollPosition,
  MessageScrollerMode,
  MessageScrollerProviderProps,
  MessageScrollerRegisterMessage,
  MessageScrollerScrollable,
  MessageScrollerScrollOptions,
  MessageScrollerVisibilityState,
  Ref,
} from "./message-scroller-types.ts";

function areScrollStatesEqual(
  current: MessageScrollerScrollable,
  next: MessageScrollerScrollable,
): boolean {
  return current.start === next.start && current.end === next.end;
}

function areVisibilityStatesEqual(
  current: MessageScrollerVisibilityState,
  next: MessageScrollerVisibilityState,
): boolean {
  if (current.currentAnchorId !== next.currentAnchorId) {
    return false;
  }

  if (current.visibleMessageIds.length !== next.visibleMessageIds.length) {
    return false;
  }

  return current.visibleMessageIds.every(
    (messageId, index) => messageId === next.visibleMessageIds[index],
  );
}

type MessageScrollerRefs = {
  autoScrollRef: Ref<boolean>;
  autoscrollingRef: Ref<boolean>;
  autoscrollingTimeoutRef: Ref<ReturnType<typeof setTimeout> | null>;
  streamingTurnRef: Ref<HTMLElement | null>;
  contentRef: Ref<HTMLDivElement | null>;
  defaultScrollPositionAppliedRef: Ref<boolean>;
  defaultScrollPositionRef: Ref<MessageScrollerDefaultScrollPosition>;
  firstItemRef: Ref<HTMLElement | null>;
  itemCountRef: Ref<number>;
  lastScrollTopRef: Ref<number>;
  messageElementsRef: Ref<Map<string, HTMLElement>>;
  modeRef: Ref<MessageScrollerMode>;
  pendingScrollFrameRef: Ref<number | null>;
  pendingScrollToMessageRef: Ref<
    { messageId: string; options?: MessageScrollerScrollOptions } | null
  >;
  prependRestoreRef: Ref<{ element: HTMLElement; viewportTop: number } | null>;
  preserveScrollOnPrependRef: Ref<boolean>;
  rootRef: Ref<HTMLDivElement | null>;
  scrollEdgeThresholdRef: Ref<number>;
  scrollMarginRef: Ref<number>;
  scrollPreviousItemPeekRef: Ref<number>;
  spacerGapRef: Ref<number>;
  spacerHeightRef: Ref<number>;
  spacerRef: Ref<HTMLDivElement | null>;
  stateFrameRef: Ref<number | null>;
  scrollableSnapshot: Ref<MessageScrollerScrollable>;
  scrollableState: Accessor<MessageScrollerScrollable>;
  setScrollableState: Setter<MessageScrollerScrollable>;
  viewportRef: Ref<HTMLDivElement | null>;
  visibilityFrameRef: Ref<number | null>;
  visibilityObserverRef: Ref<IntersectionObserver | null>;
  visibilityState: Accessor<MessageScrollerVisibilityState>;
  setVisibilityState: Setter<MessageScrollerVisibilityState>;
  visibleMessageIdsRef: Ref<Set<string>>;
  handledScrollAnchorsRef: Ref<WeakSet<HTMLElement>>;
};

function createMessageScrollerRefs(
  props: MessageScrollerProviderProps,
): MessageScrollerRefs {
  const autoScroll = untrack(() => props.autoScroll ?? false);
  const [scrollableState, setScrollableState] = createSignal<
    MessageScrollerScrollable
  >(EMPTY_MESSAGE_SCROLLER_SCROLLABLE, { equals: areScrollStatesEqual });
  const [visibilityState, setVisibilityState] = createSignal<
    MessageScrollerVisibilityState
  >(EMPTY_MESSAGE_SCROLLER_VISIBILITY_STATE, {
    equals: areVisibilityStatesEqual,
  });

  return {
    autoScrollRef: { current: autoScroll },
    autoscrollingRef: { current: false },
    autoscrollingTimeoutRef: { current: null },
    streamingTurnRef: { current: null },
    contentRef: { current: null },
    defaultScrollPositionAppliedRef: { current: false },
    defaultScrollPositionRef: {
      current: untrack(() => props.defaultScrollPosition ?? "end"),
    },
    firstItemRef: { current: null },
    itemCountRef: { current: 0 },
    lastScrollTopRef: { current: 0 },
    messageElementsRef: { current: new Map() },
    modeRef: { current: autoScroll ? "following-bottom" : "free-scrolling" },
    pendingScrollFrameRef: { current: null },
    pendingScrollToMessageRef: { current: null },
    prependRestoreRef: { current: null },
    preserveScrollOnPrependRef: { current: true },
    rootRef: { current: null },
    scrollEdgeThresholdRef: {
      current: untrack(
        () => props.scrollEdgeThreshold ?? DEFAULT_SCROLL_EDGE_THRESHOLD,
      ),
    },
    scrollMarginRef: {
      current: untrack(() => props.scrollMargin ?? DEFAULT_SCROLL_MARGIN),
    },
    scrollPreviousItemPeekRef: {
      current: untrack(
        () => props.scrollPreviousItemPeek ?? DEFAULT_SCROLL_PREVIOUS_ITEM_PEEK,
      ),
    },
    spacerGapRef: { current: 0 },
    spacerHeightRef: { current: 0 },
    spacerRef: { current: null },
    stateFrameRef: { current: null },
    scrollableSnapshot: { current: EMPTY_MESSAGE_SCROLLER_SCROLLABLE },
    scrollableState,
    setScrollableState,
    viewportRef: { current: null },
    visibilityFrameRef: { current: null },
    visibilityObserverRef: { current: null },
    visibilityState,
    setVisibilityState,
    visibleMessageIdsRef: { current: new Set() },
    handledScrollAnchorsRef: { current: new WeakSet() },
  };
}

function createMessageScrollerCommands({
  refs,
  commitScrollState,
  scheduleStateCommit,
  scheduleVisibilitySync,
}: {
  refs: MessageScrollerRefs;
  commitScrollState: () => void;
  scheduleStateCommit: () => void;
  scheduleVisibilitySync: () => void;
}): {
  flushPendingScrollToMessage: () => boolean;
  reanchorToAnchoredMessage: () => boolean;
  scrollToElement: (
    element: HTMLElement,
    options?: MessageScrollerScrollOptions,
    placement?: { keepPreviousPeek?: boolean },
  ) => boolean;
  scrollToEnd: (options?: MessageScrollerScrollOptions) => boolean;
  scrollToMessage: (
    messageId: string,
    options?: MessageScrollerScrollOptions,
  ) => boolean;
  scrollToStart: (options?: MessageScrollerScrollOptions) => boolean;
} {
  const {
    streamingTurnRef,
    autoScrollRef,
    autoscrollingRef,
    autoscrollingTimeoutRef,
    contentRef,
    defaultScrollPositionAppliedRef,
    itemCountRef,
    messageElementsRef,
    modeRef,
    pendingScrollToMessageRef,
    prependRestoreRef,
    scrollMarginRef,
    scrollPreviousItemPeekRef,
    spacerGapRef,
    spacerHeightRef,
    spacerRef,
    viewportRef,
  } = refs;

  const setAutoScrolling = (autoscrolling: boolean): void => {
    if (autoscrollingTimeoutRef.current !== null) {
      globalThis.clearTimeout(autoscrollingTimeoutRef.current);
      autoscrollingTimeoutRef.current = null;
    }

    if (autoscrollingRef.current !== autoscrolling) {
      autoscrollingRef.current = autoscrolling;
      commitScrollState();
    }

    if (autoscrolling) {
      autoscrollingTimeoutRef.current = globalThis.setTimeout(() => {
        autoscrollingTimeoutRef.current = null;
        autoscrollingRef.current = false;
        commitScrollState();
      }, AUTOSCROLLING_CLEAR_DELAY);
    }
  };

  const setTailSpacerHeight = (height: number): void => {
    const spacer = spacerRef.current;

    if (!spacer) {
      return;
    }

    const nextHeight = Math.max(0, Math.ceil(height));

    if (spacerHeightRef.current === nextHeight) {
      return;
    }

    spacerHeightRef.current = nextHeight;
    spacer.hidden = nextHeight === 0;
    spacer.style.height = `${nextHeight}px`;
    spacer.style.marginTop = nextHeight > 0 ? `${-spacerGapRef.current}px` : "";
  };

  const scrollToPosition = (
    scrollTop: number,
    {
      behavior = "auto",
      autoscrolling = false,
    }: { behavior?: ScrollBehavior; autoscrolling?: boolean } = {},
  ): void => {
    const viewport = viewportRef.current;

    if (!viewport) {
      return;
    }

    const nextScrollTop = Math.max(0, scrollTop);

    if (
      Math.abs(viewport.scrollTop - nextScrollTop) <= SCROLL_POSITION_EPSILON
    ) {
      viewport.scrollTop = nextScrollTop;
      commitScrollState();
      return;
    }

    if (autoscrolling) {
      setAutoScrolling(true);
    }

    viewport.scrollTo({
      top: nextScrollTop,
      behavior,
    });
    scheduleStateCommit();
  };

  const scrollToStart = (
    { behavior = "auto" }: MessageScrollerScrollOptions = {},
  ): boolean => {
    if (!viewportRef.current) {
      return false;
    }

    setTailSpacerHeight(0);
    streamingTurnRef.current = null;
    modeRef.current = "free-scrolling";
    scrollToPosition(0, { behavior });
    scheduleVisibilitySync();

    return true;
  };

  const scrollToEnd = (
    { behavior = "auto" }: MessageScrollerScrollOptions = {},
  ): boolean => {
    const viewport = viewportRef.current;

    if (!viewport) {
      return false;
    }

    setTailSpacerHeight(0);
    streamingTurnRef.current = null;
    modeRef.current = autoScrollRef.current
      ? "following-bottom"
      : "free-scrolling";
    scrollToPosition(getMaxScrollTop(viewport), {
      autoscrolling: true,
      behavior,
    });
    scheduleVisibilitySync();

    return true;
  };

  const scrollToElement = (
    element: HTMLElement,
    {
      align = "start",
      behavior = "auto",
      scrollMargin = scrollMarginRef.current,
    }: MessageScrollerScrollOptions = {},
    { keepPreviousPeek = false }: { keepPreviousPeek?: boolean } = {},
  ): boolean => {
    const content = contentRef.current;
    const viewport = viewportRef.current;

    if (!content || !viewport || !content.contains(element)) {
      return false;
    }

    const scrollTop = getElementScrollTop({
      align,
      element,
      scrollMargin: keepPreviousPeek
        ? scrollMargin + scrollPreviousItemPeekRef.current
        : scrollMargin,
      spacer: spacerRef.current,
      viewport,
    });

    const nextSpacerHeight = getTailSpacerHeight({
      content,
      scrollTop,
      spacer: spacerRef.current,
      viewport,
    });

    setTailSpacerHeight(nextSpacerHeight);
    prependRestoreRef.current = {
      element,
      viewportTop: getElementViewportTop(element, viewport),
    };

    modeRef.current = keepPreviousPeek
      ? "anchored-to-message"
      : "settling-jump";
    streamingTurnRef.current = keepPreviousPeek ? element : null;

    scrollToPosition(scrollTop, { behavior });
    scheduleVisibilitySync();

    return true;
  };

  const reanchorToAnchoredMessage = (): boolean => {
    const element = streamingTurnRef.current;

    if (
      !element ||
      !element.isConnected ||
      modeRef.current !== "anchored-to-message"
    ) {
      return false;
    }

    return scrollToElement(element, { align: "start" }, {
      keepPreviousPeek: true,
    });
  };

  const scrollToMessage = (
    messageId: string,
    options?: MessageScrollerScrollOptions,
  ): boolean => {
    const element = messageElementsRef.current.get(messageId);

    if (!element) {
      if (itemCountRef.current === 0) {
        pendingScrollToMessageRef.current = { messageId, options };
        defaultScrollPositionAppliedRef.current = true;

        return true;
      }

      return false;
    }

    defaultScrollPositionAppliedRef.current = true;

    if (scrollToElement(element, options)) {
      pendingScrollToMessageRef.current = null;
      return true;
    }

    pendingScrollToMessageRef.current = { messageId, options };

    return true;
  };

  const flushPendingScrollToMessage = (): boolean => {
    const pending = pendingScrollToMessageRef.current;

    if (!pending) {
      return false;
    }

    const element = messageElementsRef.current.get(pending.messageId);

    if (!element) {
      return false;
    }

    const handled = scrollToElement(element, pending.options);

    if (!handled) {
      return false;
    }

    pendingScrollToMessageRef.current = null;
    defaultScrollPositionAppliedRef.current = true;

    return true;
  };

  return {
    flushPendingScrollToMessage,
    reanchorToAnchoredMessage,
    scrollToElement,
    scrollToEnd,
    scrollToMessage,
    scrollToStart,
  };
}

function createMessageScrollerController(
  props: MessageScrollerProviderProps,
): {
  context: MessageScrollerContextValue;
  registerMessage: MessageScrollerRegisterMessage;
} {
  const refs = createMessageScrollerRefs(props);

  const {
    streamingTurnRef,
    autoScrollRef,
    autoscrollingRef,
    autoscrollingTimeoutRef,
    contentRef,
    defaultScrollPositionAppliedRef,
    defaultScrollPositionRef,
    firstItemRef,
    itemCountRef,
    lastScrollTopRef,
    messageElementsRef,
    modeRef,
    pendingScrollFrameRef,
    pendingScrollToMessageRef,
    prependRestoreRef,
    preserveScrollOnPrependRef,
    rootRef,
    scrollEdgeThresholdRef,
    scrollMarginRef,
    scrollPreviousItemPeekRef,
    spacerGapRef,
    spacerHeightRef,
    spacerRef,
    stateFrameRef,
    scrollableSnapshot,
    scrollableState,
    setScrollableState,
    viewportRef,
    visibilityFrameRef,
    visibilityObserverRef,
    visibilityState,
    setVisibilityState,
    visibleMessageIdsRef,
    handledScrollAnchorsRef,
  } = refs;

  let visibilitySubscriberCount = 0;
  const hasVisibilityListeners = (): boolean => visibilitySubscriberCount > 0;

  const writeStateAttributes = (state: MessageScrollerScrollable): void => {
    const root = rootRef.current;
    const viewport = viewportRef.current;
    const scrollable = [state.start && "start", state.end && "end"]
      .filter(Boolean)
      .join(" ");
    const autoScrolling = autoscrollingRef.current;

    for (const element of [root, viewport]) {
      if (!element) {
        continue;
      }

      if (scrollable) {
        element.setAttribute("data-scrollable", scrollable);
      } else {
        element.removeAttribute("data-scrollable");
      }

      element.toggleAttribute("data-autoscrolling", autoScrolling);
    }
  };

  const reconcileFollowMode = (scrollable: MessageScrollerScrollable): void => {
    const scrollTop = viewportRef.current?.scrollTop ?? 0;
    const scrolledUp =
      scrollTop < lastScrollTopRef.current - SCROLL_POSITION_EPSILON;

    lastScrollTopRef.current = scrollTop;

    if (
      autoScrollRef.current &&
      !scrollable.end &&
      modeRef.current !== "settling-jump" &&
      modeRef.current !== "anchored-to-message"
    ) {
      modeRef.current = "following-bottom";
    } else if (
      modeRef.current === "following-bottom" &&
      scrollable.end &&
      scrolledUp &&
      !autoscrollingRef.current
    ) {
      modeRef.current = "free-scrolling";
    }
  };

  const commitScrollState = (): void => {
    const nextState = getMessageScrollerScrollable({
      content: contentRef.current,
      scrollEdgeThreshold: scrollEdgeThresholdRef.current,
      spacer: spacerRef.current,
      viewport: viewportRef.current,
    });

    reconcileFollowMode(nextState);

    const publishedState = modeRef.current === "following-bottom"
      ? { ...nextState, end: false }
      : nextState;

    writeStateAttributes(publishedState);
    scrollableSnapshot.current = publishedState;
    setScrollableState(publishedState);
  };

  const scheduleStateCommit = (): void => {
    if (stateFrameRef.current !== null) {
      return;
    }

    stateFrameRef.current = globalThis.requestAnimationFrame(() => {
      stateFrameRef.current = null;
      commitScrollState();
    });
  };

  const scheduleVisibilitySync = (): void => {
    if (!hasVisibilityListeners()) {
      return;
    }

    if (visibilityFrameRef.current !== null) {
      return;
    }

    visibilityFrameRef.current = globalThis.requestAnimationFrame(() => {
      visibilityFrameRef.current = null;

      if (!hasVisibilityListeners()) {
        return;
      }

      setVisibilityState(
        getMessageScrollerVisibilityState({
          content: contentRef.current,
          scrollMargin: scrollMarginRef.current,
          scrollPreviousItemPeek: scrollPreviousItemPeekRef.current,
          spacer: spacerRef.current,
          viewport: viewportRef.current,
          visibleMessageIds: visibleMessageIdsRef.current,
        }),
      );
    });
  };

  const {
    flushPendingScrollToMessage,
    reanchorToAnchoredMessage,
    scrollToElement,
    scrollToEnd,
    scrollToMessage,
    scrollToStart,
  } = createMessageScrollerCommands({
    refs,
    commitScrollState,
    scheduleStateCommit,
    scheduleVisibilitySync,
  });

  const restorePrependedAnchor = (): boolean => {
    const anchor = prependRestoreRef.current;
    const viewport = viewportRef.current;

    if (!anchor || !viewport || !anchor.element.isConnected) {
      return false;
    }

    const nextViewportTop = getElementViewportTop(anchor.element, viewport);
    const delta = nextViewportTop - anchor.viewportTop;

    if (Math.abs(delta) <= SCROLL_POSITION_EPSILON) {
      return false;
    }

    viewport.scrollTop += delta;
    anchor.viewportTop = getElementViewportTop(anchor.element, viewport);
    scheduleStateCommit();
    scheduleVisibilitySync();

    return true;
  };

  const capturePrependAnchor = (): void => {
    const content = contentRef.current;
    const viewport = viewportRef.current;

    if (!content || !viewport) {
      prependRestoreRef.current = null;
      return;
    }

    const anchor = getFirstVisibleMessageItem({
      content,
      spacer: spacerRef.current,
      viewport,
    });

    prependRestoreRef.current = anchor
      ? {
        element: anchor,
        viewportTop: getElementViewportTop(anchor, viewport),
      }
      : null;
  };

  const schedulePendingScrollToMessageFlush = (): void => {
    if (pendingScrollFrameRef.current !== null) {
      return;
    }

    pendingScrollFrameRef.current = globalThis.requestAnimationFrame(() => {
      pendingScrollFrameRef.current = null;

      if (flushPendingScrollToMessage()) {
        capturePrependAnchor();
      }
    });
  };

  const applyDefaultScrollPosition = (): boolean => {
    const defaultScrollPosition = defaultScrollPositionRef.current;

    if (
      !defaultScrollPosition ||
      defaultScrollPositionAppliedRef.current ||
      itemCountRef.current === 0
    ) {
      return false;
    }

    let handled = false;

    if (defaultScrollPosition === "last-anchor") {
      const content = contentRef.current;
      const viewport = viewportRef.current;
      const anchor = content && viewport
        ? getLastScrollAnchor(
          getMessageScrollerItems(content, spacerRef.current),
        )
        : null;

      if (!content || !viewport || !anchor) {
        handled = scrollToEnd({ behavior: "auto" });
      } else {
        const anchorTop = getElementTop(anchor, viewport);
        const contentBottom = getContentBottom({
          content,
          spacer: spacerRef.current,
          viewport,
        });
        const lastTurnFits = contentBottom - anchorTop <= viewport.clientHeight;

        handled = lastTurnFits
          ? scrollToEnd({ behavior: "auto" })
          : scrollToElement(anchor, { align: "start" }, {
            keepPreviousPeek: true,
          });
      }
    } else {
      handled = defaultScrollPosition === "end"
        ? scrollToEnd({ behavior: "auto" })
        : scrollToStart({ behavior: "auto" });
    }

    if (!handled) {
      return false;
    }

    defaultScrollPositionAppliedRef.current = true;

    return true;
  };

  const handleContentChange = (): void => {
    const content = contentRef.current;

    if (!content) {
      return;
    }

    const items = getMessageScrollerItems(content, spacerRef.current);
    const previousItemCount = itemCountRef.current;
    const previousFirstItem = firstItemRef.current;

    itemCountRef.current = items.length;
    firstItemRef.current = items[0] ?? null;

    const reconcileScrollPosition = (): void => {
      if (flushPendingScrollToMessage()) {
        return;
      }

      if (previousItemCount === 0) {
        if (applyDefaultScrollPosition()) {
          return;
        }

        if (
          items.length > 0 &&
          autoScrollRef.current &&
          scrollToEnd({ behavior: "auto" })
        ) {
          return;
        }

        commitScrollState();
        scheduleVisibilitySync();
        return;
      }

      const previousFirstItemIndex = previousFirstItem
        ? items.indexOf(previousFirstItem)
        : -1;
      const didPrepend = preserveScrollOnPrependRef.current &&
        previousFirstItemIndex > 0;

      if (didPrepend) {
        restorePrependedAnchor();
        return;
      }

      if (items.length > previousItemCount) {
        const anchor = getNewScrollAnchor(items, previousItemCount);

        if (anchor) {
          if (
            autoScrollRef.current &&
            modeRef.current === "following-bottom" &&
            hasMultipleNewScrollAnchors(items, previousItemCount)
          ) {
            scrollToEnd({ behavior: "auto" });
            return;
          }

          scrollToElement(anchor, { align: "start" }, {
            keepPreviousPeek: true,
          });
          handledScrollAnchorsRef.current.add(anchor);
          return;
        }
      }

      if (items.length === previousItemCount) {
        const anchor = getUnanchoredScrollAnchor(
          items,
          handledScrollAnchorsRef.current,
        );

        if (anchor) {
          scrollToElement(anchor, { align: "start" }, {
            keepPreviousPeek: true,
          });
          handledScrollAnchorsRef.current.add(anchor);
          return;
        }
      }

      if (modeRef.current === "following-bottom" && autoScrollRef.current) {
        scrollToEnd({ behavior: "auto" });
      } else {
        commitScrollState();
        scheduleVisibilitySync();
      }
    };

    reconcileScrollPosition();
    capturePrependAnchor();
  };

  const handleResize = (): void => {
    if (modeRef.current === "following-bottom" && autoScrollRef.current) {
      scrollToEnd({ behavior: "auto" });
      return;
    }

    const previousSpacerHeight = spacerHeightRef.current;

    if (reanchorToAnchoredMessage()) {
      if (
        autoScrollRef.current &&
        previousSpacerHeight > 0 &&
        spacerHeightRef.current === 0
      ) {
        scrollToEnd({ behavior: "auto" });
      }

      return;
    }

    scheduleStateCommit();
    scheduleVisibilitySync();
  };

  const observeVisibility = (): void => {
    const viewport = viewportRef.current;

    if (!viewport || !hasVisibilityListeners()) {
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      scheduleVisibilitySync();
      return;
    }

    if (!visibilityObserverRef.current) {
      visibilityObserverRef.current = new IntersectionObserver(
        (entries): void => {
          for (const entry of entries) {
            const messageId = (entry.target as HTMLElement).dataset.messageId;

            if (!messageId) {
              continue;
            }

            if (entry.isIntersecting) {
              visibleMessageIdsRef.current.add(messageId);
            } else {
              visibleMessageIdsRef.current.delete(messageId);
            }
          }

          scheduleVisibilitySync();
        },
        {
          root: viewport,
          rootMargin: `${-(
            scrollMarginRef.current + scrollPreviousItemPeekRef.current
          )}px 0px 0px 0px`,
          threshold: [0, 0.01, 0.5, 1],
        },
      );
    }

    messageElementsRef.current.forEach((element): void => {
      visibilityObserverRef.current?.observe(element);
    });
    scheduleVisibilitySync();
  };

  const unobserveVisibility = (): void => {
    if (visibilityFrameRef.current !== null) {
      globalThis.cancelAnimationFrame(visibilityFrameRef.current);
      visibilityFrameRef.current = null;
    }

    visibilityObserverRef.current?.disconnect();
    visibilityObserverRef.current = null;
    visibleMessageIdsRef.current.clear();
    setVisibilityState(EMPTY_MESSAGE_SCROLLER_VISIBILITY_STATE);
  };

  const addVisibilitySubscriber = (): void => {
    visibilitySubscriberCount += 1;

    if (visibilitySubscriberCount === 1) {
      observeVisibility();
    }
  };

  const removeVisibilitySubscriber = (): void => {
    visibilitySubscriberCount = Math.max(0, visibilitySubscriberCount - 1);

    if (visibilitySubscriberCount === 0) {
      unobserveVisibility();
    }
  };

  const registerMessage: MessageScrollerRegisterMessage = (
    messageId,
    element,
    removedElement,
  ): void => {
    if (element) {
      messageElementsRef.current.set(messageId, element);
      visibilityObserverRef.current?.observe(element);
      scheduleVisibilitySync();

      if (pendingScrollToMessageRef.current?.messageId === messageId) {
        schedulePendingScrollToMessageFlush();
      }

      return;
    }

    if (
      removedElement &&
      messageElementsRef.current.get(messageId) === removedElement
    ) {
      messageElementsRef.current.delete(messageId);
      visibleMessageIdsRef.current.delete(messageId);
      visibilityObserverRef.current?.unobserve(removedElement);
      scheduleVisibilitySync();
    }
  };

  const userScrollIntent = (): void => {
    if (
      modeRef.current === "following-bottom" ||
      modeRef.current === "anchored-to-message" ||
      modeRef.current === "settling-jump"
    ) {
      streamingTurnRef.current = null;
      modeRef.current = "free-scrolling";
    }
  };

  const mirrorStateAttributes = (): void =>
    writeStateAttributes(scrollableSnapshot.current);

  const setRootElement = (
    element: HTMLDivElement | null,
    removedElement?: HTMLDivElement | null,
  ): void => {
    if (!element && removedElement && rootRef.current !== removedElement) {
      return;
    }

    rootRef.current = element;

    if (element) {
      mirrorStateAttributes();
    }
  };

  const setViewportElement = (
    element: HTMLDivElement | null,
    removedElement?: HTMLDivElement | null,
  ): void => {
    if (!element && removedElement && viewportRef.current !== removedElement) {
      return;
    }

    viewportRef.current = element;

    if (element) {
      mirrorStateAttributes();
    }
  };

  const setContentElement = (
    element: HTMLDivElement | null,
    removedElement?: HTMLDivElement | null,
  ): void => {
    if (!element && removedElement && contentRef.current !== removedElement) {
      return;
    }

    contentRef.current = element;
  };

  const setSpacerElement = (
    element: HTMLDivElement | null,
    removedElement?: HTMLDivElement | null,
  ): void => {
    if (!element && removedElement && spacerRef.current !== removedElement) {
      return;
    }

    spacerRef.current = element;
    spacerGapRef.current = getFlexGap(element?.parentElement ?? null);
  };

  const syncAfterScroll = (): void => {
    commitScrollState();
    scheduleVisibilitySync();
    capturePrependAnchor();
  };

  createRenderEffect(
    () => props.autoScroll ?? false,
    (autoScroll) => {
      autoScrollRef.current = autoScroll;
    },
  );
  createRenderEffect(
    () => props.scrollEdgeThreshold ?? DEFAULT_SCROLL_EDGE_THRESHOLD,
    (scrollEdgeThreshold) => {
      scrollEdgeThresholdRef.current = scrollEdgeThreshold;
    },
  );
  createRenderEffect(
    () => props.scrollMargin ?? DEFAULT_SCROLL_MARGIN,
    (scrollMargin) => {
      scrollMarginRef.current = scrollMargin;
    },
  );
  createRenderEffect(
    () => props.scrollPreviousItemPeek ?? DEFAULT_SCROLL_PREVIOUS_ITEM_PEEK,
    (scrollPreviousItemPeek) => {
      scrollPreviousItemPeekRef.current = scrollPreviousItemPeek;
    },
  );

  createRenderEffect(
    () => props.defaultScrollPosition ?? "end",
    (next, previous) => {
      defaultScrollPositionRef.current = next;

      if (previous !== undefined && previous !== next) {
        defaultScrollPositionAppliedRef.current = false;
      }
    },
  );

  createEffect(
    () => props.defaultScrollPosition ?? "end",
    () => {
      applyDefaultScrollPosition();
    },
  );

  createEffect(
    () => props.autoScroll ?? false,
    (autoScroll) => {
      if (
        autoScroll &&
        modeRef.current === "following-bottom" &&
        itemCountRef.current > 0
      ) {
        scrollToEnd({ behavior: "auto" });
        return;
      }

      commitScrollState();
    },
  );

  onCleanup((): void => {
    if (stateFrameRef.current !== null) {
      globalThis.cancelAnimationFrame(stateFrameRef.current);
      stateFrameRef.current = null;
    }

    if (visibilityFrameRef.current !== null) {
      globalThis.cancelAnimationFrame(visibilityFrameRef.current);
      visibilityFrameRef.current = null;
    }

    if (autoscrollingTimeoutRef.current !== null) {
      globalThis.clearTimeout(autoscrollingTimeoutRef.current);
      autoscrollingTimeoutRef.current = null;
    }

    if (pendingScrollFrameRef.current !== null) {
      globalThis.cancelAnimationFrame(pendingScrollFrameRef.current);
      pendingScrollFrameRef.current = null;
    }

    visibilityObserverRef.current?.disconnect();
    visibilityObserverRef.current = null;
  });

  const context: MessageScrollerContextValue = {
    handleContentChange,
    handleResize,
    addVisibilitySubscriber,
    removeVisibilitySubscriber,
    preserveScrollOnPrependRef,
    scrollToEnd,
    scrollToMessage,
    scrollToStart,
    setContentElement,
    setRootElement,
    setSpacerElement,
    setViewportElement,
    scrollableState,
    visibilityState,
    syncAfterScroll,
    userScrollIntent,
    viewportRef,
  };

  return { context, registerMessage };
}

export {
  areScrollStatesEqual,
  areVisibilityStatesEqual,
  createMessageScrollerCommands,
  createMessageScrollerController,
  createMessageScrollerRefs,
};
export type { MessageScrollerRefs };

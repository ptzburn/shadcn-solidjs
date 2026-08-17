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

// --- stores.ts: equality for the two reactive snapshots ----------------------

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

// --- use-message-scroller-refs.ts ------------------------------------------

// Shared mutable ref bag for one MessageScroller, closed over by both the
// controller and the commands so writes are visible across them without prop
// threading. scrollableState / visibilityState fan out reactively (the React
// useSyncExternalStore stores); scrollableSnapshot is the synchronous mirror
// (Solid 2 signal reads lag until flush, and mirrorStateAttributes needs the
// value now).
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

// Builds the per-instance ref bag once. Prop-derived fields start from the
// current prop values (one-time untracked reads); the controller keeps them
// fresh with render effects (the useLatest pattern).
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
    // The scrollTop seen by the previous state commit, so follow-release can
    // tell a reader scrolling up from content growing past the live edge.
    lastScrollTopRef: { current: 0 },
    messageElementsRef: { current: new Map() },
    modeRef: { current: autoScroll ? "following-bottom" : "free-scrolling" },
    pendingScrollFrameRef: { current: null },
    pendingScrollToMessageRef: { current: null },
    // The row to hold steady on the next prepend: the first visible row, or a
    // jump target seeded by scrollToElement. restorePrependedAnchor reads only
    // this.
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

// --- use-message-scroller-commands.ts --------------------------------------

// Imperative scroll primitives, split from the controller so the move mechanics
// live apart from the policy that decides when to run them. Each command resolves
// a target scrollTop and returns false when the viewport is not mounted yet.
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
    // Seed the prepend anchor with the jump target so a prepend that lands
    // before this scroll settles still preserves the jumped-to row; once it
    // settles, syncAfterScroll's capturePrependAnchor re-captures it from the
    // first visible row.
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

    // Re-run the placement so the tail spacer is recomputed for the new content
    // height and the turn is held at the reading line.
    return scrollToElement(element, { align: "start" }, {
      keepPreviousPeek: true,
    });
  };

  // The target row may not be mounted yet (e.g. an async-loaded transcript).
  // When it is missing the request is queued in pendingScrollToMessageRef and
  // flushed later — on registerMessage for that id, or on the next content
  // change. An explicit jump also marks the mount default as applied, so
  // defaultScrollPosition does not override it.
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

// --- use-message-scroller-controller.ts --------------------------------------

// Orchestrator. Decides when to scroll and delegates the moves to the commands;
// state and visibility commits are coalesced on a requestAnimationFrame and torn
// down on cleanup. Called from the provider's setup so the effects and
// onCleanup bind to its owner.
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

  // Reference count for visibility tracking so the observer stays lazy: it only
  // runs while at least one useMessageScrollerVisibility consumer is mounted
  // (the store's onFirstSubscribe/onLastUnsubscribe in the React original).
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

  // Owns the one follow-bottom transition: arm at the bottom, release on any
  // scroll away (including a scrollbar drag), suppressed during a programmatic
  // scroll so the auto-scroll animation cannot release itself. Arming also
  // skips the anchored-to-message hold: the tail spacer makes a freshly
  // anchored turn read as "at the end", and re-arming there would let the
  // first streamed chunk yank the reader off the anchor. The hold hands back
  // to following in handleResize, once the reply consumes the tail spacer.
  const reconcileFollowMode = (scrollable: MessageScrollerScrollable): void => {
    const scrollTop = viewportRef.current?.scrollTop ?? 0;
    // Content growing past the live edge also reads as "not at the end", but
    // only a scrollbar drag moves scrollTop up. Growth must not release
    // follow-output: the resize handler is coalesced onto a frame, so a state
    // commit can observe the grown content before follow catches up.
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

    // While follow-output is engaged the scroller is already closing any gap a
    // streamed chunk just opened, so publishing it as scrollable toward the
    // end would strobe the scroll button once per chunk. Reconcile runs on the
    // raw geometry first, so a commit that releases follow still publishes the
    // gap it released over.
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

      // A frame can outlive the last unsubscribe. Recomputing here would
      // overwrite the EMPTY snapshot that teardown just wrote, leaving a stale
      // value for the next subscriber to read.
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

    // Compare the anchor relative to the viewport, not to the content. Native
    // scroll anchoring leaves the viewport-relative position unchanged, so this
    // is a no-op where the browser already handled the prepend and only corrects
    // the scroll where it did not (e.g. Safari) — without trusting a capability
    // flag, which some engines report incorrectly.
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
        // A short last turn already fits below the anchor, so opening at the end
        // shows the whole turn without leaving a blank gap beneath it.
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

    // Reconcile the scroll position with the new content. Every path re-captures
    // the prepend anchor afterward, so each branch just returns.
    //
    // Branch order is load-bearing: first-content, prepended, appended, updated.
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
        // Prepended rows are not new appends. Restore the prior scroll position.
        // The restore is a no-op where native scroll anchoring already did it.
        restorePrependedAnchor();
        return;
      }

      if (items.length > previousItemCount) {
        const anchor = getNewScrollAnchor(items, previousItemCount);

        if (anchor) {
          // While the reader is following the live end, a batch of several
          // anchored turns arriving at once should keep following the end — not
          // yank back to anchor the first turn of the batch. A single new anchor
          // still moves to the top as usual.
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

      // Appends with no new anchor (and content-only updates) fall through here:
      // keep following the end if we still are, otherwise just recommit state.
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

    // Hold the anchored turn in place as content below it resizes (a reply
    // streaming in, or a transient marker collapsing) — otherwise the shrinking
    // content lets the browser clamp scrollTop and the turn drops.
    const previousSpacerHeight = spacerHeightRef.current;

    if (reanchorToAnchoredMessage()) {
      // The reply streaming below the anchor consumes the tail spacer as it
      // grows. Once the last of it is gone the reply has filled the viewport
      // and the reader is genuinely at the live edge, so autoScroll hands off
      // from the anchor hold to following the bottom. Requiring the >0 → 0
      // transition keeps a turn taller than the viewport (placed with no
      // spacer) held instead of yanked to the end.
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
          // Shrink the root's top edge to the anchoring line so a previous turn
          // peeking in the scrollMargin + peek band is not reported as visible,
          // keeping visibleMessageIds consistent with currentAnchorId. Captured
          // at observe time; a prop change rebuilds the observer on resubscribe.
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
    visibilitySubscriberCount -= 1;

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
      // A deliberate gesture releases auto-follow, turn-anchoring, and an
      // in-flight programmatic jump so re-pinning (and re-arming) never fights
      // the reader.
      streamingTurnRef.current = null;
      modeRef.current = "free-scrolling";
    }
  };

  // Reads the synchronous mirror, not the signal: a commit in the same task may
  // not have flushed yet.
  const mirrorStateAttributes = (): void =>
    writeStateAttributes(scrollableSnapshot.current);

  // Stores the node and mirrors the current state attributes once it attaches —
  // the React useElementRef ref-callback pattern.
  const setRootElement = (element: HTMLDivElement | null): void => {
    rootRef.current = element;

    if (element) {
      mirrorStateAttributes();
    }
  };

  const setViewportElement = (element: HTMLDivElement | null): void => {
    viewportRef.current = element;

    if (element) {
      mirrorStateAttributes();
    }
  };

  const setContentElement = (element: HTMLDivElement | null): void => {
    contentRef.current = element;
  };

  const setSpacerElement = (element: HTMLDivElement | null): void => {
    spacerRef.current = element;
    spacerGapRef.current = getFlexGap(element?.parentElement ?? null);
  };

  const syncAfterScroll = (): void => {
    commitScrollState();
    scheduleVisibilitySync();
    capturePrependAnchor();
  };

  // Mirror the latest prop values onto refs during render so the closures above
  // read fresh values without being recreated (the React useLatest pattern).
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

  // A defaultScrollPosition change re-arms the one-shot opening position (the
  // React render-time reset of the applied flag). Render effect so it lands
  // before the apply effect below in the same flush.
  createRenderEffect(
    () => props.defaultScrollPosition ?? "end",
    (next, previous) => {
      defaultScrollPositionRef.current = next;

      if (previous !== undefined && previous !== next) {
        defaultScrollPositionAppliedRef.current = false;
      }
    },
  );

  // Apply the opening position on mount and whenever defaultScrollPosition
  // changes (React's applyDefaultScrollPosition layout effect). Before the
  // first content change itemCountRef is 0 and this is a no-op; the content
  // change then applies it.
  createEffect(
    () => props.defaultScrollPosition ?? "end",
    () => {
      applyDefaultScrollPosition();
    },
  );

  // Follow the live end (or recommit) when autoScroll flips, matching the React
  // autoScroll layout effect.
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

import {
  createEffect,
  createRenderEffect,
  createSignal,
  on,
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
  EMPTY_MESSAGE_SCROLLER_SCROLLABLE,
  EMPTY_MESSAGE_SCROLLER_VISIBILITY_STATE,
  SCROLL_POSITION_EPSILON,
} from "./message-scroller-types.ts";
import type {
  MessageScrollerContextValue,
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

// Builds the headless controller for one MessageScroller: the imperative scroll
// engine plus the two reactive snapshots (scrollable edges and visibility) that
// fan out to consumers. Called from the provider's setup so onMount/onCleanup and
// the prop-mirroring effects bind to its owner.
function createMessageScrollerController(
  props: MessageScrollerProviderProps,
): {
  context: MessageScrollerContextValue;
  registerMessage: MessageScrollerRegisterMessage;
} {
  // Per-instance mutable ref bag. Solid runs this body once, so plain fields are
  // a stable home for imperative state shared across the closures below — the
  // role useRef played in the React original.
  const autoScrollRef: Ref<boolean> = {
    current: untrack(() => props.autoScroll ?? false),
  };
  const autoscrollingRef: Ref<boolean> = { current: false };
  const autoscrollingTimeoutRef: Ref<ReturnType<typeof setTimeout> | null> = {
    current: null,
  };
  const streamingTurnRef: Ref<HTMLElement | null> = { current: null };
  const contentRef: Ref<HTMLDivElement | null> = { current: null };
  const defaultScrollPositionAppliedRef: Ref<boolean> = { current: false };
  const defaultScrollPositionRef: Ref<
    NonNullable<MessageScrollerProviderProps["defaultScrollPosition"]>
  > = { current: untrack(() => props.defaultScrollPosition ?? "end") };
  const firstItemRef: Ref<HTMLElement | null> = { current: null };
  const itemCountRef: Ref<number> = { current: 0 };
  const messageElementsRef: Ref<Map<string, HTMLElement>> = {
    current: new Map(),
  };
  const modeRef: Ref<MessageScrollerMode> = {
    current: untrack(() => props.autoScroll ?? false)
      ? "following-bottom"
      : "free-scrolling",
  };
  const pendingScrollFrameRef: Ref<number | null> = { current: null };
  const pendingScrollToMessageRef: Ref<
    { messageId: string; options?: MessageScrollerScrollOptions } | null
  > = { current: null };
  const prependRestoreRef: Ref<
    { element: HTMLElement; viewportTop: number } | null
  > = { current: null };
  const preserveScrollOnPrependRef: Ref<boolean> = { current: true };
  const rootRef: Ref<HTMLDivElement | null> = { current: null };
  const scrollEdgeThresholdRef: Ref<number> = {
    current: untrack(() => props.scrollEdgeThreshold ?? 8),
  };
  const scrollMarginRef: Ref<number> = {
    current: untrack(() => props.scrollMargin ?? 0),
  };
  const scrollPreviousItemPeekRef: Ref<number> = {
    current: untrack(() => props.scrollPreviousItemPeek ?? 64),
  };
  const spacerGapRef: Ref<number> = { current: 0 };
  const spacerHeightRef: Ref<number> = { current: 0 };
  const spacerRef: Ref<HTMLDivElement | null> = { current: null };
  const stateFrameRef: Ref<number | null> = { current: null };
  const viewportRef: Ref<HTMLDivElement | null> = { current: null };
  const visibilityFrameRef: Ref<number | null> = { current: null };
  const visibilityObserverRef: Ref<IntersectionObserver | null> = {
    current: null,
  };
  const visibleMessageIdsRef: Ref<Set<string>> = { current: new Set() };
  const handledScrollAnchorsRef: Ref<WeakSet<HTMLElement>> = {
    current: new WeakSet(),
  };

  // Reactive snapshots. These replace the React useSyncExternalStore stores:
  // equality keeps them referentially stable so consumers only update on real
  // transitions.
  const [scrollableState, setScrollableState] = createSignal<
    MessageScrollerScrollable
  >(EMPTY_MESSAGE_SCROLLER_SCROLLABLE, { equals: areScrollStatesEqual });
  const [visibilityState, setVisibilityState] = createSignal<
    MessageScrollerVisibilityState
  >(EMPTY_MESSAGE_SCROLLER_VISIBILITY_STATE, {
    equals: areVisibilityStatesEqual,
  });

  // Reference count for visibility tracking so the observer stays lazy: it only
  // runs while at least one useMessageScrollerVisibility consumer is mounted.
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
  // scroll so the auto-scroll animation cannot release itself.
  const reconcileFollowMode = (scrollable: MessageScrollerScrollable): void => {
    if (
      autoScrollRef.current &&
      !scrollable.end &&
      modeRef.current !== "settling-jump"
    ) {
      modeRef.current = "following-bottom";
    } else if (
      modeRef.current === "following-bottom" &&
      scrollable.end &&
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
    writeStateAttributes(nextState);
    setScrollableState(nextState);
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

  // --- Imperative scroll primitives (the React use-message-scroller-commands) ---

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

  // --- Controller policy (the React use-message-scroller-controller) ---

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
    if (reanchorToAnchoredMessage()) {
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

  const mirrorStateAttributes = (): void =>
    writeStateAttributes(scrollableState());

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

  // Mirror the latest prop values onto refs each render so the closures above
  // read fresh values without being recreated (the React useLatest pattern).
  createRenderEffect((): void => {
    autoScrollRef.current = props.autoScroll ?? false;
  });
  createRenderEffect((): void => {
    scrollEdgeThresholdRef.current = props.scrollEdgeThreshold ?? 8;
  });
  createRenderEffect((): void => {
    scrollMarginRef.current = props.scrollMargin ?? 0;
  });
  createRenderEffect((): void => {
    scrollPreviousItemPeekRef.current = props.scrollPreviousItemPeek ?? 64;
  });

  // Re-applying the opening position when defaultScrollPosition changes mirrors
  // the React reset of the applied flag on prop change.
  let previousDefaultScrollPosition = untrack(
    () => props.defaultScrollPosition ?? "end",
  );
  createRenderEffect((): void => {
    const next = props.defaultScrollPosition ?? "end";
    defaultScrollPositionRef.current = next;

    if (previousDefaultScrollPosition !== next) {
      previousDefaultScrollPosition = next;
      defaultScrollPositionAppliedRef.current = false;
    }
  });

  // Apply the opening position on mount, and re-apply whenever
  // defaultScrollPosition changes. The reset createRenderEffect above runs first
  // in the same flush (clearing the applied flag), so this mirrors React's
  // applyDefaultScrollPosition layout effect that re-runs on the prop.
  createEffect(
    on(
      () => props.defaultScrollPosition,
      (): void => {
        applyDefaultScrollPosition();
      },
    ),
  );

  // Follow the live end (or recommit) when autoScroll flips, matching the React
  // autoScroll layout effect.
  createEffect((): void => {
    const autoScroll = props.autoScroll ?? false;

    if (
      autoScroll &&
      modeRef.current === "following-bottom" &&
      itemCountRef.current > 0
    ) {
      scrollToEnd({ behavior: "auto" });
      return;
    }

    commitScrollState();
  });

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
    observeVisibility,
    unobserveVisibility,
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

export { createMessageScrollerController };

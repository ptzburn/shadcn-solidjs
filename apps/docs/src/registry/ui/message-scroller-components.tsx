import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import { Polymorphic } from "@kobalte/core/polymorphic";

import { mergeRefs } from "@solid-primitives/refs";
import { createMessageScrollerController } from "./message-scroller-controller.ts";
import { USER_SCROLL_KEYS } from "./message-scroller-types.ts";
import type {
  MessageScrollerButtonDirection,
  MessageScrollerContextValue,
  MessageScrollerProviderProps,
  MessageScrollerRegisterMessage,
  MessageScrollerScrollable,
  MessageScrollerScrollOptions,
  MessageScrollerVisibilityState,
} from "./message-scroller-types.ts";
import type { Accessor, ComponentProps, JSX, ValidComponent } from "solid-js";
import {
  createContext,
  createEffect,
  createMemo,
  createRenderEffect,
  on,
  onCleanup,
  onMount,
  splitProps,
  untrack,
  useContext,
} from "solid-js";

// Invokes a Solid event-handler prop, supporting both the bare-function and the
// bound-array form that JSX.EventHandlerUnion allows.
function callEventHandler<T, E extends Event>(
  handler: JSX.EventHandlerUnion<T, E> | undefined,
  event: E & { currentTarget: T; target: Element },
): void {
  if (!handler) {
    return;
  }

  if (typeof handler === "function") {
    handler(event);
  } else {
    handler[0](handler[1], event);
  }
}

const MessageScrollerContext = createContext<
  MessageScrollerContextValue | null
>(null);
const MessageScrollerItemContext = createContext<
  MessageScrollerRegisterMessage | null
>(null);

function useMessageScrollerContext(): MessageScrollerContextValue {
  const context = useContext(MessageScrollerContext);

  if (!context) {
    throw new Error(
      "useMessageScroller must be used within a MessageScroller.",
    );
  }

  return context;
}

function useMessageScrollerItemContext(): MessageScrollerRegisterMessage {
  const context = useContext(MessageScrollerItemContext);

  if (!context) {
    throw new Error(
      "MessageScrollerItem must be used within a MessageScroller.",
    );
  }

  return context;
}

// Scroll commands usable from outside the message list. Returns stable function
// references — call them directly (e.g. onClick={() => scrollToEnd()}).
function useMessageScroller(): {
  scrollToEnd: (options?: MessageScrollerScrollOptions) => boolean;
  scrollToMessage: (
    messageId: string,
    options?: MessageScrollerScrollOptions,
  ) => boolean;
  scrollToStart: (options?: MessageScrollerScrollOptions) => boolean;
} {
  const context = useMessageScrollerContext();

  return {
    scrollToEnd: context.scrollToEnd,
    scrollToMessage: context.scrollToMessage,
    scrollToStart: context.scrollToStart,
  };
}

// Which edges the viewport can still scroll toward. Solid returns an accessor:
// read it reactively, e.g. useMessageScrollerScrollable()().end.
function useMessageScrollerScrollable(): Accessor<MessageScrollerScrollable> {
  return useMessageScrollerContext().scrollableState;
}

// The anchored turn and visible message ids. Returns an accessor; subscribing
// (calling the hook) lazily starts visibility tracking and stops it on cleanup.
function useMessageScrollerVisibility(): Accessor<
  MessageScrollerVisibilityState
> {
  const context = useMessageScrollerContext();

  // Guard against an unmatched cleanup (a consumer disposed before its onMount
  // flushes, or SSR where onMount never runs) so the subscriber count cannot
  // drift below zero and silently disable tracking for the next subscriber.
  let subscribed = false;

  onMount((): void => {
    subscribed = true;
    context.addVisibilitySubscriber();
  });
  onCleanup((): void => {
    if (subscribed) {
      context.removeVisibilitySubscriber();
    }
  });

  return context.visibilityState;
}

// Headless root. Owns scroll state, anchoring, auto-follow, and visibility;
// renders no DOM of its own.
function MessageScrollerProvider(
  props: MessageScrollerProviderProps,
): JSX.Element {
  const { context, registerMessage } = createMessageScrollerController(props);

  return (
    <MessageScrollerContext.Provider value={context}>
      <MessageScrollerItemContext.Provider value={registerMessage}>
        {props.children}
      </MessageScrollerItemContext.Provider>
    </MessageScrollerContext.Provider>
  );
}

// Frame container. Must render inside a MessageScrollerProvider.
function MessageScroller(props: ComponentProps<"div">): JSX.Element {
  const context = useMessageScrollerContext();
  const [local, others] = splitProps(props, ["ref", "children"]);

  onCleanup((): void => context.setRootElement(null));

  return (
    <div
      // A consumer ref replaces root registration entirely, matching the
      // upstream spread-override semantics (`<div ref={setRootElement} {...props}>`).
      ref={local.ref ?? context.setRootElement}
      {...others}
    >
      {local.children}
    </div>
  );
}

type MessageScrollerViewportProps = ComponentProps<"div"> & {
  // Keep the first visible messageId row stable on prepend. Defaults to true.
  preserveScrollOnPrepend?: boolean;
};

// Scrollable frame. Owns native scroll events and prepend preservation.
function MessageScrollerViewport(
  props: MessageScrollerViewportProps,
): JSX.Element {
  const context = useMessageScrollerContext();
  const [local, others] = splitProps(props, [
    "ref",
    "children",
    "preserveScrollOnPrepend",
    "onScroll",
    "onWheel",
    "onTouchMove",
    "onKeyDown",
    "role",
    "aria-label",
    "tabindex",
    "tabIndex",
  ]);

  createRenderEffect((): void => {
    context.preserveScrollOnPrependRef.current =
      local.preserveScrollOnPrepend ??
        true;
  });

  const handleScroll: JSX.EventHandler<HTMLDivElement, Event> = (
    event,
  ): void => {
    context.syncAfterScroll();
    callEventHandler(local.onScroll, event);
  };

  // React attaches wheel listeners passively at the root, so upstream never
  // blocks scrolling on this handler (a consumer preventDefault is inert);
  // bound below via on:wheel with { passive: true } to match.
  const handleWheel = (event: Event): void => {
    context.userScrollIntent();
    callEventHandler(
      local.onWheel,
      event as WheelEvent & { currentTarget: HTMLDivElement; target: Element },
    );
  };

  const handleTouchMove: JSX.EventHandler<HTMLDivElement, TouchEvent> = (
    event,
  ): void => {
    context.userScrollIntent();
    callEventHandler(local.onTouchMove, event);
  };

  const handleKeyDown: JSX.EventHandler<HTMLDivElement, KeyboardEvent> = (
    event,
  ): void => {
    if (USER_SCROLL_KEYS.has(event.key)) {
      context.userScrollIntent();
    }

    callEventHandler(local.onKeyDown, event);
  };

  onMount((): void => {
    const viewport = context.viewportRef.current;

    if (!viewport || typeof ResizeObserver === "undefined") {
      return;
    }

    const observer = new ResizeObserver(context.handleResize);

    observer.observe(viewport);

    onCleanup((): void => observer.disconnect());
  });

  onCleanup((): void => context.setViewportElement(null));

  return (
    <div
      ref={mergeRefs(context.setViewportElement, local.ref)}
      role={local.role ?? "region"}
      aria-label={local["aria-label"] ?? "Messages"}
      tabindex={local.tabIndex ?? local.tabindex ?? 0}
      onKeyDown={handleKeyDown}
      onScroll={handleScroll}
      onTouchMove={handleTouchMove}
      on:wheel={{ passive: true, handleEvent: handleWheel }}
      {...others}
    >
      {local.children}
    </div>
  );
}

type MessageScrollerContentProps = ComponentProps<"div"> & {
  // Class name for the internal tail spacer used when anchoring turns near the top.
  spacerClassName?: string;
};

// Transcript container. Defaults role="log" + aria-relevant="additions".
function MessageScrollerContent(
  props: MessageScrollerContentProps,
): JSX.Element {
  const context = useMessageScrollerContext();
  const [local, others] = splitProps(props, [
    "ref",
    "children",
    "role",
    "aria-relevant",
    "spacerClassName",
  ]);

  let contentNode: HTMLDivElement | undefined;
  let spacerNode: HTMLDivElement | undefined;

  const setContent = mergeRefs((element: HTMLDivElement): void => {
    contentNode = element;
    context.setContentElement(element);
  }, local.ref);

  const setSpacer = (element: HTMLDivElement): void => {
    spacerNode = element;
    context.setSpacerElement(element);
  };

  onMount((): void => {
    const content = contentNode;

    if (!content) {
      return;
    }

    // Solid refs fire before the subtree is attached, where computed styles
    // read empty; re-register the spacer once connected so its flex gap is
    // captured (React refs run at commit time, on a connected node).
    context.setSpacerElement(spacerNode ?? null);

    context.handleContentChange();

    if (typeof MutationObserver !== "undefined") {
      const observer = new MutationObserver((): void => {
        context.handleContentChange();
      });

      observer.observe(content, { childList: true });

      onCleanup((): void => observer.disconnect());
    }

    if (typeof ResizeObserver !== "undefined") {
      const resizeObserver = new ResizeObserver(context.handleResize);

      resizeObserver.observe(content);

      onCleanup((): void => resizeObserver.disconnect());
    }
  });

  onCleanup((): void => {
    contentNode = undefined;
    context.setContentElement(null);
    context.setSpacerElement(null);
  });

  return (
    <div
      ref={setContent}
      role={local.role ?? "log"}
      aria-relevant={local["aria-relevant"] ?? "additions"}
      {...others}
    >
      {local.children}
      <div
        ref={setSpacer}
        aria-hidden="true"
        data-message-scroller-spacer=""
        hidden
        class={local.spacerClassName}
      />
    </div>
  );
}

type MessageScrollerItemProps = ComponentProps<"div"> & {
  // Stable row id for scrollToMessage, visibility, and prepend preservation.
  messageId?: string;
  // Marks a turn boundary that newly appended anchors and last-anchor restore use.
  scrollAnchor?: boolean;
};

// One transcript row: a message, marker, typing row, separator, or load-more row.
function MessageScrollerItem(props: MessageScrollerItemProps): JSX.Element {
  const registerMessage = useMessageScrollerItemContext();
  const [local, others] = splitProps(props, [
    "ref",
    "messageId",
    "scrollAnchor",
  ]);

  let itemNode: HTMLDivElement | undefined;

  // Register at ref time — Solid refs run during render, mirroring React's
  // commit-time ref attach, so the message map is already populated when
  // Content's onMount runs the first handleContentChange (which may flush a
  // queued scrollToMessage synchronously).
  const setItem = mergeRefs((element: HTMLDivElement): void => {
    const previousElement = itemNode ?? null;

    itemNode = element;

    const messageId = untrack((): string | undefined => local.messageId);

    if (messageId) {
      registerMessage(messageId, element, previousElement);
    }
  }, local.ref);

  // A messageId change re-registers the row under the new id (upstream gets
  // this from React re-invoking the recreated ref callback).
  createEffect(
    on(
      (): string | undefined => local.messageId,
      (messageId, previousMessageId): void => {
        const element = itemNode;

        if (!element) {
          return;
        }

        if (previousMessageId) {
          registerMessage(previousMessageId, null, element);
        }

        if (messageId) {
          registerMessage(messageId, element, null);
        }
      },
      { defer: true },
    ),
  );

  onCleanup((): void => {
    const messageId = local.messageId;

    if (messageId && itemNode) {
      registerMessage(messageId, null, itemNode);
    }
  });

  return (
    <div
      ref={setItem}
      data-message-id={local.messageId}
      data-scroll-anchor={local.scrollAnchor ? "true" : "false"}
      {...others}
    />
  );
}

type MessageScrollerButtonProps = ComponentProps<"button"> & {
  // Native scroll behavior when clicked. Defaults to "smooth".
  behavior?: ScrollBehavior;
  // Transcript edge to scroll toward. Defaults to "end".
  direction?: MessageScrollerButtonDirection;
};

// Scroll-to-end/start control. Inert until there is content in its direction.
function MessageScrollerButton<T extends ValidComponent = "button">(
  props: PolymorphicProps<T, MessageScrollerButtonProps>,
): JSX.Element {
  const context = useMessageScrollerContext();
  const [local, others] = splitProps(
    props as MessageScrollerButtonProps & { as?: ValidComponent },
    [
      "as",
      "behavior",
      "children",
      "direction",
      "onClick",
      "tabindex",
      "tabIndex",
      "type",
    ],
  );

  const direction = (): MessageScrollerButtonDirection =>
    local.direction ?? "end";
  const behavior = (): ScrollBehavior => local.behavior ?? "smooth";
  const isActive = createMemo((): boolean => {
    const state = context.scrollableState();

    return direction() === "start" ? state.start : state.end;
  });

  const handleClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (
    event,
  ): void => {
    if (!isActive()) {
      return;
    }

    callEventHandler(local.onClick, event);

    if (!event.defaultPrevented) {
      (event.currentTarget as HTMLElement).blur();

      if (direction() === "start") {
        context.scrollToStart({ behavior: behavior() });
      } else {
        context.scrollToEnd({ behavior: behavior() });
      }
    }
  };

  return (
    <Polymorphic
      as={local.as ?? "button"}
      type={local.type ?? "button"}
      inert={!isActive() ? true : undefined}
      tabindex={isActive() ? (local.tabIndex ?? local.tabindex) : -1}
      data-active={isActive() ? "true" : "false"}
      data-direction={direction()}
      onClick={handleClick}
      {...others}
    >
      {local.children ?? <span>Scroll to {direction()}</span>}
    </Polymorphic>
  );
}

export {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
  useMessageScroller,
  useMessageScrollerScrollable,
  useMessageScrollerVisibility,
};
export type {
  MessageScrollerButtonProps,
  MessageScrollerContentProps,
  MessageScrollerItemProps,
  MessageScrollerViewportProps,
};

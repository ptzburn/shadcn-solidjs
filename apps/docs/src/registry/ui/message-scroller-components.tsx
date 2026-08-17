import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import { Polymorphic } from "@kobalte/core/polymorphic";
import type { JSX, ValidComponent } from "@solidjs/web";
import type { Accessor } from "solid-js";
import {
  createContext,
  createEffect,
  createMemo,
  createRenderEffect,
  omit,
  onCleanup,
  onSettled,
  useContext,
} from "solid-js";
import { createMessageScrollerController } from "./message-scroller-controller.ts";
import { USER_SCROLL_KEYS } from "./message-scroller-types.ts";
import type {
  MessageScrollerButtonDirection,
  MessageScrollerButtonProps,
  MessageScrollerContentProps,
  MessageScrollerContextValue,
  MessageScrollerItemProps,
  MessageScrollerProps,
  MessageScrollerProviderProps,
  MessageScrollerRegisterMessage,
  MessageScrollerScrollable,
  MessageScrollerScrollOptions,
  MessageScrollerViewportProps,
  MessageScrollerVisibilityState,
} from "./message-scroller-types.ts";

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

// Scroll commands usable from outside the message list. Plain stable functions
// — call them directly (e.g. onClick={() => scrollToEnd()}).
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

// Which edges the viewport can still scroll toward. Returns an accessor: read
// it in a tracked scope, e.g. useMessageScrollerScrollable()().end.
function useMessageScrollerScrollable(): Accessor<MessageScrollerScrollable> {
  return useMessageScrollerContext().scrollableState;
}

// The anchored turn and visible message ids. Returns an accessor; calling the
// hook lazily starts visibility tracking once the caller settles and stops it
// when the caller is disposed (the store's ref-counted subscribe upstream).
function useMessageScrollerVisibility(): Accessor<
  MessageScrollerVisibilityState
> {
  const context = useMessageScrollerContext();

  onSettled(() => {
    context.addVisibilitySubscriber();

    return () => context.removeVisibilitySubscriber();
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
    <MessageScrollerContext value={context}>
      <MessageScrollerItemContext value={registerMessage}>
        {props.children}
      </MessageScrollerItemContext>
    </MessageScrollerContext>
  );
}

// Frame container. Must render inside a MessageScrollerProvider. A consumer ref
// is composed with the root registration (upstream lets a spread ref replace
// it, which silently drops the state attributes on the frame).
function MessageScroller(props: MessageScrollerProps): JSX.Element {
  const context = useMessageScrollerContext();
  const others = omit(props, "ref", "children");

  onCleanup((): void => context.setRootElement(null));

  return (
    <div ref={[context.setRootElement, props.ref]} {...others}>
      {props.children}
    </div>
  );
}

// Scrollable frame. Owns native scroll events and prepend preservation.
function MessageScrollerViewport(
  props: MessageScrollerViewportProps,
): JSX.Element {
  const context = useMessageScrollerContext();
  const others = omit(
    props,
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
  );

  createRenderEffect(
    () => props.preserveScrollOnPrepend ?? true,
    (preserveScrollOnPrepend) => {
      context.preserveScrollOnPrependRef.current = preserveScrollOnPrepend;
    },
  );

  const handleScroll: JSX.EventHandler<HTMLDivElement, Event> = (event) => {
    context.syncAfterScroll();
    callEventHandler(props.onScroll, event);
  };

  // React attaches wheel listeners passively at the root, so upstream never
  // blocks scrolling on this handler (a consumer preventDefault is inert).
  // Solid 2 has no on: namespace, so the passive native listener is attached
  // through the ref below.
  const handleWheel = (event: WheelEvent): void => {
    context.userScrollIntent();
    callEventHandler(
      props.onWheel,
      event as WheelEvent & { currentTarget: HTMLDivElement; target: Element },
    );
  };

  // Deliberately never removed: the listener dies with the element when it
  // is disconnected, and onCleanup cannot run inside a ref (refs run under a
  // null owner).
  const attachWheelListener = (element: HTMLDivElement): void => {
    element.addEventListener("wheel", handleWheel, { passive: true });
  };

  const handleTouchMove: JSX.EventHandler<HTMLDivElement, TouchEvent> = (
    event,
  ) => {
    context.userScrollIntent();
    callEventHandler(props.onTouchMove, event);
  };

  const handleKeyDown: JSX.EventHandler<HTMLDivElement, KeyboardEvent> = (
    event,
  ) => {
    if (USER_SCROLL_KEYS.has(event.key)) {
      context.userScrollIntent();
    }

    callEventHandler(props.onKeyDown, event);
  };

  onSettled(() => {
    const viewport = context.viewportRef.current;

    if (!viewport || typeof ResizeObserver === "undefined") {
      return;
    }

    // Coalesce into rAF: handleResize mutates the spacer inside the observed
    // content, and resizing an observed element during delivery fires
    // "ResizeObserver loop completed with undelivered notifications".
    let frame = 0;

    const observer = new ResizeObserver(() => {
      globalThis.cancelAnimationFrame(frame);
      frame = globalThis.requestAnimationFrame(context.handleResize);
    });

    observer.observe(viewport);

    return () => {
      globalThis.cancelAnimationFrame(frame);
      observer.disconnect();
    };
  });

  onCleanup((): void => context.setViewportElement(null));

  return (
    <div
      ref={[context.setViewportElement, attachWheelListener, props.ref]}
      role={props.role ?? "region"}
      aria-label={props["aria-label"] ?? "Messages"}
      tabindex={props.tabindex ?? 0}
      onKeyDown={handleKeyDown}
      onScroll={handleScroll}
      onTouchMove={handleTouchMove}
      {...others}
    >
      {props.children}
    </div>
  );
}

// Transcript container. Defaults role="log" + aria-relevant="additions".
function MessageScrollerContent(
  props: MessageScrollerContentProps,
): JSX.Element {
  const context = useMessageScrollerContext();
  const others = omit(
    props,
    "ref",
    "children",
    "role",
    "aria-relevant",
    "spacerClassName",
  );

  let contentNode: HTMLDivElement | undefined;
  let spacerNode: HTMLDivElement | undefined;

  const setContent = (element: HTMLDivElement): void => {
    contentNode = element;
    context.setContentElement(element);
  };

  const setSpacer = (element: HTMLDivElement): void => {
    spacerNode = element;
    context.setSpacerElement(element);
  };

  onSettled(() => {
    const content = contentNode;

    if (!content) {
      return;
    }

    // Solid refs fire before the subtree is attached, where computed styles
    // read empty; re-register the spacer once connected so its flex gap is
    // captured (React refs run at commit time, on a connected node).
    context.setSpacerElement(spacerNode ?? null);

    context.handleContentChange();

    const cleanups: Array<() => void> = [];

    if (typeof MutationObserver !== "undefined") {
      const observer = new MutationObserver((): void => {
        context.handleContentChange();
      });

      observer.observe(content, { childList: true });
      cleanups.push(() => observer.disconnect());
    }

    if (typeof ResizeObserver !== "undefined") {
      // Coalesce into rAF: handleResize mutates the spacer inside this observed
      // element, and resizing an observed element during delivery fires
      // "ResizeObserver loop completed with undelivered notifications".
      let frame = 0;

      const resizeObserver = new ResizeObserver(() => {
        globalThis.cancelAnimationFrame(frame);
        frame = globalThis.requestAnimationFrame(context.handleResize);
      });

      resizeObserver.observe(content);
      cleanups.push(() => {
        globalThis.cancelAnimationFrame(frame);
        resizeObserver.disconnect();
      });
    }

    return () => {
      for (const cleanup of cleanups) {
        cleanup();
      }
    };
  });

  onCleanup((): void => {
    contentNode = undefined;
    spacerNode = undefined;
    context.setContentElement(null);
    context.setSpacerElement(null);
  });

  return (
    <div
      ref={[setContent, props.ref]}
      role={props.role ?? "log"}
      aria-relevant={props["aria-relevant"] ?? "additions"}
      {...others}
    >
      {props.children}
      <div
        ref={setSpacer}
        aria-hidden="true"
        data-message-scroller-spacer=""
        hidden
        class={props.spacerClassName}
      />
    </div>
  );
}

// One transcript row: a message, marker, typing row, separator, or load-more row.
function MessageScrollerItem(props: MessageScrollerItemProps): JSX.Element {
  const registerMessage = useMessageScrollerItemContext();
  const others = omit(props, "ref", "messageId", "scrollAnchor");

  let itemNode: HTMLDivElement | undefined;
  // The id currently registered with the controller (what onCleanup must
  // release). Tracked explicitly: a `defer: true` effect receives no
  // previous value on its first run, so it cannot tell us the old id.
  let registeredMessageId: string | undefined;

  // Register at ref time — Solid refs run during render (untracked, under a
  // null owner), mirroring React's commit-time ref attach, so the message
  // map is already populated when Content's onSettled runs the first
  // handleContentChange (which may flush a queued scrollToMessage
  // synchronously).
  const setItem = (element: HTMLDivElement): void => {
    itemNode = element;

    const messageId = props.messageId;

    if (messageId) {
      registerMessage(messageId, element, null);
      registeredMessageId = messageId;
    }
  };

  // A messageId change re-registers the row under the new id (upstream gets
  // this from React re-invoking the recreated ref callback).
  createEffect(
    (): string | undefined => props.messageId,
    (messageId): void => {
      const element = itemNode;

      if (!element || messageId === registeredMessageId) {
        return;
      }

      if (registeredMessageId) {
        registerMessage(registeredMessageId, null, element);
      }

      if (messageId) {
        registerMessage(messageId, element, null);
      }

      registeredMessageId = messageId;
    },
    { defer: true },
  );

  onCleanup((): void => {
    if (registeredMessageId && itemNode) {
      registerMessage(registeredMessageId, null, itemNode);
    }
  });

  return (
    <div
      ref={[setItem, props.ref]}
      data-message-id={props.messageId}
      data-scroll-anchor={props.scrollAnchor ? "true" : "false"}
      {...others}
    />
  );
}

// Scroll-to-end/start control. Inert until there is content in its direction.
// Polymorphic via Kobalte's `as` (upstream: Base UI `render`).
function MessageScrollerButton<T extends ValidComponent = "button">(
  props: PolymorphicProps<T, MessageScrollerButtonProps>,
): JSX.Element {
  const context = useMessageScrollerContext();
  const local = props as MessageScrollerButtonProps & { as?: ValidComponent };
  const others = omit(
    local,
    "as",
    "behavior",
    "children",
    "direction",
    "onClick",
    "tabindex",
    "type",
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
  ) => {
    if (!isActive()) {
      return;
    }

    callEventHandler(local.onClick, event);

    if (!event.defaultPrevented) {
      event.currentTarget.blur();

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
      inert={!isActive()}
      tabindex={isActive() ? local.tabindex : -1}
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

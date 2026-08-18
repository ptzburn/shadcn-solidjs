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
  untrack,
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

function useMessageScrollerScrollable(): Accessor<MessageScrollerScrollable> {
  return useMessageScrollerContext().scrollableState;
}

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

function MessageScroller(props: MessageScrollerProps): JSX.Element {
  const context = useMessageScrollerContext();
  const others = omit(props, "ref", "children");

  let rootNode: HTMLDivElement | undefined;

  const setRoot = (element: HTMLDivElement): void => {
    rootNode = element;
    context.setRootElement(element);
  };

  onCleanup((): void => context.setRootElement(null, rootNode));

  return (
    <div ref={[setRoot, props.ref]} {...others}>
      {props.children}
    </div>
  );
}

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

  const handleWheel = (event: WheelEvent): void => {
    context.userScrollIntent();
    callEventHandler(
      props.onWheel,
      event as WheelEvent & { currentTarget: HTMLDivElement; target: Element },
    );
  };

  const attachWheelListener = (element: HTMLDivElement): void => {
    element.addEventListener("wheel", handleWheel, { passive: true });
  };

  let viewportNode: HTMLDivElement | undefined;

  const setViewport = (element: HTMLDivElement): void => {
    viewportNode = element;
    context.setViewportElement(element);
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
    const viewport = viewportNode;

    if (!viewport || typeof ResizeObserver === "undefined") {
      return;
    }

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

  onCleanup((): void => context.setViewportElement(null, viewportNode));

  return (
    <div
      ref={[setViewport, attachWheelListener, props.ref]}
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
    context.setContentElement(null, contentNode);
    context.setSpacerElement(null, spacerNode);
    contentNode = undefined;
    spacerNode = undefined;
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

function MessageScrollerItem(props: MessageScrollerItemProps): JSX.Element {
  const registerMessage = useMessageScrollerItemContext();
  const others = omit(props, "ref", "messageId", "scrollAnchor");

  let itemNode: HTMLDivElement | undefined;
  let registeredMessageId: string | undefined;

  const setItem = (element: HTMLDivElement): void => {
    itemNode = element;

    const messageId = untrack(() => props.messageId);

    if (messageId) {
      registerMessage(messageId, element, null);
      registeredMessageId = messageId;
    }
  };

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

import { assertEquals, assertObjectMatch } from "@std/assert";
import { JSDOM } from "jsdom";
import {
  getContentBottom,
  getElementScrollTop,
  getLastScrollAnchor,
  getMessageScrollerScrollable,
  getNewScrollAnchor,
  getUnanchoredScrollAnchor,
} from "./geometry.ts";

// jsdom does not compute layout, so each element's rect, scroll position, and
// dimensions are stubbed directly. Rects are expressed in viewport (client)
// coordinates and shift with the owning viewport's scrollTop.

const dom = new JSDOM("<!doctype html><html><body></body></html>");
Object.assign(globalThis, {
  document: dom.window.document,
  HTMLElement: dom.window.HTMLElement,
  getComputedStyle: dom.window.getComputedStyle.bind(dom.window),
});

type RectInput = {
  top: number;
  height: number;
};

// Override getComputedStyle for one test so padding stubs read from data
// attributes set on the element; the caller restores via the returned thunk.
function stubComputedStyle(): () => void {
  const original = globalThis.getComputedStyle;

  globalThis.getComputedStyle = ((element: Element) => {
    const style = original(element);

    if (
      element instanceof HTMLElement && element.dataset.paddingStart
    ) {
      return {
        ...style,
        gap: "0px",
        rowGap: "0px",
        paddingBlockStart: `${element.dataset.paddingStart}px`,
        paddingTop: `${element.dataset.paddingStart}px`,
        paddingBlockEnd: `${element.dataset.paddingEnd ?? "0"}px`,
        paddingBottom: `${element.dataset.paddingEnd ?? "0"}px`,
      } as CSSStyleDeclaration;
    }

    return style;
  }) as typeof globalThis.getComputedStyle;

  return () => {
    globalThis.getComputedStyle = original;
  };
}

function setRect(element: HTMLElement, rect: RectInput) {
  element.getBoundingClientRect = () =>
    ({
      top: rect.top,
      bottom: rect.top + rect.height,
      height: rect.height,
      left: 0,
      right: 0,
      width: 0,
      x: 0,
      y: rect.top,
      toJSON: () => ({}),
    }) as DOMRect;
}

function setClientHeight(element: HTMLElement, height: number) {
  Object.defineProperty(element, "clientHeight", {
    configurable: true,
    get: () => height,
  });
}

// Build a viewport/content/items fixture. The viewport rect is anchored at
// `viewportTop` in client space; item rects are given in viewport-relative
// terms and offset by viewportTop so getElementTop math lines up with scrollTop.
function createFixture(options: {
  viewportTop?: number;
  viewportHeight: number;
  scrollTop?: number;
  scrollHeight?: number;
  contentPaddingStart?: number;
  contentPaddingEnd?: number;
  items: Array<{
    messageId?: string;
    scrollAnchor?: boolean;
    top: number;
    height: number;
  }>;
}) {
  const viewportTop = options.viewportTop ?? 0;
  const scrollTop = options.scrollTop ?? 0;

  const viewport = document.createElement("div");
  const content = document.createElement("div");
  const spacer = document.createElement("div");

  viewport.appendChild(content);
  content.appendChild(spacer);

  setRect(viewport, { top: viewportTop, height: options.viewportHeight });
  setClientHeight(viewport, options.viewportHeight);
  viewport.scrollTop = scrollTop;

  if (typeof options.scrollHeight === "number") {
    Object.defineProperty(viewport, "scrollHeight", {
      configurable: true,
      get: () => options.scrollHeight as number,
    });
  }

  if (typeof options.contentPaddingStart === "number") {
    content.dataset.paddingStart = String(options.contentPaddingStart);
    content.dataset.paddingEnd = String(options.contentPaddingEnd ?? 0);
  }

  const items = options.items.map((item) => {
    const element = document.createElement("div");

    if (item.messageId) {
      element.dataset.messageId = item.messageId;
    }

    element.dataset.scrollAnchor = item.scrollAnchor ? "true" : "false";
    // Item rects are in client coordinates: viewport-relative top shifted by the
    // viewport's own top so getElementTop adds back scrollTop correctly.
    setRect(element, { top: viewportTop + item.top, height: item.height });
    content.insertBefore(element, spacer);

    return element;
  });

  return { viewport, content, spacer, items };
}

function createItems(
  specs: Array<{ id: string; anchor?: boolean }>,
): HTMLElement[] {
  return specs.map((spec) => {
    const element = document.createElement("div");
    element.dataset.messageId = spec.id;
    element.dataset.scrollAnchor = spec.anchor ? "true" : "false";
    return element;
  });
}

Deno.test("getElementScrollTop: aligns to start by subtracting content padding and margin", () => {
  const restore = stubComputedStyle();
  try {
    const { items, spacer, viewport } = createFixture({
      viewportHeight: 200,
      scrollTop: 0,
      contentPaddingStart: 10,
      contentPaddingEnd: 10,
      items: [{ messageId: "a", top: 100, height: 50 }],
    });

    // elementTop = 100; minus padding.start (10) minus scrollMargin (5).
    assertEquals(
      getElementScrollTop({
        align: "start",
        element: items[0],
        scrollMargin: 5,
        spacer,
        viewport,
      }),
      85,
    );
  } finally {
    restore();
  }
});

Deno.test("getElementScrollTop: centers the element within the padded inset", () => {
  const restore = stubComputedStyle();
  try {
    const { items, spacer, viewport } = createFixture({
      viewportHeight: 200,
      scrollTop: 0,
      contentPaddingStart: 20,
      contentPaddingEnd: 20,
      items: [{ messageId: "a", top: 300, height: 40 }],
    });

    // insetHeight = 200 - 20 - 20 = 160; offset = (160 - 40) / 2 = 60.
    // elementTop (300) - padding.start (20) - 60 - scrollMargin (0) = 220.
    assertEquals(
      getElementScrollTop({
        align: "center",
        element: items[0],
        scrollMargin: 0,
        spacer,
        viewport,
      }),
      220,
    );
  } finally {
    restore();
  }
});

Deno.test("getElementScrollTop: aligns to end against the viewport bottom", () => {
  const restore = stubComputedStyle();
  try {
    const { items, spacer, viewport } = createFixture({
      viewportHeight: 200,
      scrollTop: 0,
      contentPaddingStart: 0,
      contentPaddingEnd: 8,
      items: [{ messageId: "a", top: 300, height: 50 }],
    });

    // elementTop (300) - clientHeight (200) + height (50) + padding.end (8)
    //   + scrollMargin (0) = 158.
    assertEquals(
      getElementScrollTop({
        align: "end",
        element: items[0],
        scrollMargin: 0,
        spacer,
        viewport,
      }),
      158,
    );
  } finally {
    restore();
  }
});

Deno.test("getElementScrollTop: returns the current scrollTop when nearest and already visible", () => {
  const restore = stubComputedStyle();
  try {
    const { items, spacer, viewport } = createFixture({
      viewportHeight: 200,
      viewportTop: 0,
      scrollTop: 50,
      contentPaddingStart: 0,
      contentPaddingEnd: 0,
      // Element top relative to viewport is 60, so in content space it sits at
      // scrollTop (50) + 60 = 110, fully inside [50, 250].
      items: [{ messageId: "a", top: 60, height: 40 }],
    });

    assertEquals(
      getElementScrollTop({
        align: "nearest",
        element: items[0],
        scrollMargin: 0,
        spacer,
        viewport,
      }),
      50,
    );
  } finally {
    restore();
  }
});

Deno.test("getElementScrollTop: scrolls up to reveal an element above the viewport when nearest", () => {
  const restore = stubComputedStyle();
  try {
    const { items, spacer, viewport } = createFixture({
      viewportHeight: 200,
      viewportTop: 0,
      scrollTop: 300,
      contentPaddingStart: 0,
      contentPaddingEnd: 0,
      // Relative top -100 means content-space top is 300 + (-100) = 200, which
      // is above viewportTop (scrollTop 300), so it must scroll up to 200.
      items: [{ messageId: "a", top: -100, height: 40 }],
    });

    assertEquals(
      getElementScrollTop({
        align: "nearest",
        element: items[0],
        scrollMargin: 0,
        spacer,
        viewport,
      }),
      200,
    );
  } finally {
    restore();
  }
});

Deno.test("getContentBottom: returns padding sum when there are no items", () => {
  const restore = stubComputedStyle();
  try {
    const { content, spacer, viewport } = createFixture({
      viewportHeight: 200,
      scrollTop: 0,
      contentPaddingStart: 12,
      contentPaddingEnd: 8,
      items: [],
    });

    assertEquals(getContentBottom({ content, spacer, viewport }), 20);
  } finally {
    restore();
  }
});

Deno.test("getContentBottom: measures from the lowest item bottom plus end padding", () => {
  const restore = stubComputedStyle();
  try {
    const { content, spacer, viewport } = createFixture({
      viewportHeight: 200,
      viewportTop: 0,
      scrollTop: 30,
      contentPaddingStart: 0,
      contentPaddingEnd: 16,
      items: [
        { messageId: "a", top: 0, height: 100 },
        { messageId: "b", top: 100, height: 150 },
      ],
    });

    // Lowest item bottom in client space is 250; minus viewportRect.top (0)
    // plus scrollTop (30) plus padding.end (16) = 296.
    assertEquals(getContentBottom({ content, spacer, viewport }), 296);
  } finally {
    restore();
  }
});

Deno.test("getContentBottom: excludes the spacer from the measurement", () => {
  const restore = stubComputedStyle();
  try {
    const { content, spacer, viewport } = createFixture({
      viewportHeight: 200,
      scrollTop: 0,
      contentPaddingStart: 0,
      contentPaddingEnd: 0,
      items: [{ messageId: "a", top: 0, height: 80 }],
    });

    // Give the spacer a tall rect; it must not raise contentBottom past 80.
    setRect(spacer, { top: 0, height: 9999 });

    assertEquals(getContentBottom({ content, spacer, viewport }), 80);
  } finally {
    restore();
  }
});

Deno.test("getNewScrollAnchor / getLastScrollAnchor: finds the first anchor at or after the previous item count", () => {
  const items = createItems([
    { id: "a", anchor: true },
    { id: "b" },
    { id: "c", anchor: true },
    { id: "d", anchor: true },
  ]);

  // Starting from index 1 skips the anchor at index 0.
  assertEquals(getNewScrollAnchor(items, 1), items[2]);
});

Deno.test("getNewScrollAnchor / getLastScrollAnchor: returns null when no anchor exists after the boundary", () => {
  const items = createItems([
    { id: "a", anchor: true },
    { id: "b" },
    { id: "c" },
  ]);

  assertEquals(getNewScrollAnchor(items, 1), null);
});

Deno.test("getNewScrollAnchor / getLastScrollAnchor: finds the last anchor scanning from the end", () => {
  const items = createItems([
    { id: "a", anchor: true },
    { id: "b", anchor: true },
    { id: "c" },
  ]);

  assertEquals(getLastScrollAnchor(items), items[1]);
});

Deno.test("getNewScrollAnchor / getLastScrollAnchor: returns null when there are no anchors", () => {
  const items = createItems([{ id: "a" }, { id: "b" }]);

  assertEquals(getLastScrollAnchor(items), null);
});

Deno.test("getUnanchoredScrollAnchor: returns the first anchor that has not been handled yet", () => {
  const items = createItems([
    { id: "a", anchor: true },
    { id: "b", anchor: true },
  ]);
  const handled = new WeakSet<HTMLElement>();

  assertEquals(getUnanchoredScrollAnchor(items, handled), items[0]);

  handled.add(items[0]!);

  assertEquals(getUnanchoredScrollAnchor(items, handled), items[1]);
});

Deno.test("getUnanchoredScrollAnchor: returns null when every anchor has already been handled", () => {
  const items = createItems([{ id: "a", anchor: true }]);
  const handled = new WeakSet<HTMLElement>([items[0]!]);

  assertEquals(getUnanchoredScrollAnchor(items, handled), null);
});

Deno.test("getMessageScrollerScrollable: cannot scroll toward either edge when viewport or content is missing", () => {
  const scrollable = getMessageScrollerScrollable({
    content: null,
    scrollEdgeThreshold: 8,
    spacer: null,
    viewport: null,
  });

  assertObjectMatch(scrollable as Record<PropertyKey, unknown>, {
    start: false,
    end: false,
  });
});

Deno.test("getMessageScrollerScrollable: treats sub-threshold gaps at both edges as not scrollable", () => {
  const restore = stubComputedStyle();
  try {
    const { content, spacer, viewport } = createFixture({
      viewportHeight: 200,
      viewportTop: 0,
      // scrollTop 5 <= threshold 8, so it cannot scroll toward the start.
      scrollTop: 5,
      contentPaddingStart: 0,
      contentPaddingEnd: 0,
      // contentBottom 204; 204 - 5 - 200 = -1 <= 8, so it cannot scroll toward the end.
      items: [{ messageId: "a", top: 199, height: 0 }],
    });

    const scrollable = getMessageScrollerScrollable({
      content,
      scrollEdgeThreshold: 8,
      spacer,
      viewport,
    });

    assertObjectMatch(scrollable as Record<PropertyKey, unknown>, {
      start: false,
      end: false,
    });
  } finally {
    restore();
  }
});

Deno.test("getMessageScrollerScrollable: can scroll toward both edges past the threshold", () => {
  const restore = stubComputedStyle();
  try {
    const { content, spacer, viewport } = createFixture({
      viewportHeight: 200,
      viewportTop: 0,
      // scrollTop 100 > threshold 8, so it can scroll toward the start.
      scrollTop: 100,
      contentPaddingStart: 0,
      contentPaddingEnd: 0,
      // contentBottom 1000; 1000 - 100 - 200 = 700 > 8, so it can scroll toward the end.
      items: [{ messageId: "a", top: 900, height: 100 }],
    });

    const scrollable = getMessageScrollerScrollable({
      content,
      scrollEdgeThreshold: 8,
      spacer,
      viewport,
    });

    assertObjectMatch(scrollable as Record<PropertyKey, unknown>, {
      start: true,
      end: true,
    });
  } finally {
    restore();
  }
});

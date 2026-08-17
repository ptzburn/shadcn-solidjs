# Message Scroller on Solid 2 — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use
> superpowers:subagent-driven-development (recommended) or
> superpowers:executing-plans to implement this plan task-by-task. Steps use
> checkbox (`- [ ]`) syntax for tracking.

**Goal:** Port shadcn/ui's headless MessageScroller engine, its styled
component, docs page and eleven examples to Solid 2.0 on the `solid2` branch,
verified by a Playwright behavior suite ported from upstream's tests.

**Architecture:** Faithful mirror of upstream `@shadcn/react/message-scroller` —
same module split, function names, ref-bag names and branch order — with only
the React plumbing translated (`useSyncExternalStore` → `createSignal` +
`equals` + sync mirror; `useLayoutEffect`/`useEffect` → `onSettled` / two-arg
`createEffect`; ref callbacks → array-composed Solid refs). Six registry files
(`message-scroller-{types,geometry,controller,components,primitive}` + styled
`message-scroller.tsx`), a docs-only chat simulator (`~/lib/ai.ts`) and
`MessageAnimated` chrome, examples that are near-verbatim ports of upstream's.

**Tech Stack:** solid-js 2.0.0-rc.0, @solidjs/web 2.0.0-rc.0, @kobalte/core
2.0.0-alpha.0 (Polymorphic), Tailwind 4.3.3 + tw-animate-css, Deno tasks
(`deno task check`, `deno task build:registry`), playwright-core 1.48.2
(scratchpad only).

**Spec:** `docs/superpowers/specs/2026-08-17-message-scroller-solid2-design.md`
— read it first; §5 (translation rules) and §8 (verification) are normative.

## Global Constraints

- Work on branch `solid2` in `/Users/ptzburn/Documents/projects/shadcn-solidjs`.
  All docs-app paths below are relative to `apps/docs/` unless prefixed.
- Upstream sources: `/Users/ptzburn/Documents/projects/ui` at commit `607e8a9` —
  engine in `packages/react/src/message-scroller/`, styled component
  `apps/v4/registry/bases/base/ui/message-scroller.tsx`, examples
  `apps/v4/examples/base/message-scroller-*.tsx`, docs
  `apps/v4/content/docs/components/base/message-scroller.mdx` +
  `apps/v4/content/docs/react/message-scroller.mdx`, CSS
  `packages/shadcn/src/tailwind.css`.
- Solid 2 rules (from `node_modules/solid-js/CHEATSHEET.md`):
  `createEffect(compute, apply, opts?)` two-arg only;
  `onSettled(() => cleanup?)` for mount/teardown; no `on:` namespace (native
  listener options via ref + `addEventListener`); refs are functions, composed
  as arrays `ref={[a, b]}` (falsy entries skipped), run under a null owner;
  `merge`/`omit` replace `mergeProps`/`splitProps`; `undefined` is a real value
  in `merge` — apply defaults with `??`; lowercase intrinsic attrs (`tabindex`);
  boolean attrs are presence/absence (`inert={bool}`); `data-*` values that CSS
  selects on must be explicit `"true"/"false"` strings; signal reads lag until
  flush; no signal writes in component bodies / effect compute phases; type
  imports `JSX`, `ValidComponent`, `ComponentProps` from `@solidjs/web`,
  `Component`, `Accessor`, `Setter` from `solid-js`.
- Repo conventions: registry files import with `.ts`/`.tsx` extensions and `~/`
  alias; `IconPlaceholder` from `~/registry/icons/icon-placeholder.tsx` with all
  five names (`lucide`, `tabler`, `ph`, `ri`, `hugeicons`); `cn` from
  `~/lib/utils.ts`; nova style pre-inlined (no `cn-*` marker classes);
  registry-build outputs (`src/__registry__/index.tsx`,
  `src/registry/icons/__lucide__/index.tsx`, `public/r/`, `public/registry/`)
  are tracked and must be committed after `deno task build:registry`.
- Per-file checks while working: `deno fmt <file>`, `deno lint --fix <file>`,
  `deno check <file>` (run from `apps/docs`); whole-tree `deno task check` only
  in the final task (siblings may be mid-edit).
- Commit after every task with the trailer lines
  `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>` and
  `Claude-Session: https://claude.ai/code/session_01SnBTLUNwMp4ndfHWob9Cm3`. The
  pre-commit hook runs `deno fmt`; if it reformats a staged file, `git add` it
  again and `git commit --amend --no-edit --no-verify`.
- NEVER commit `src/routes/message-scroller-lab.tsx` (temporary test route) — it
  is excluded via `.git/info/exclude` in Task 6 and deleted in Task 15.

## File Structure

| Path (under `apps/docs/`)                                                                           | Responsibility                                                       | Task  |
| --------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- | ----- |
| `src/registry/ui/message-scroller-types.ts`                                                         | constants, all engine types, `Ref<T>`, context type                  | 1     |
| `src/registry/ui/message-scroller-geometry.ts`                                                      | pure DOM geometry (verbatim upstream)                                | 2     |
| `src/registry/ui/message-scroller-controller.ts`                                                    | equality fns, ref bag + signal stores, commands, controller (policy) | 3     |
| `src/registry/ui/message-scroller-components.tsx`                                                   | contexts, hooks, Provider/Root/Viewport/Content/Item/Button          | 4     |
| `src/registry/ui/message-scroller-primitive.ts`                                                     | `MessageScroller` namespace + re-exports + divergence comment        | 5     |
| `src/routes/message-scroller-lab.tsx` (temporary, untracked) + scratchpad `pw/message-scroller.mjs` | behavior test harness                                                | 6     |
| `src/registry/ui/message-scroller.tsx`, `src/styles/app.css`, `src/registry/registry-ui.ts`         | styled wrapper, scroll-fade utilities, registry deps                 | 7     |
| `src/lib/ai.ts`                                                                                     | docs-only chat script builder + Solid session (simulated streaming)  | 8     |
| `src/lib/message-animations.ts`, `src/components/message-animated.tsx`                              | animation presets, animated row chrome                               | 9     |
| `src/routes/(app)/docs/components/message-scroller.mdx`                                             | docs page (written first so example previews can be verified live)   | 10    |
| `src/registry/example/message-scroller-*.tsx` (11), `src/registry/registry-examples.ts`             | examples + entries                                                   | 11–14 |
| final verification, cleanup, memory note                                                            |                                                                      | 15    |

---

### Task 1: Types module

**Files:**

- Create: `apps/docs/src/registry/ui/message-scroller-types.ts`
- Reference: `ui/packages/react/src/message-scroller/types.ts`

**Interfaces:**

- Produces: every constant/type below by exact name; later tasks import `Ref`,
  `MessageScrollerContextValue`, `MessageScrollerRegisterMessage`, part prop
  types, `USER_SCROLL_KEYS`, `EMPTY_*`, `DEFAULT_*`, `SCROLL_POSITION_EPSILON`,
  `AUTOSCROLLING_CLEAR_DELAY`.

- [ ] **Step 1: Write the file**

```ts
import type { ComponentProps, JSX } from "@solidjs/web";
import type { Accessor } from "solid-js";

// Default scrollEdgeThreshold. Sub-pixel tolerance so edge detection does not
// flicker across engines that round scrollTop differently.
const DEFAULT_SCROLL_EDGE_THRESHOLD = 8;

// Default scrollPreviousItemPeek. Pixels of the previous item kept visible above
// a newly anchored row.
const DEFAULT_SCROLL_PREVIOUS_ITEM_PEEK = 64;

// Default scrollMargin for scrollToMessage and programmatic targets.
const DEFAULT_SCROLL_MARGIN = 0;

// Two fractional scrollTop values within this range are treated as equal, to
// absorb zoom and HiDPI rounding drift.
const SCROLL_POSITION_EPSILON = 0.5;

// How long (ms) data-autoscrolling stays set during a programmatic smooth scroll
// before clearing.
const AUTOSCROLLING_CLEAR_DELAY = 180;

// Viewport keys that count as deliberate scroll intent and release follow-bottom.
const USER_SCROLL_KEYS = new Set([
  "ArrowDown",
  "ArrowUp",
  "End",
  "Home",
  "PageDown",
  "PageUp",
  " ", // Space key.
]);

// Internal scroll mode. Derived from intent and commands; decides how the
// viewport reacts to content and resize.
type MessageScrollerMode =
  | "following-bottom" // autoScroll on, pinned to the latest message.
  | "free-scrolling" // reader scrolled away; position left alone (prepends still preserved).
  | "anchored-to-message" // holding a turn at the reading line while it streams.
  | "settling-jump"; // a programmatic jump is animating; intent detection suppressed until it settles.

// Where a saved transcript opens on the first non-empty render.
type MessageScrollerDefaultScrollPosition = "start" | "end" | "last-anchor";

// Which transcript edge MessageScrollerButton scrolls toward.
type MessageScrollerButtonDirection = "start" | "end";

// Viewport alignment for scrollToMessage and programmatic jumps.
type MessageScrollerScrollAlign = "start" | "center" | "end" | "nearest";

// Options for scrollToMessage, scrollToEnd, and scrollToStart.
type MessageScrollerScrollOptions = {
  // Viewport edge or center to align the target to.
  align?: MessageScrollerScrollAlign;
  // Native scroll behavior.
  behavior?: ScrollBehavior;
  // Margin on the aligned edge, in pixels. Defaults to the provider scrollMargin.
  scrollMargin?: number;
};

// Scroll snapshot from useMessageScrollerScrollable: which edges the viewport can
// still scroll toward.
type MessageScrollerScrollable = {
  // The viewport can scroll toward the start (content is hidden above).
  start: boolean;
  // The viewport can scroll toward the end (content is hidden below).
  end: boolean;
};

// Visibility snapshot from useMessageScrollerVisibility.
type MessageScrollerVisibilityState = {
  // The anchored turn the reader is in, or null. Stays set after the anchor
  // scrolls above the viewport.
  currentAnchorId: string | null;
  // messageId values intersecting the viewport, in document order.
  visibleMessageIds: string[];
};

// Mutable ref holder. Solid component bodies run once, so a plain object field
// is a stable place to stash imperative state shared across the controller and
// its commands (the role useRef plays in the React original).
type Ref<T> = { current: T };

// Headless provider for a chat transcript scroller. Owns scroll behavior and
// state; renders no DOM.
type MessageScrollerProviderProps = {
  children?: JSX.Element;
  // Follow new content at the bottom while the viewport is already at the end.
  autoScroll?: boolean;
  // Opening position on the first non-empty render, applied once.
  defaultScrollPosition?: MessageScrollerDefaultScrollPosition;
  // Distance from an edge that still counts as at-top/at-bottom. Defaults to 8.
  scrollEdgeThreshold?: number;
  // Extra top margin for a newly anchored row, added to scrollMargin. Defaults to 64.
  scrollPreviousItemPeek?: number;
  // Default margin on the aligned edge for commands and visibility. Defaults to 0.
  scrollMargin?: number;
};

// Frame container for a chat transcript scroller. Must render inside a
// MessageScrollerProvider.
type MessageScrollerProps = ComponentProps<"div">;

// Scrollable viewport. Owns native scroll events and prepend preservation.
type MessageScrollerViewportProps = ComponentProps<"div"> & {
  // Keep the first visible messageId row stable on prepend. Defaults to true.
  preserveScrollOnPrepend?: boolean;
};

// Transcript row container. Every direct child should be a MessageScrollerItem.
type MessageScrollerContentProps = ComponentProps<"div"> & {
  // Class name for the internal tail spacer used when anchoring turns near the top.
  spacerClassName?: string;
};

// One transcript row: a message, marker, typing row, separator, or load-more row.
type MessageScrollerItemProps = ComponentProps<"div"> & {
  // Stable row id for scrollToMessage, visibility, and prepend preservation.
  messageId?: string;
  // Marks a turn boundary that newly appended anchors and last-anchor restore use.
  scrollAnchor?: boolean;
};

// Scroll control for the start or end of the transcript. Polymorphic via
// Kobalte's `as` (upstream uses Base UI's `render`).
type MessageScrollerButtonProps = ComponentProps<"button"> & {
  // Native scroll behavior when clicked. Defaults to "smooth".
  behavior?: ScrollBehavior;
  // Transcript edge to scroll toward. Defaults to "end".
  direction?: MessageScrollerButtonDirection;
};

// Registers (or, with removedElement, unregisters) a MessageScrollerItem node by
// messageId.
type MessageScrollerRegisterMessage = (
  messageId: string,
  element: HTMLElement | null,
  removedElement?: HTMLElement | null,
) => void;

// Internal context wiring the parts together. Not part of the public API.
// Solid: the two useSyncExternalStore stores are accessors, and visibility
// subscription is reference-counted through add/removeVisibilitySubscriber.
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
  setContentElement: (element: HTMLDivElement | null) => void;
  setRootElement: (element: HTMLDivElement | null) => void;
  setSpacerElement: (element: HTMLDivElement | null) => void;
  setViewportElement: (element: HTMLDivElement | null) => void;
  scrollableState: Accessor<MessageScrollerScrollable>;
  visibilityState: Accessor<MessageScrollerVisibilityState>;
  syncAfterScroll: () => void;
  userScrollIntent: () => void;
  viewportRef: Ref<HTMLDivElement | null>;
};

// Initial MessageScrollerScrollable before measurement. Stable reference for the
// server and first-render snapshot.
const EMPTY_MESSAGE_SCROLLER_SCROLLABLE: MessageScrollerScrollable = {
  start: false,
  end: false,
};

// Shared empty array so empty visibility snapshots stay referentially stable.
const EMPTY_VISIBLE_MESSAGE_IDS: string[] = [];

// Initial MessageScrollerVisibilityState. Nothing tracked, no current anchor.
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
```

- [ ] **Step 2: Check**

Run (from `apps/docs`):
`deno fmt src/registry/ui/message-scroller-types.ts && deno lint --fix src/registry/ui/message-scroller-types.ts && deno check src/registry/ui/message-scroller-types.ts`
Expected: no errors (lint may reorder the export lists — keep its order).

- [ ] **Step 3: Commit**

```bash
git add apps/docs/src/registry/ui/message-scroller-types.ts
git commit -m "Port message-scroller types to Solid 2"
```

---

### Task 2: Geometry module (verbatim)

**Files:**

- Create: `apps/docs/src/registry/ui/message-scroller-geometry.ts`
- Source: `ui/packages/react/src/message-scroller/geometry.ts`

**Interfaces:**

- Produces (exact upstream names, all exported): `getContentBlockPadding`,
  `getContentBottom`, `getElementScrollTop`, `getElementTop`,
  `getElementViewportTop`, `getFirstVisibleMessageItem`, `getFlexGap`,
  `getLastScrollAnchor`, `getMaxScrollTop`, `getMessageScrollerItems`,
  `getMessageScrollerScrollable`, `getMessageScrollerVisibilityState`,
  `getNewScrollAnchor`, `getTailSpacerHeight`, `getUnanchoredScrollAnchor`,
  `hasMultipleNewScrollAnchors`.

- [ ] **Step 1: Copy upstream and fix the two import lines**

```bash
cp /Users/ptzburn/Documents/projects/ui/packages/react/src/message-scroller/geometry.ts apps/docs/src/registry/ui/message-scroller-geometry.ts
sed -i '' 's#from "./types"#from "./message-scroller-types.ts"#g' apps/docs/src/registry/ui/message-scroller-geometry.ts
```

Nothing else in the file is framework-specific; keep every function body
byte-identical (compare with
`git show main:apps/docs/src/registry/ui/message-scroller-geometry.ts` — main's
is the same code with explicit return types).

- [ ] **Step 2: Add the explicit return types deno lint wants**

`deno lint` (`explicit-function-return-type` is not enforced, but
`explicit-module-boundary-types` may be) — run the check first; if it flags
exported functions, add return types exactly as main did:
`getMessageScrollerItems(...): HTMLElement[]`,
`getNewScrollAnchor(...): HTMLElement | null`,
`getUnanchoredScrollAnchor(...): HTMLElement | null`,
`hasMultipleNewScrollAnchors(...): boolean`,
`getLastScrollAnchor(...): HTMLElement | null`,
`getFirstVisibleMessageItem(...): HTMLElement | null`,
`getElementScrollTop(...): number`, `getElementTop(...): number`,
`getElementViewportTop(...): number`, `getTailSpacerHeight(...): number`,
`getContentBottom(...): number`, `getMaxScrollTop(...): number`,
`getBlockPadding(...): { end: number; start: number }`,
`getContentBlockPadding(...): { end: number; start: number }`,
`getFlexGap(...): number`, `readCssPixel(...): number`.

- [ ] **Step 3: Check**

Run:
`deno fmt src/registry/ui/message-scroller-geometry.ts && deno lint --fix src/registry/ui/message-scroller-geometry.ts && deno check src/registry/ui/message-scroller-geometry.ts`
Expected: clean.

- [ ] **Step 4: Commit**

```bash
git add apps/docs/src/registry/ui/message-scroller-geometry.ts
git commit -m "Port message-scroller geometry (verbatim upstream)"
```

---

### Task 3: Controller module (refs + commands + policy)

**Files:**

- Create: `apps/docs/src/registry/ui/message-scroller-controller.ts`
- Reference: upstream `stores.ts`, `use-message-scroller-refs.ts`,
  `use-message-scroller-commands.ts`, `use-message-scroller-controller.ts` (read
  them side by side; the code below is their line-for-line translation).

**Interfaces:**

- Consumes: Task 1 types/constants, Task 2 geometry.
- Produces:
  `createMessageScrollerController(props: MessageScrollerProviderProps): { context: MessageScrollerContextValue; registerMessage: MessageScrollerRegisterMessage }`
  (the only export Task 4 uses), plus exported `areScrollStatesEqual`,
  `areVisibilityStatesEqual`, `createMessageScrollerRefs`,
  `createMessageScrollerCommands` and type `MessageScrollerRefs`.

- [ ] **Step 1: Write the file**

```ts
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
```

- [ ] **Step 2: Diff against upstream mentally, then check**

Open `ui/packages/react/src/message-scroller/use-message-scroller-controller.ts`
next to the file and confirm the four behavior fixes are present:
`lastScrollTopRef`/`scrolledUp` + `anchored-to-message` guard in
`reconcileFollowMode`; `publishedState` with `end: false` in
`commitScrollState`; `previousSpacerHeight > 0 && spacerHeightRef.current === 0`
hand-off in `handleResize`; and every other function body matches upstream
line-for-line apart from `React.useCallback` removal, `globalThis.` prefixes and
`Ref.current` reads.

Run:
`deno fmt src/registry/ui/message-scroller-controller.ts && deno lint --fix src/registry/ui/message-scroller-controller.ts && deno check src/registry/ui/message-scroller-controller.ts`
Expected: clean. If `Setter<MessageScrollerScrollable>` complains when called
with an object literal, change the two setter calls to
`setScrollableState(() => publishedState)` /
`setVisibilityState(() => nextState)` (function form always type-checks).

- [ ] **Step 3: Commit**

```bash
git add apps/docs/src/registry/ui/message-scroller-controller.ts
git commit -m "Port message-scroller controller (refs, commands, policy) to Solid 2"
```

---

### Task 4: Components module

**Files:**

- Create: `apps/docs/src/registry/ui/message-scroller-components.tsx`
- Reference: upstream `components.tsx`

**Interfaces:**

- Consumes: `createMessageScrollerController` (Task 3), types/`USER_SCROLL_KEYS`
  (Task 1).
- Produces (exact names): `MessageScrollerProvider`, `MessageScroller` (Root),
  `MessageScrollerViewport`, `MessageScrollerContent`, `MessageScrollerItem`,
  `MessageScrollerButton` (generic `<T extends ValidComponent = "button">`,
  `PolymorphicProps<T, MessageScrollerButtonProps>`), `useMessageScroller()`,
  `useMessageScrollerScrollable()`, `useMessageScrollerVisibility()`.

- [ ] **Step 1: Write the file**

```tsx
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

  // Register at ref time — Solid refs run during render, mirroring React's
  // commit-time ref attach, so the message map is already populated when
  // Content's onSettled runs the first handleContentChange (which may flush a
  // queued scrollToMessage synchronously).
  const setItem = (element: HTMLDivElement): void => {
    const previousElement = itemNode ?? null;

    itemNode = element;

    const messageId = untrack((): string | undefined => props.messageId);

    if (messageId) {
      registerMessage(messageId, element, previousElement);
    }
  };

  // A messageId change re-registers the row under the new id (upstream gets
  // this from React re-invoking the recreated ref callback).
  createEffect(
    (): string | undefined => props.messageId,
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
  );

  onCleanup((): void => {
    const messageId = untrack((): string | undefined => props.messageId);

    if (messageId && itemNode) {
      registerMessage(messageId, null, itemNode);
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
```

- [ ] **Step 2: Check**

Run:
`deno fmt src/registry/ui/message-scroller-components.tsx && deno lint --fix src/registry/ui/message-scroller-components.tsx && deno check src/registry/ui/message-scroller-components.tsx`
Expected: clean. Known type wrinkles and their fixes:

- If `ref={[context.setRootElement, props.ref]}` errors because `props.ref` may
  be an `HTMLDivElement` (the JSX `Ref<T>` union includes `T`), narrow it:
  `ref={[context.setRootElement, typeof props.ref === "function" ? props.ref : undefined]}`
  — the compiler always hands components a function ref, so this only satisfies
  the type.
- If `event.currentTarget.blur()` errors, cast:
  `(event.currentTarget as HTMLElement).blur()`.
- If `local.tabindex` errors inside the Polymorphic (`RemoveAttribute` in the
  union), leave it — Polymorphic's props are untyped generics; otherwise cast
  `local.tabindex as number | string | undefined`.

- [ ] **Step 3: Commit**

```bash
git add apps/docs/src/registry/ui/message-scroller-components.tsx
git commit -m "Port message-scroller components to Solid 2"
```

---

### Task 5: Primitive barrel

**Files:**

- Create: `apps/docs/src/registry/ui/message-scroller-primitive.ts`
- Reference: upstream `index.ts`

**Interfaces:**

- Produces: `MessageScroller` namespace object
  `{ Provider, Root, Viewport, Content, Item, Button }`; re-exports of the three
  hooks and public types. Task 6 (lab), Task 7 (styled) and the docs "Unstyled"
  section import from here.

- [ ] **Step 1: Write the file**

```ts
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
} from "./message-scroller-types.ts";
```

- [ ] **Step 2: Check**

Run:
`deno fmt src/registry/ui/message-scroller-primitive.ts && deno lint --fix src/registry/ui/message-scroller-primitive.ts && deno check src/registry/ui/message-scroller-primitive.ts`
Expected: clean.

- [ ] **Step 3: Commit**

```bash
git add apps/docs/src/registry/ui/message-scroller-primitive.ts
git commit -m "Add message-scroller primitive barrel"
```

---

### Task 6: Behavior harness — lab route + Playwright suite (drive the engine until green)

**Files:**

- Create (untracked, temporary): `apps/docs/src/routes/message-scroller-lab.tsx`
- Create (scratchpad): `<scratchpad>/pw/message-scroller.mjs`,
  `<scratchpad>/pw/package.json` (scratchpad =
  `/private/tmp/claude-501/-Users-ptzburn-Documents-projects-shadcn-solidjs/38fd03f4-131f-483f-877b-060c8ed884e2/scratchpad`)
- Modify (fix bugs the suite finds): Task 3/4 files

**Interfaces:**

- Consumes: `MessageScroller.*`, the three hooks and types from
  `~/registry/ui/message-scroller-primitive.ts` (Task 5).
- Produces: `window.__lab` API (below) used by the suite; the suite is re-run in
  Task 15.

- [ ] **Step 1: Exclude the lab route from git and write it**

```bash
echo "apps/docs/src/routes/message-scroller-lab.tsx" >> .git/info/exclude
```

`apps/docs/src/routes/message-scroller-lab.tsx`:

```tsx
// TEMPORARY behavior-test harness for the message-scroller engine. Never
// committed (listed in .git/info/exclude); deleted in the final task.
import { createSignal, createStore, For, onCleanup, Show } from "solid-js";
import type { JSX } from "@solidjs/web";
import {
  MessageScroller,
  useMessageScroller,
  useMessageScrollerScrollable,
  useMessageScrollerVisibility,
} from "~/registry/ui/message-scroller-primitive.ts";
import type {
  MessageScrollerDefaultScrollPosition,
  MessageScrollerScrollOptions,
} from "~/registry/ui/message-scroller-primitive.ts";

type LabItem = { id: string; height: number; anchor: boolean };
type LabItemSpec = { id?: string; height?: number; anchor?: boolean };

type LabSnapshot = {
  scrollTop: number;
  distanceToBottom: number;
  scrollHeight: number;
  clientHeight: number;
  scrollable: string | null;
  viewportScrollable: string | null;
  autoscrolling: boolean;
  hookStart: boolean;
  hookEnd: boolean;
  currentAnchor: string | null;
  visibleIds: string[];
  endButtonActive: string | null;
  endButtonInert: boolean;
  endButtonTabindex: string | null;
  startButtonActive: string | null;
  offsets: Record<string, number>;
  itemCount: number;
  spacerHidden: boolean | null;
  spacerHeight: number;
};

type LabApi = {
  append(specs: LabItemSpec[]): void;
  prepend(specs: LabItemSpec[]): void;
  setItems(specs: LabItemSpec[]): void;
  setItem(id: string, patch: { height?: number; anchor?: boolean }): void;
  replace(id: string, spec: LabItemSpec): void;
  remove(id: string): void;
  setAutoScroll(value: boolean): void;
  setDefaultScrollPosition(value: MessageScrollerDefaultScrollPosition): void;
  setPeek(value: number): void;
  setScrollMargin(value: number): void;
  setPreserve(value: boolean): void;
  setViewportHeight(value: number): void;
  setVisibility(value: boolean): void;
  remount(): void;
  scrollToMessage(id: string, options?: MessageScrollerScrollOptions): boolean;
  scrollToEnd(options?: MessageScrollerScrollOptions): boolean;
  scrollToStart(options?: MessageScrollerScrollOptions): boolean;
  settle(frames?: number): Promise<void>;
  read(): LabSnapshot;
};

const ITEM_HEIGHT = 80;
const VIEWPORT_HEIGHT = 200;

let nextId = 0;

function makeItem(spec: LabItemSpec): LabItem {
  return {
    id: spec.id ?? `m${nextId++}`,
    height: spec.height ?? ITEM_HEIGHT,
    anchor: spec.anchor ?? false,
  };
}

let commands: ReturnType<typeof useMessageScroller> | null = null;

function Commands(): JSX.Element {
  commands = useMessageScroller();
  onCleanup(() => {
    commands = null;
  });
  return null;
}

function ScrollableProbe(): JSX.Element {
  const scrollable = useMessageScrollerScrollable();
  return (
    <div
      data-testid="scrollable"
      data-start={scrollable().start ? "true" : "false"}
      data-end={scrollable().end ? "true" : "false"}
    />
  );
}

function VisibilityProbe(): JSX.Element {
  const visibility = useMessageScrollerVisibility();
  return (
    <div
      data-testid="visibility"
      data-current-anchor={visibility().currentAnchorId ?? ""}
      data-visible={visibility().visibleMessageIds.join(",")}
    />
  );
}

export default function MessageScrollerLab(): JSX.Element {
  const params = new URLSearchParams(globalThis.location.search);
  const count = Number(params.get("count") ?? "0");
  const anchorEvery = Number(params.get("anchorEvery") ?? "0");
  const [items, setItems] = createStore<LabItem[]>(
    Array.from(
      { length: count },
      (_, index) =>
        makeItem({ anchor: anchorEvery > 0 && index % anchorEvery === 0 }),
    ),
  );
  const [autoScroll, setAutoScroll] = createSignal(
    params.get("autoScroll") === "1",
  );
  const [defaultScrollPosition, setDefaultScrollPosition] = createSignal<
    MessageScrollerDefaultScrollPosition
  >(
    (params.get("defaultScrollPosition") as
      | MessageScrollerDefaultScrollPosition
      | null) ?? "end",
  );
  const [peek, setPeek] = createSignal(Number(params.get("peek") ?? "64"));
  const [scrollMargin, setScrollMargin] = createSignal(
    Number(params.get("scrollMargin") ?? "0"),
  );
  const [preserve, setPreserve] = createSignal(params.get("preserve") !== "0");
  const [viewportHeight, setViewportHeight] = createSignal(
    Number(params.get("viewportHeight") ?? String(VIEWPORT_HEIGHT)),
  );
  const [showVisibility, setShowVisibility] = createSignal(
    params.get("visibility") === "1",
  );
  const noNativeAnchor = params.get("noNativeAnchor") === "1";
  const [mountKey, setMountKey] = createSignal(1);

  const settle = (frames = 4): Promise<void> =>
    new Promise((resolve) => {
      let remaining = frames;
      const tick = (): void => {
        if (remaining-- <= 0) {
          resolve();
          return;
        }
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });

  const read = (): LabSnapshot => {
    const viewport = document.querySelector<HTMLElement>(
      '[aria-label="viewport"]',
    );
    const root = document.querySelector<HTMLElement>('[data-testid="root"]');
    const scrollableProbe = document.querySelector<HTMLElement>(
      '[data-testid="scrollable"]',
    );
    const visibilityProbe = document.querySelector<HTMLElement>(
      '[data-testid="visibility"]',
    );
    const endButton = document.querySelector<HTMLElement>(
      '[data-testid="end-button"]',
    );
    const startButton = document.querySelector<HTMLElement>(
      '[data-testid="start-button"]',
    );
    const spacer = document.querySelector<HTMLElement>(
      "[data-message-scroller-spacer]",
    );
    const offsets: Record<string, number> = {};
    if (viewport) {
      const viewportTop = viewport.getBoundingClientRect().top;
      for (
        const item of document.querySelectorAll<HTMLElement>(
          "[data-message-id]",
        )
      ) {
        offsets[item.dataset.messageId ?? ""] = Math.round(
          item.getBoundingClientRect().top - viewportTop,
        );
      }
    }
    const visible = visibilityProbe?.dataset.visible ?? "";
    return {
      scrollTop: Math.round(viewport?.scrollTop ?? 0),
      distanceToBottom: viewport
        ? Math.round(
          viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight,
        )
        : 0,
      scrollHeight: viewport?.scrollHeight ?? 0,
      clientHeight: viewport?.clientHeight ?? 0,
      scrollable: root?.getAttribute("data-scrollable") ?? null,
      viewportScrollable: viewport?.getAttribute("data-scrollable") ?? null,
      autoscrolling: root?.hasAttribute("data-autoscrolling") ?? false,
      hookStart: scrollableProbe?.dataset.start === "true",
      hookEnd: scrollableProbe?.dataset.end === "true",
      currentAnchor: visibilityProbe?.dataset.currentAnchor || null,
      visibleIds: visible ? visible.split(",") : [],
      endButtonActive: endButton?.dataset.active ?? null,
      endButtonInert: endButton?.hasAttribute("inert") ?? false,
      endButtonTabindex: endButton?.getAttribute("tabindex") ?? null,
      startButtonActive: startButton?.dataset.active ?? null,
      offsets,
      itemCount: document.querySelectorAll("[data-message-id]").length,
      spacerHidden: spacer?.hidden ?? null,
      spacerHeight: spacer ? spacer.getBoundingClientRect().height : 0,
    };
  };

  // Exposed for the Playwright suite (typed loosely: the lab is throwaway).
  (globalThis as unknown as { __lab: LabApi }).__lab = {
    append: (specs) =>
      setItems((list) => {
        for (const spec of specs) {
          list.push(makeItem(spec));
        }
      }),
    prepend: (specs) =>
      setItems((list) => {
        list.unshift(...specs.map(makeItem));
      }),
    setItems: (specs) => setItems(() => specs.map(makeItem)),
    setItem: (id, patch) =>
      setItems((list) => {
        const item = list.find((entry) => entry.id === id);
        if (item) {
          if (patch.height !== undefined) item.height = patch.height;
          if (patch.anchor !== undefined) item.anchor = patch.anchor;
        }
      }),
    replace: (id, spec) =>
      setItems((list) => {
        const index = list.findIndex((entry) => entry.id === id);
        if (index >= 0) list[index] = makeItem(spec);
      }),
    remove: (id) => setItems((list) => list.filter((entry) => entry.id !== id)),
    setAutoScroll,
    setDefaultScrollPosition,
    setPeek,
    setScrollMargin,
    setPreserve,
    setViewportHeight,
    setVisibility: setShowVisibility,
    remount: () => setMountKey((key) => key + 1),
    scrollToMessage: (id, options) =>
      commands?.scrollToMessage(id, options) ?? false,
    scrollToEnd: (options) => commands?.scrollToEnd(options) ?? false,
    scrollToStart: (options) => commands?.scrollToStart(options) ?? false,
    settle,
    read,
  };

  return (
    <div style={{ padding: "16px" }}>
      <Show when={mountKey()} keyed>
        {() => (
          <MessageScroller.Provider
            autoScroll={autoScroll()}
            defaultScrollPosition={defaultScrollPosition()}
            scrollPreviousItemPeek={peek()}
            scrollMargin={scrollMargin()}
          >
            <MessageScroller.Root data-testid="root">
              <MessageScroller.Viewport
                aria-label="viewport"
                preserveScrollOnPrepend={preserve()}
                style={{
                  height: `${viewportHeight()}px`,
                  "overflow-y": "auto",
                  "overflow-anchor": noNativeAnchor ? "none" : "auto",
                }}
              >
                <MessageScroller.Content
                  style={{ display: "flex", "flex-direction": "column" }}
                >
                  <For each={items}>
                    {(item) => (
                      <MessageScroller.Item
                        messageId={item.id}
                        scrollAnchor={item.anchor}
                        style={{ height: `${item.height}px`, flex: "none" }}
                      >
                        {item.id}
                      </MessageScroller.Item>
                    )}
                  </For>
                </MessageScroller.Content>
              </MessageScroller.Viewport>
              <MessageScroller.Button behavior="auto" data-testid="end-button">
                Scroll to end
              </MessageScroller.Button>
              <MessageScroller.Button
                behavior="auto"
                direction="start"
                data-testid="start-button"
              >
                Scroll to start
              </MessageScroller.Button>
              <ScrollableProbe />
              <Show when={showVisibility()}>
                <VisibilityProbe />
              </Show>
              <Commands />
            </MessageScroller.Root>
          </MessageScroller.Provider>
        )}
      </Show>
    </div>
  );
}
```

Run:
`deno fmt src/routes/message-scroller-lab.tsx && deno check src/routes/message-scroller-lab.tsx`
— clean.

- [ ] **Step 2: Start the dev server (background) and confirm the lab renders**

```bash
cd apps/docs && deno task dev > "$SCRATCH/dev.log" 2>&1 &   # SCRATCH = scratchpad dir; use run_in_background
sleep 8; curl -s -H "Accept: text/html" -o /dev/null -w "%{http_code}\n" "http://localhost:3228/message-scroller-lab?count=8"
```

Expected: `200`. (Memory gotcha: the FIRST load of a freshly added route can
transiently fail with "lazy() module was not preloaded" — reload once; not an
engine bug. If a stale server is already on 3228 from an earlier session,
restart it so it picks up the new route.)

- [ ] **Step 3: Install playwright-core in the scratchpad**

```bash
mkdir -p "$SCRATCH/pw" && cd "$SCRATCH/pw" && npm init -y >/dev/null && npm i playwright-core@1.48.2 >/dev/null && ls ~/Library/Caches/ms-playwright/chromium-1148/chrome-mac/Chromium.app >/dev/null && echo browser-ok
```

- [ ] **Step 4: Write the suite `$SCRATCH/pw/message-scroller.mjs`**

```js
// Behavior suite for the Solid 2 message-scroller engine, ported from upstream's
// message-scroller.browser.test.tsx / message-scroller.test.tsx scenarios.
// Usage: node message-scroller.mjs [baseUrl]   (default http://localhost:3228)
import { chromium } from "playwright-core";
import os from "node:os";

const base = process.argv[2] ?? "http://localhost:3228";
const exe =
  `${os.homedir()}/Library/Caches/ms-playwright/chromium-1148/chrome-mac/Chromium.app/Contents/MacOS/Chromium`;
const browser = await chromium.launch({ executablePath: exe, headless: true });
const ITEM = 80;
const VIEWPORT = 200;
const only = process.argv[3]; // optional substring filter
const results = [];

const lab = (page, method, ...args) =>
  page.evaluate(([m, a]) => globalThis.__lab[m](...a), [method, args]);
const read = (page) => lab(page, "read");
const settle = (page, frames = 4) => lab(page, "settle", frames);
const setScrollTop = (page, value) =>
  page.evaluate((v) => {
    document.querySelector('[aria-label="viewport"]').scrollTop = v;
  }, value);
const assert = (cond, msg) => {
  if (!cond) throw new Error(msg);
};
const eq = (actual, expected, label) =>
  assert(
    actual === expected,
    `${label}: expected ${JSON.stringify(expected)}, got ${
      JSON.stringify(actual)
    }`,
  );
const near = (actual, expected, tol, label) =>
  assert(
    Math.abs(actual - expected) <= tol,
    `${label}: expected ${expected}±${tol}, got ${actual}`,
  );
async function wheel(page, deltaY) {
  const box = await page.locator('[aria-label="viewport"]').boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.wheel(0, deltaY);
}
const items = (n, extra = {}) =>
  Array.from({ length: n }, () => ({ ...extra }));

async function scenario(name, params, fn) {
  if (only && !name.includes(only)) return;
  const page = await browser.newPage({ viewport: { width: 800, height: 600 } });
  const errors = [];
  page.on("pageerror", (e) => errors.push("pageerror: " + e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push("console: " + m.text());
  });
  try {
    await page.goto(
      `${base}/message-scroller-lab?${new URLSearchParams(params)}`,
      { waitUntil: "networkidle" },
    );
    await page.waitForFunction(
      () =>
        globalThis.__lab && document.querySelector('[aria-label="viewport"]'),
      null,
      { timeout: 15000 },
    );
    await settle(page, 6);
    await fn(page);
    assert(errors.length === 0, "page errors: " + errors.join(" | "));
    results.push({ name, ok: true });
    console.log("PASS", name);
  } catch (error) {
    results.push({ name, ok: false });
    console.log(
      "FAIL",
      name,
      "\n     ",
      String(error?.message ?? error).split("\n")[0],
    );
  } finally {
    await page.close();
  }
}

// --- opening position -------------------------------------------------------
await scenario(
  "opens at the end by default; end button idle, start button live",
  { count: 8 },
  async (page) => {
    const s = await read(page);
    assert(s.distanceToBottom <= 1, "distanceToBottom " + s.distanceToBottom);
    eq(s.scrollable, "start", "root data-scrollable");
    eq(s.viewportScrollable, "start", "viewport data-scrollable");
    eq(s.hookEnd, false, "hook end");
    eq(s.hookStart, true, "hook start");
    eq(s.endButtonActive, "false", "end data-active");
    eq(s.endButtonInert, true, "end inert");
    eq(s.endButtonTabindex, "-1", "end tabindex");
    eq(s.startButtonActive, "true", "start data-active");
  },
);
await scenario("opens at the start with defaultScrollPosition=start", {
  count: 8,
  defaultScrollPosition: "start",
}, async (page) => {
  const s = await read(page);
  eq(s.scrollTop, 0, "scrollTop");
  eq(s.scrollable, "end", "data-scrollable");
  eq(s.endButtonActive, "true", "end active");
  eq(s.endButtonInert, false, "end inert");
  eq(s.endButtonTabindex, null, "end tabindex absent");
});
await scenario("content that fits: no data-scrollable, both buttons idle", {
  count: 2,
}, async (page) => {
  const s = await read(page);
  eq(s.scrollable, null, "data-scrollable");
  eq(s.endButtonActive, "false", "end");
  eq(s.startButtonActive, "false", "start");
});
await scenario(
  "a11y defaults and item data attributes",
  { count: 3 },
  async (page) => {
    const a = await page.evaluate(() => {
      const v = document.querySelector('[aria-label="viewport"]');
      const c = v.firstElementChild;
      const spacer = document.querySelector("[data-message-scroller-spacer]");
      return {
        role: v.getAttribute("role"),
        tabindex: v.getAttribute("tabindex"),
        crole: c.getAttribute("role"),
        relevant: c.getAttribute("aria-relevant"),
        anchors:
          document.querySelectorAll('[data-scroll-anchor="false"]').length,
        spacerHidden: spacer.hidden,
        spacerAria: spacer.getAttribute("aria-hidden"),
        spacerLast: c.lastElementChild === spacer,
      };
    });
    eq(a.role, "region", "viewport role");
    eq(a.tabindex, "0", "viewport tabindex");
    eq(a.crole, "log", "content role");
    eq(a.relevant, "additions", "aria-relevant");
    eq(a.anchors, 3, "data-scroll-anchor=false rows");
    eq(a.spacerHidden, true, "spacer hidden");
    eq(a.spacerAria, "true", "spacer aria-hidden");
    eq(a.spacerLast, true, "spacer is last child");
  },
);
await scenario(
  "last-anchor opens with the last overflowing anchor at the reading line",
  { count: 0, defaultScrollPosition: "last-anchor", peek: 64 },
  async (page) => {
    await lab(page, "setItems", [...items(6), { id: "turn", anchor: true }, {
      id: "reply",
      height: 400,
    }]);
    await settle(page, 6);
    const s = await read(page);
    eq(s.offsets.turn, 64, "turn offset");
  },
);
await scenario("last-anchor falls back to the end when the last turn fits", {
  count: 0,
  defaultScrollPosition: "last-anchor",
}, async (page) => {
  await lab(page, "setItems", [...items(6), {
    id: "turn",
    anchor: true,
    height: 40,
  }, { id: "reply", height: 60 }]);
  await settle(page, 6);
  const s = await read(page);
  assert(s.distanceToBottom <= 1, "distanceToBottom " + s.distanceToBottom);
});
await scenario("last-anchor falls back to the end when there is no anchor", {
  count: 8,
  defaultScrollPosition: "last-anchor",
}, async (page) => {
  const s = await read(page);
  assert(s.distanceToBottom <= 1, "distanceToBottom " + s.distanceToBottom);
});
await scenario("last-anchor with autoScroll does not yank to the bottom", {
  count: 0,
  defaultScrollPosition: "last-anchor",
  autoScroll: 1,
  peek: 64,
}, async (page) => {
  await lab(page, "setItems", [...items(6), { id: "turn", anchor: true }, {
    id: "reply",
    height: 400,
  }]);
  await settle(page, 6);
  const s = await read(page);
  eq(s.offsets.turn, 64, "turn offset");
});
await scenario("async messages: default end applies after they mount", {
  count: 0,
}, async (page) => {
  await lab(page, "setItems", items(8));
  await settle(page, 6);
  const s = await read(page);
  assert(s.distanceToBottom <= 1, "distanceToBottom " + s.distanceToBottom);
});

// --- follow-bottom ------------------------------------------------------------
await scenario("at the end without autoScroll: later appends do not follow", {
  count: 8,
}, async (page) => {
  await lab(page, "append", items(1));
  await settle(page);
  const s = await read(page);
  eq(s.distanceToBottom, ITEM, "distanceToBottom");
  eq(s.endButtonActive, "true", "end active");
  assert(s.scrollable.includes("end"), "scrollable " + s.scrollable);
});
await scenario(
  "autoScroll follows appends and publishes end=false while following",
  { count: 8, autoScroll: 1 },
  async (page) => {
    await lab(page, "append", items(1));
    await settle(page);
    const s = await read(page);
    assert(s.distanceToBottom <= 1, "distanceToBottom " + s.distanceToBottom);
    eq(s.endButtonActive, "false", "end active");
    eq(s.hookEnd, false, "hook end");
  },
);
await scenario("autoScroll follows the last message growing", {
  count: 8,
  autoScroll: 1,
}, async (page) => {
  await lab(page, "setItem", "m7", { height: 300 });
  await settle(page, 6);
  const s = await read(page);
  assert(s.distanceToBottom <= 1, "distanceToBottom " + s.distanceToBottom);
});
await scenario("growth alone never releases follow (lastScrollTop guard)", {
  count: 8,
  autoScroll: 1,
}, async (page) => {
  await lab(page, "setItem", "m7", { height: 160 });
  await settle(page, 1);
  await lab(page, "setItem", "m7", { height: 240 });
  await settle(page, 1);
  await lab(page, "setItem", "m7", { height: 400 });
  await settle(page, 6);
  let s = await read(page);
  assert(s.distanceToBottom <= 1, "after growth " + s.distanceToBottom);
  await lab(page, "append", items(1));
  await settle(page);
  s = await read(page);
  assert(s.distanceToBottom <= 1, "after append " + s.distanceToBottom);
});
await scenario(
  "wheel scroll-up releases follow; a later append does not snap back",
  { count: 8, autoScroll: 1 },
  async (page) => {
    await wheel(page, -160);
    await settle(page, 6);
    const before = await read(page);
    assert(before.scrollTop < 440, "did not scroll up: " + before.scrollTop);
    await lab(page, "append", items(1));
    await settle(page);
    const s = await read(page);
    eq(s.scrollTop, before.scrollTop, "scrollTop");
    eq(s.endButtonActive, "true", "end active");
  },
);
await scenario("bare scroll-away (scrollbar drag) releases follow", {
  count: 8,
  autoScroll: 1,
}, async (page) => {
  await setScrollTop(page, 0);
  await settle(page, 6);
  await lab(page, "append", items(1));
  await settle(page);
  const s = await read(page);
  eq(s.scrollTop, 0, "scrollTop");
  assert(s.distanceToBottom > 0, "distanceToBottom");
});
await scenario(
  "PageUp releases follow",
  { count: 8, autoScroll: 1 },
  async (page) => {
    await page.locator('[aria-label="viewport"]').focus();
    await page.keyboard.press("PageUp");
    await settle(page, 6);
    await lab(page, "append", items(1));
    await settle(page);
    const s = await read(page);
    assert(s.distanceToBottom > 0, "distanceToBottom " + s.distanceToBottom);
  },
);
await scenario("scroll button returns to the end and re-arms follow", {
  count: 8,
  autoScroll: 1,
}, async (page) => {
  await setScrollTop(page, 0);
  await settle(page, 6);
  await page.locator('[data-testid="end-button"]').click();
  await settle(page, 8);
  let s = await read(page);
  assert(s.distanceToBottom <= 1, "after click " + s.distanceToBottom);
  await lab(page, "append", items(1));
  await settle(page);
  s = await read(page);
  assert(s.distanceToBottom <= 1, "after append " + s.distanceToBottom);
});
await scenario(
  "start button scrolls to the start",
  { count: 8 },
  async (page) => {
    await page.locator('[data-testid="start-button"]').click();
    await settle(page, 8);
    eq((await read(page)).scrollTop, 0, "scrollTop");
  },
);
await scenario(
  "a user gesture during a programmatic jump can re-arm follow at the bottom",
  { count: 8, autoScroll: 1 },
  async (page) => {
    eq(
      await lab(page, "scrollToMessage", "m0", {
        align: "start",
        behavior: "auto",
      }),
      true,
      "jump returned",
    );
    await settle(page);
    eq((await read(page)).scrollTop, 0, "jumped to top");
    await wheel(page, 2000);
    await settle(page, 8);
    let s = await read(page);
    assert(s.distanceToBottom <= 1, "wheeled to bottom " + s.distanceToBottom);
    await lab(page, "append", items(1));
    await settle(page);
    s = await read(page);
    assert(s.distanceToBottom <= 1, "re-armed follow " + s.distanceToBottom);
  },
);
await scenario("autoScroll toggled on at the end starts following", {
  count: 8,
}, async (page) => {
  await lab(page, "setAutoScroll", true);
  await settle(page, 6);
  await lab(page, "append", items(1));
  await settle(page);
  const s = await read(page);
  assert(s.distanceToBottom <= 1, "distanceToBottom " + s.distanceToBottom);
});

// --- anchoring ------------------------------------------------------------------
await scenario(
  "a new anchor lands at the reading line with the previous peek",
  { count: 8, peek: 64 },
  async (page) => {
    await lab(page, "append", [{ id: "turn", anchor: true }, {
      id: "reply",
      height: 300,
    }]);
    await settle(page);
    const s = await read(page);
    eq(s.offsets.turn, 64, "turn offset");
    eq(s.hookEnd, true, "hook end");
  },
);
await scenario(
  "an anchor with nothing below gets a tail spacer; spacer-only overflow shows no end button",
  { count: 8, peek: 64 },
  async (page) => {
    await lab(page, "append", [{ id: "turn", anchor: true }]);
    await settle(page);
    const s = await read(page);
    eq(s.offsets.turn, 64, "turn offset");
    eq(s.spacerHidden, false, "spacer shown");
    near(s.spacerHeight, 56, 1, "spacer height");
    eq(s.endButtonActive, "false", "end active");
    eq(s.hookEnd, false, "hook end");
    assert(!(s.scrollable ?? "").includes("end"), "scrollable " + s.scrollable);
  },
);
await scenario("bulk anchored appends while following keep the end", {
  count: 8,
  autoScroll: 1,
}, async (page) => {
  await lab(page, "append", [{ anchor: true }, { anchor: true }]);
  await settle(page);
  const s = await read(page);
  assert(s.distanceToBottom <= 1, "distanceToBottom " + s.distanceToBottom);
});
await scenario(
  "bulk anchored appends without autoScroll anchor the first new turn",
  { count: 8, peek: 64 },
  async (page) => {
    await lab(page, "append", [{ id: "a1", anchor: true }, {
      id: "a2",
      anchor: true,
    }]);
    await settle(page);
    eq((await read(page)).offsets.a1, 64, "a1 offset");
  },
);
await scenario(
  "anchor hold hands off to follow once the reply consumes the spacer",
  { count: 3, autoScroll: 1, peek: 64 },
  async (page) => {
    await lab(page, "append", [{ id: "turn", height: 20, anchor: true }]);
    await settle(page);
    let s = await read(page);
    eq(s.offsets.turn, 64, "turn placed");
    eq(s.scrollTop, 176, "scrollTop after anchor");
    await lab(page, "append", [{ id: "reply", height: 8 }]);
    await settle(page, 6);
    s = await read(page);
    eq(s.offsets.turn, 64, "held with 8px reply");
    await lab(page, "setItem", "reply", { height: 60 });
    await settle(page, 6);
    s = await read(page);
    eq(s.offsets.turn, 64, "held with 60px reply");
    await lab(page, "setItem", "reply", { height: 160 });
    await settle(page, 6);
    s = await read(page);
    assert(s.distanceToBottom <= 1, "handed off: " + s.distanceToBottom);
    eq(s.hookEnd, false, "hook end while following");
    await lab(page, "setItem", "reply", { height: 260 });
    await settle(page, 6);
    s = await read(page);
    assert(s.distanceToBottom <= 1, "still following: " + s.distanceToBottom);
  },
);
await scenario(
  "an anchored turn placed without a spacer holds while it grows",
  { count: 8, autoScroll: 1, peek: 64 },
  async (page) => {
    await lab(page, "append", [{ id: "turn", height: 40, anchor: true }, {
      id: "reply",
      height: 300,
    }]);
    await settle(page);
    eq((await read(page)).offsets.turn, 64, "turn placed");
    await lab(page, "setItem", "turn", { height: 160 });
    await settle(page, 6);
    eq((await read(page)).offsets.turn, 64, "turn held");
  },
);
await scenario("an anchored turn holds when the content below it collapses", {
  count: 0,
}, async (page) => {
  await lab(page, "setItems", [{ id: "b0", height: 300 }, {
    id: "b1",
    height: 300,
  }, { id: "b2", height: 300 }]);
  await settle(page, 6);
  await lab(page, "append", [{ id: "turn", anchor: true }, {
    id: "marker",
    height: 100,
  }]);
  await settle(page);
  assert((await read(page)).offsets.turn <= 68, "turn placed");
  await lab(page, "setItem", "marker", { height: 0 });
  await settle(page, 8);
  const s = await read(page);
  assert(s.offsets.turn <= 68, "turn dropped to " + s.offsets.turn);
});
await scenario("a replaced row (same count) that is an anchor gets anchored", {
  count: 8,
  peek: 64,
}, async (page) => {
  await lab(page, "replace", "m7", { id: "m7b", anchor: true });
  await settle(page);
  const s = await read(page);
  eq(s.offsets.m7b, 64, "m7b offset");
});

// --- prepend --------------------------------------------------------------------
async function prependCase(page, expectShift) {
  await setScrollTop(page, 3 * ITEM);
  await settle(page);
  const before = (await read(page)).offsets.m3;
  await lab(page, "prepend", [{ id: "o0" }, { id: "o1" }, { id: "o2" }]);
  await settle(page);
  const after = (await read(page)).offsets.m3;
  if (expectShift) near(after - before, 3 * ITEM, 1, "m3 shift");
  else near(after, before, 1, "m3 offset");
}
await scenario("prepend keeps the visible row in place (native anchoring)", {
  count: 8,
}, (page) => prependCase(page, false));
await scenario(
  "prepend keeps the visible row in place without native anchoring (engine restore)",
  { count: 8, noNativeAnchor: 1 },
  (page) => prependCase(page, false),
);
await scenario("preserveScrollOnPrepend=false lets the row shift", {
  count: 8,
  noNativeAnchor: 1,
  preserve: 0,
}, (page) => prependCase(page, true));
await scenario(
  "a scrolled-to turn is preserved across a prepend (command-path anchor)",
  { count: 8, noNativeAnchor: 1 },
  async (page) => {
    eq(
      await lab(page, "scrollToMessage", "m5", {
        align: "start",
        behavior: "auto",
      }),
      true,
      "jump",
    );
    await settle(page);
    eq((await read(page)).offsets.m5, 0, "m5 at top");
    await lab(page, "prepend", [{ id: "o0" }, { id: "o1" }, { id: "o2" }]);
    await settle(page);
    near((await read(page)).offsets.m5, 0, 1, "m5 preserved");
  },
);

// --- commands ---------------------------------------------------------------------
await scenario(
  "scrollToMessage aligns start/center/end/nearest and honors scrollMargin",
  { count: 8 },
  async (page) => {
    eq(
      await lab(page, "scrollToMessage", "m4", { align: "start" }),
      true,
      "start",
    );
    await settle(page);
    eq((await read(page)).offsets.m4, 0, "align start");
    await lab(page, "scrollToMessage", "m4", { align: "end" });
    await settle(page);
    eq((await read(page)).offsets.m4, VIEWPORT - ITEM, "align end");
    await lab(page, "scrollToMessage", "m4", { align: "center" });
    await settle(page);
    eq((await read(page)).offsets.m4, (VIEWPORT - ITEM) / 2, "align center");
    await lab(page, "scrollToMessage", "m0", { align: "nearest" });
    await settle(page);
    eq((await read(page)).scrollTop, 0, "nearest to top");
    await lab(page, "scrollToMessage", "m4", {
      align: "start",
      scrollMargin: 24,
    });
    await settle(page);
    eq((await read(page)).offsets.m4, 24, "scrollMargin");
  },
);
await scenario("scrollToMessage returns false for an unknown id after mount", {
  count: 8,
}, async (page) => {
  eq(await lab(page, "scrollToMessage", "nope"), false, "unknown id");
});
await scenario(
  "scrollToMessage queues before items mount and beats the default position",
  { count: 0 },
  async (page) => {
    eq(
      await lab(page, "scrollToMessage", "m5", { align: "start" }),
      true,
      "queued",
    );
    await lab(page, "setItems", items(8));
    await settle(page, 6);
    eq((await read(page)).offsets.m5, 0, "queued target flushed");
  },
);
await scenario(
  "scrollToEnd re-arms follow with autoScroll and clears the tail spacer",
  { count: 8, autoScroll: 1, peek: 64 },
  async (page) => {
    await lab(page, "append", [{ id: "turn", anchor: true }]);
    await settle(page);
    eq((await read(page)).spacerHidden, false, "spacer shown after anchor");
    eq(
      await lab(page, "scrollToEnd", { behavior: "auto" }),
      true,
      "scrollToEnd",
    );
    await settle(page, 6);
    let s = await read(page);
    assert(s.distanceToBottom <= 1, "at end " + s.distanceToBottom);
    eq(s.spacerHidden, true, "spacer cleared");
    await lab(page, "append", items(1));
    await settle(page);
    s = await read(page);
    assert(s.distanceToBottom <= 1, "following " + s.distanceToBottom);
  },
);

// --- visibility -----------------------------------------------------------------------
await scenario(
  "visibility populates only while subscribed and again on resubscribe",
  { count: 8 },
  async (page) => {
    await lab(page, "setVisibility", true);
    await settle(page, 6);
    let s = await read(page);
    assert(s.visibleIds.length > 0, "visible ids after subscribe");
    eq(s.currentAnchor, null, "no anchors → null");
    await lab(page, "setVisibility", false);
    await settle(page, 4);
    await lab(page, "setVisibility", true);
    await settle(page, 6);
    s = await read(page);
    assert(s.visibleIds.length > 0, "visible ids after resubscribe");
  },
);
await scenario(
  "visibility: current anchor stays current after scrolling above the viewport",
  { count: 30, anchorEvery: 10, defaultScrollPosition: "start", visibility: 1 },
  async (page) => {
    eq((await read(page)).currentAnchor, "m0", "opened at m0");
    await setScrollTop(page, 900);
    await settle(page, 6);
    let s = await read(page);
    eq(s.currentAnchor, "m10", "current after 900");
    assert(!s.visibleIds.includes("m10"), "m10 not visible");
    await setScrollTop(page, 1700);
    await settle(page, 6);
    eq((await read(page)).currentAnchor, "m20", "current after 1700");
  },
);
await scenario(
  "visibility: the anchor at the reading line stays current over lower visible anchors; ids in document order",
  { count: 12, anchorEvery: 1, defaultScrollPosition: "start", visibility: 1 },
  async (page) => {
    await setScrollTop(page, 5 * ITEM);
    await settle(page, 6);
    const s = await read(page);
    eq(s.currentAnchor, "m5", "current");
    assert(s.visibleIds.includes("m6"), "m6 visible");
    const idx = s.visibleIds.map((id) => Number(id.slice(1)));
    assert(
      idx.every((v, i) => i === 0 || v > idx[i - 1]),
      "document order " + s.visibleIds.join(","),
    );
  },
);
await scenario("remount keeps following and repopulates visibility", {
  count: 8,
  autoScroll: 1,
  visibility: 1,
}, async (page) => {
  await lab(page, "remount");
  await settle(page, 8);
  let s = await read(page);
  assert(s.distanceToBottom <= 1, "at end after remount " + s.distanceToBottom);
  assert(s.visibleIds.length > 0, "visibility after remount");
  await lab(page, "append", items(1));
  await settle(page);
  s = await read(page);
  assert(
    s.distanceToBottom <= 1,
    "following after remount " + s.distanceToBottom,
  );
});

await browser.close();
const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} passed`);
process.exit(failed.length ? 1 : 0);
```

- [ ] **Step 5: Run the suite; expect early failures; fix the ENGINE, not the
      expectations**

```bash
cd "$SCRATCH/pw" && node message-scroller.mjs http://localhost:3228
```

Debug loop: re-run a single scenario with the substring filter
(`node message-scroller.mjs http://localhost:3228 "hands off"`), add temporary
`console.log`s in the engine or `page.evaluate` probes, fix in Task 3/4 files,
`deno check` them, re-run. Expectations come from upstream's tests; if one is
genuinely wrong for a 200px viewport, recompute it from geometry (numbers
documented next to each scenario in the spec §8) — do not loosen tolerances
beyond ±1px. Only when ALL scenarios pass and there are zero page/console errors
is this task done. Also verify no `STRICT_READ`/reactivity warnings appear in
the dev console output (`page.on("console")` type "warning" — print them once
and make sure none originate from `message-scroller-*` files).

- [ ] **Step 6: Commit engine fixes (lab route stays untracked)**

```bash
git status --short   # must NOT list src/routes/message-scroller-lab.tsx
git add apps/docs/src/registry/ui/message-scroller-*.ts apps/docs/src/registry/ui/message-scroller-*.tsx
git commit -m "Fix message-scroller engine issues found by the behavior suite"
```

(Skip the commit if the suite passed with no changes.)

---

### Task 7: Styled wrapper, `scroll-fade` utilities, registry entry

**Files:**

- Create: `apps/docs/src/registry/ui/message-scroller.tsx`
- Modify: `apps/docs/src/styles/app.css` (append the scroll-fade block after the
  `shimmer-none` utility, before `@utility no-scrollbar`)
- Modify: `apps/docs/src/registry/registry-ui.ts` (the `message-scroller` item,
  `dependencies`)
- Reference: upstream `apps/v4/registry/bases/base/ui/message-scroller.tsx`;
  ground truth for the inlined classes
  `git show main:apps/docs/public/r/message-scroller.json`; CSS source
  `ui/packages/shadcn/src/tailwind.css` lines 97–519 (`/* scroll-fade */` …
  `@utility scroll-fade-none { … }`).

**Interfaces:**

- Consumes: Task 5 barrel; `Button`/`ButtonProps` from `./button.tsx`;
  `IconPlaceholder`.
- Produces (exact names, imported by every example and the docs):
  `MessageScrollerProvider`, `MessageScroller`, `MessageScrollerViewport`,
  `MessageScrollerContent`, `MessageScrollerItem`, `MessageScrollerButton`,
  `useMessageScroller`, `useMessageScrollerScrollable`,
  `useMessageScrollerVisibility`, type `MessageScrollerButtonProps`.

- [ ] **Step 1: Write `message-scroller.tsx`**

```tsx
import type { ComponentProps } from "@solidjs/web";
import { cn } from "~/lib/utils.ts";
import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";
import type { Component } from "solid-js";
import { omit } from "solid-js";
import type { ButtonProps } from "./button.tsx";
import { Button } from "./button.tsx";
import type {
  MessageScrollerButtonDirection,
  MessageScrollerContentProps,
  MessageScrollerItemProps,
  MessageScrollerViewportProps,
} from "./message-scroller-primitive.ts";
import {
  MessageScroller as MessageScrollerPrimitive,
  useMessageScroller,
  useMessageScrollerScrollable,
  useMessageScrollerVisibility,
} from "./message-scroller-primitive.ts";

const MessageScrollerProvider = MessageScrollerPrimitive.Provider;

const MessageScroller: Component<ComponentProps<"div">> = (props) => {
  const others = omit(props, "class");
  return (
    <MessageScrollerPrimitive.Root
      data-slot="message-scroller"
      class={cn(
        "group/message-scroller relative flex size-full min-h-0 flex-col overflow-hidden",
        props.class,
      )}
      {...others}
    />
  );
};

const MessageScrollerViewport: Component<MessageScrollerViewportProps> = (
  props,
) => {
  const others = omit(props, "class");
  return (
    <MessageScrollerPrimitive.Viewport
      data-slot="message-scroller-viewport"
      class={cn(
        "size-full min-h-0 min-w-0 scroll-fade-b scrollbar-thin scrollbar-gutter-stable overflow-y-auto overscroll-contain contain-content data-autoscrolling:scrollbar-thumb-transparent data-autoscrolling:scrollbar-track-transparent",
        props.class,
      )}
      {...others}
    />
  );
};

const MessageScrollerContent: Component<MessageScrollerContentProps> = (
  props,
) => {
  const others = omit(props, "class");
  return (
    <MessageScrollerPrimitive.Content
      data-slot="message-scroller-content"
      class={cn("gap-6 flex h-max min-h-full flex-col", props.class)}
      {...others}
    />
  );
};

const MessageScrollerItem: Component<MessageScrollerItemProps> = (props) => {
  const others = omit(props, "class", "scrollAnchor");
  return (
    <MessageScrollerPrimitive.Item
      data-slot="message-scroller-item"
      scrollAnchor={props.scrollAnchor ?? false}
      class={cn(
        "min-w-0 shrink-0 [contain-intrinsic-size:auto_10rem] [content-visibility:auto]",
        props.class,
      )}
      {...others}
    />
  );
};

type MessageScrollerButtonProps =
  & ComponentProps<"button">
  & Pick<ButtonProps, "variant" | "size">
  & {
    // Native scroll behavior when clicked. Defaults to "smooth".
    behavior?: ScrollBehavior;
    // Transcript edge to scroll toward. Defaults to "end".
    direction?: MessageScrollerButtonDirection;
  };

const MessageScrollerButton: Component<MessageScrollerButtonProps> = (
  props,
) => {
  const others = omit(
    props,
    "class",
    "children",
    "direction",
    "variant",
    "size",
  );
  const direction = (): MessageScrollerButtonDirection =>
    props.direction ?? "end";
  const variant = (): MessageScrollerButtonProps["variant"] =>
    props.variant ?? "secondary";
  const size = (): MessageScrollerButtonProps["size"] =>
    props.size ?? "icon-sm";

  return (
    <MessageScrollerPrimitive.Button
      as={Button<"button">}
      data-slot="message-scroller-button"
      data-direction={direction()}
      data-variant={variant()}
      data-size={size()}
      direction={direction()}
      variant={variant()}
      size={size()}
      class={cn(
        "absolute inset-s-1/2 -translate-x-1/2 border-border bg-background text-foreground transition-[translate,scale,opacity] duration-200 hover:bg-muted hover:text-foreground data-[active=false]:pointer-events-none data-[active=false]:scale-95 data-[active=false]:opacity-0 data-[active=false]:duration-400 data-[active=false]:ease-[cubic-bezier(0.7,0,0.84,0)] data-[active=true]:translate-y-0 data-[active=true]:scale-100 data-[active=true]:opacity-100 data-[active=true]:ease-[cubic-bezier(0.23,1,0.32,1)] data-[direction=end]:bottom-4 data-[direction=end]:data-[active=false]:translate-y-full data-[direction=start]:top-4 data-[direction=start]:data-[active=false]:-translate-y-full rtl:translate-x-1/2 data-[direction=start]:[&_svg]:rotate-180",
        props.class,
      )}
      {...others}
    >
      {props.children ?? (
        <>
          <IconPlaceholder
            lucide="arrow-down"
            tabler="arrow-down"
            ph="arrow-down"
            ri="arrow-down-line"
            hugeicons="arrow-down-02"
          />
          <span class="sr-only">
            {direction() === "end" ? "Scroll to end" : "Scroll to start"}
          </span>
        </>
      )}
    </MessageScrollerPrimitive.Button>
  );
};

export type { MessageScrollerButtonProps };
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
```

Class strings are upstream's with the `cn-message-scroller*` markers removed
(nova defines only `cn-message-scroller-content` → `gap-6`); confirm each string
against the five in `git show main:apps/docs/public/r/message-scroller.json`
(order may differ — `deno lint --fix` reorders Tailwind classes; content must
match as a set).

- [ ] **Step 2: Check the wrapper**

Run:
`deno fmt src/registry/ui/message-scroller.tsx && deno lint --fix src/registry/ui/message-scroller.tsx && deno check src/registry/ui/message-scroller.tsx`
Expected: clean. If `deno check` reports TS2322 on `disabled`/`type`/`tabindex`
when spreading `others` into the primitive Button (Solid 2 intrinsic button
attrs vs Kobalte Button's narrower types), re-declare them the way
`ComboboxClearProps` does in `combobox.tsx`:

```ts
type MessageScrollerButtonProps =
  & Omit<ComponentProps<"button">, "disabled" | "type" | "tabindex">
  & { disabled?: boolean; type?: string; tabindex?: number | string }
  & Pick<ButtonProps, "variant" | "size">
  & { behavior?: ScrollBehavior; direction?: MessageScrollerButtonDirection };
```

- [ ] **Step 3: Append the scroll-fade family to `app.css`**

Insert, right after the `@utility shimmer-none { … }` block and before
`@utility no-scrollbar`, the upstream block copied verbatim:

```bash
awk 'NR>=97 && NR<=519' /Users/ptzburn/Documents/projects/ui/packages/shadcn/src/tailwind.css > "$SCRATCH/scroll-fade.css"
head -3 "$SCRATCH/scroll-fade.css"   # must start with "/* scroll-fade */" and "@property --scroll-fade-t {"
tail -3 "$SCRATCH/scroll-fade.css"   # must end with the closing "}" of "@utility scroll-fade-none"
```

Then edit `apps/docs/src/styles/app.css`: place the file's contents (prefixed by
a one-line comment
`/* scroll-fade — scroll-aware edge fades (ported verbatim from shadcn/tailwind.css) */`)
between the `shimmer-none` utility and `@utility no-scrollbar`. Keep the
`@theme inline { @keyframes … }` wrapper exactly as upstream has it. Result:
`grep -c "^@utility scroll-fade" src/styles/app.css` prints `15` (scroll-fade,
-y, -x, -t, -b, -l, -r, -s, -e, `-*`, `-t-*`, `-b-*`, `-s-*`, `-e-*`, `-none`).

- [ ] **Step 4: Update the registry entry deps**

In `apps/docs/src/registry/registry-ui.ts`, in the `name: "message-scroller"`
item change `dependencies: ["@kobalte/core", "@solid-primitives/refs"],` →
`dependencies: ["@kobalte/core"],`. Leave `registryDependencies: ["button"]` and
the six `files` entries as they are.

- [ ] **Step 5: Build the registry and check**

```bash
cd apps/docs && deno task build:registry 2>&1 | tail -20
```

Expected: the `message-scroller` ui item is no longer skipped (the five example
entries still are — until Tasks 10–13); `public/r/message-scroller.json` now
exists with six files and `"dependencies":["@kobalte/core"]`; the icon map
gained `arrow-down` if it was missing. Then
`deno check src/registry/ui/message-scroller.tsx src/registry/registry-ui.ts`.

- [ ] **Step 6: Smoke the styles in the browser**

Create `$SCRATCH/pw/smoke.mjs` (the page-load sweep used in every task from here
on):

```js
// Usage: node smoke.mjs <baseUrl> <path> [<path>...]
// Loads each docs page in headless Chromium, waits for demos to render, and
// reports console errors / page errors / missing-demo fallbacks.
import { chromium } from "playwright-core";
import os from "node:os";
const [base, ...paths] = process.argv.slice(2);
const exe =
  `${os.homedir()}/Library/Caches/ms-playwright/chromium-1148/chrome-mac/Chromium.app/Contents/MacOS/Chromium`;
const browser = await chromium.launch({ executablePath: exe, headless: true });
let failed = 0;
for (const p of paths) {
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push("pageerror: " + e.message));
  page.on("console", (m) => {
    if (m.type() === "error" && !/403|api\.github\.com/.test(m.text())) {
      errors.push("console: " + m.text());
    }
  });
  await page.goto(base + p, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  const previews = await page.locator("[data-slot='component-preview']")
    .count();
  const notFound = await page.getByText("not found in registry").count();
  const h1 = await page.locator("h1").first().textContent().catch(() => "");
  const ok = errors.length === 0 && notFound === 0;
  if (!ok) failed++;
  console.log(
    `${ok ? "OK " : "BAD"} ${p}  h1=${
      JSON.stringify(h1)
    } previews=${previews} notFound=${notFound}`,
  );
  for (const e of errors) console.log("     " + e.slice(0, 300));
  await page.close();
}
await browser.close();
process.exit(failed ? 1 : 0);
```

Run:
`node "$SCRATCH/pw/smoke.mjs" http://localhost:3228 /docs/components/attachment`
→ `OK` (AttachmentGroup's `scroll-fade-x` now resolves; visually confirm later
with a screenshot if in doubt:
`page.screenshot({ path: "$SCRATCH/attachment.png" })`). Also confirm the
compiled CSS contains the utility: in headless Chromium on that page evaluate
`[...document.styleSheets].some((s) => { try { return [...s.cssRules].some((r) => r.cssText.includes("scroll-fade")); } catch { return false; } })`
→ `true`.

- [ ] **Step 7: Commit**

```bash
git add apps/docs/src/registry/ui/message-scroller.tsx apps/docs/src/styles/app.css apps/docs/src/registry/registry-ui.ts apps/docs/public/r apps/docs/public/registry apps/docs/src/__registry__ apps/docs/src/registry/icons/__lucide__
git commit -m "Port the styled message-scroller and the scroll-fade utility family"
```

---

### Task 8: `~/lib/ai.ts` — docs-only chat simulator

**Files:**

- Create: `apps/docs/src/lib/ai.ts`

**Interfaces:**

- Produces (used by Tasks 10–13):
  - `type ChatMessage = { id: string; role: "user" | "assistant"; text: string }`,
    `type ChatStatus = "ready" | "submitted" | "streaming"`
  - `createChat(): Chat` with `.user(text, { id? })`,
    `.assistant(text, { id? })`, `.sleep(ms)` (chainable), `.get(count?)`,
    `.next(messages)`, `.transport({ delayMs? })`
  - `createChatSession({ messages?, transport }): { messages: Store<ChatMessage[]>; status: Accessor<ChatStatus>; sendMessage(m): void; setMessages(list): void }`
  - `getMessageText(m): string`

- [ ] **Step 1: Write the file**

```ts
// Docs-only stand-in for upstream's `@/lib/ai` (the @shadcn/helpers AI-SDK
// runtime + `useChat`). Scripts a deterministic conversation and replays it
// with simulated streaming so the message-scroller examples can stay
// near-verbatim ports. Not part of the registry.
import type { Accessor, Store } from "solid-js";
import { createSignal, createStore, onCleanup } from "solid-js";

type ChatRole = "user" | "assistant";

type ChatMessage = {
  id: string;
  role: ChatRole;
  text: string;
};

type ChatStatus = "ready" | "submitted" | "streaming";

type ChatTurnOptions = {
  id?: string;
};

type ChatTransportHandlers = {
  onStart: (reply: ChatMessage) => void;
  onDelta: (reply: ChatMessage) => void;
  onFinish: () => void;
};

// Streams the scripted assistant turn that follows a user message. `respond`
// returns a cancel function.
type ChatTransport = {
  respond: (
    userMessage: Pick<ChatMessage, "id">,
    handlers: ChatTransportHandlers,
  ) => () => void;
};

// A deterministic conversation: chain turns, then read them back or stream them
// through a transport (mirrors the upstream Chat surface the examples use).
type Chat = {
  // Scripts a user turn.
  user: (text: string, options?: ChatTurnOptions) => Chat;
  // Scripts an assistant turn (streamed word by word by the transport).
  assistant: (text: string, options?: ChatTurnOptions) => Chat;
  // Delays the next turn's stream.
  sleep: (delayMs: number) => Chat;
  // Clones of the first `count` scripted messages, or all when omitted.
  get: (count?: number) => ChatMessage[];
  // The next scripted user message after the given transcript, or null.
  next: (messages: readonly Pick<ChatMessage, "id">[]) => ChatMessage | null;
  // The transport that streams scripted assistant replies.
  transport: (options?: { delayMs?: number }) => ChatTransport;
};

const DEFAULT_STREAM_DELAY_MS = 50;

function cloneMessage(message: ChatMessage): ChatMessage {
  return { id: message.id, role: message.role, text: message.text };
}

function createChat(): Chat {
  const turns: ChatMessage[] = [];
  // delays[i] = ms to wait before turn i starts streaming (from .sleep()).
  const delays: number[] = [];
  let pendingSleep = 0;

  const push = (role: ChatRole, text: string, options?: ChatTurnOptions) => {
    turns.push({
      id: options?.id ?? `${role}-${turns.length + 1}`,
      role,
      text,
    });
    delays.push(pendingSleep);
    pendingSleep = 0;
  };

  const chat: Chat = {
    user(text, options) {
      push("user", text, options);
      return chat;
    },
    assistant(text, options) {
      push("assistant", text, options);
      return chat;
    },
    sleep(delayMs) {
      pendingSleep = delayMs;
      return chat;
    },
    get(count) {
      return turns.slice(0, count ?? turns.length).map(cloneMessage);
    },
    next(messages) {
      const last = messages[messages.length - 1];
      const start = last
        ? turns.findIndex((turn) => turn.id === last.id) + 1
        : 0;
      const next = turns.slice(start).find((turn) => turn.role === "user");
      return next ? cloneMessage(next) : null;
    },
    transport({ delayMs = DEFAULT_STREAM_DELAY_MS } = {}) {
      return {
        respond(userMessage, handlers) {
          const index = turns.findIndex((turn) => turn.id === userMessage.id);
          const reply = index >= 0 ? turns[index + 1] : undefined;

          if (!reply || reply.role !== "assistant") {
            const done = setTimeout(() => handlers.onFinish(), 0);
            return () => clearTimeout(done);
          }

          // One word per tick, keeping trailing whitespace so paragraph
          // breaks survive (upstream's splitTextDeltas: /\S+\s*/g).
          const deltas = reply.text.match(/\S+\s*/g) ?? [reply.text];
          let cancelled = false;
          let count = 0;
          let timer: ReturnType<typeof setTimeout> | null = null;

          const tick = () => {
            if (cancelled) return;
            count += 1;
            handlers.onDelta({
              ...reply,
              text: deltas.slice(0, count).join(""),
            });
            if (count >= deltas.length) {
              handlers.onFinish();
              return;
            }
            timer = setTimeout(tick, delayMs);
          };

          const startTimer = setTimeout(() => {
            if (cancelled) return;
            handlers.onStart({ ...reply, text: "" });
            timer = setTimeout(tick, delayMs);
          }, delays[index + 1] ?? 0);

          return () => {
            cancelled = true;
            clearTimeout(startTimer);
            if (timer !== null) clearTimeout(timer);
          };
        },
      };
    },
  };

  return chat;
}

// The Solid stand-in for `useChat`: a reactive transcript (store, so a streaming
// row updates in place instead of being re-created), a status accessor, and
// the two commands the examples call. Timers stop on disposal and on reset.
function createChatSession(options: {
  messages?: ChatMessage[];
  transport: ChatTransport;
}): {
  messages: Store<ChatMessage[]>;
  status: Accessor<ChatStatus>;
  sendMessage: (message: ChatMessage) => void;
  setMessages: (messages: ChatMessage[]) => void;
} {
  const [messages, setMessages] = createStore<ChatMessage[]>(
    (options.messages ?? []).map(cloneMessage),
  );
  const [status, setStatus] = createSignal<ChatStatus>("ready");
  let cancel: (() => void) | null = null;

  const stop = () => {
    cancel?.();
    cancel = null;
  };

  const sendMessage = (message: ChatMessage) => {
    stop();
    setMessages((list) => {
      list.push(cloneMessage(message));
    });
    setStatus("submitted");
    cancel = options.transport.respond(message, {
      onStart(reply) {
        setMessages((list) => {
          list.push(cloneMessage(reply));
        });
        setStatus("streaming");
      },
      onDelta(reply) {
        setMessages((list) => {
          const target = list.find((entry) => entry.id === reply.id);
          if (target) target.text = reply.text;
        });
      },
      onFinish() {
        cancel = null;
        setStatus("ready");
      },
    });
  };

  const replaceMessages = (next: ChatMessage[]) => {
    stop();
    setMessages(() => next.map(cloneMessage));
    setStatus("ready");
  };

  onCleanup(stop);

  return { messages, status, sendMessage, setMessages: replaceMessages };
}

function getMessageText(message: Pick<ChatMessage, "text">): string {
  return message.text;
}

export { createChat, createChatSession, getMessageText };
export type { Chat, ChatMessage, ChatStatus, ChatTransport };
```

- [ ] **Step 2: Check**

Run:
`deno fmt src/lib/ai.ts && deno lint --fix src/lib/ai.ts && deno check src/lib/ai.ts`
Expected: clean. If `Store` is not exported from `solid-js`, type `messages` as
`ChatMessage[]` (the store proxy is assignable).

- [ ] **Step 3: Commit**

```bash
git add apps/docs/src/lib/ai.ts
git commit -m "Add the docs chat simulator (createChat/createChatSession)"
```

---

### Task 9: Animation presets + `MessageAnimated` chrome

**Files:**

- Create: `apps/docs/src/lib/message-animations.ts`
- Create: `apps/docs/src/components/message-animated.tsx`
- Reference: upstream `apps/v4/lib/message-animations.ts`,
  `apps/v4/components/message-animated.tsx`

**Interfaces:**

- Produces:
  `MESSAGE_ANIMATIONS: Record<MessageAnimationId, MessageAnimationPreset>`,
  types `MessageAnimationId`,
  `MessageAnimationPreset = { id; name; class: string }`; `MessageAnimated`
  component with props
  `{ message: { id: string; role: string; text: string }; scrollAnchor?: boolean; animationPreset?: MessageAnimationPreset; userVariant?: BubbleVariant; assistantVariant?: BubbleVariant; class?: string }`
  (rest spread onto `MessageScrollerItem`).

- [ ] **Step 1: Write `message-animations.ts`**

```ts
// Entrance presets for MessageAnimated. Upstream drives these with motion
// variants; here each preset is a tw-animate-css class set applied to the user
// row on mount (assistant rows never animate). motion-reduce disables them.
const ANIMATIONS = [
  { id: "fade", name: "Fade", class: "animate-in fade-in duration-200" },
  {
    id: "slide-up",
    name: "Slide Up",
    class:
      "animate-in fade-in slide-in-from-bottom-2 duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
  },
  {
    id: "slide-side",
    name: "Slide Side",
    class:
      "animate-in fade-in slide-in-from-right-4 duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
  },
  {
    id: "pop",
    name: "Pop",
    class:
      "animate-in fade-in zoom-in-95 slide-in-from-bottom-1 duration-300 ease-out origin-bottom-right",
  },
  {
    id: "spring-bounce",
    name: "Spring Bounce",
    class:
      "animate-in fade-in zoom-in-95 slide-in-from-bottom-3 duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
  },
  {
    id: "blur-fade",
    name: "Blur Fade",
    class:
      "animate-in fade-in blur-in-4 slide-in-from-bottom-1 duration-300 ease-out",
  },
  {
    id: "scale-fade",
    name: "Scale Fade",
    class: "animate-in fade-in zoom-in-[0.98] duration-250 ease-out",
  },
] as const satisfies readonly { id: string; name: string; class: string }[];

type MessageAnimationPreset = (typeof ANIMATIONS)[number];
type MessageAnimationId = MessageAnimationPreset["id"];

const MESSAGE_ANIMATIONS = ANIMATIONS.reduce(
  (acc, preset) => {
    acc[preset.id] = preset;
    return acc;
  },
  {} as Record<MessageAnimationId, MessageAnimationPreset>,
);

export { MESSAGE_ANIMATIONS };
export type { MessageAnimationId, MessageAnimationPreset };
```

- [ ] **Step 2: Write `message-animated.tsx`**

```tsx
import type { ComponentProps } from "@solidjs/web";
import { cn } from "~/lib/utils.ts";
import type { MessageAnimationPreset } from "~/lib/message-animations.ts";
import { MESSAGE_ANIMATIONS } from "~/lib/message-animations.ts";
import { Bubble, BubbleContent } from "~/registry/ui/bubble.tsx";
import { MessageScrollerItem } from "~/registry/ui/message-scroller.tsx";
import { Message, MessageContent } from "~/registry/ui/message.tsx";
import type { Component } from "solid-js";
import { createMemo, For, omit } from "solid-js";

type MessageAnimatedMessage = {
  id: string;
  role: string;
  text: string;
};

type BubbleVariant = ComponentProps<typeof Bubble>["variant"];

type MessageAnimatedProps =
  & Omit<ComponentProps<typeof MessageScrollerItem>, "children" | "messageId">
  & {
    animationPreset?: MessageAnimationPreset;
    assistantVariant?: BubbleVariant;
    message: MessageAnimatedMessage;
    userVariant?: BubbleVariant;
  };

// The docs' animated transcript row: user rows animate in with the preset
// (upstream: motion.create(MessageScrollerItem)); assistant rows render plain.
const MessageAnimated: Component<MessageAnimatedProps> = (props) => {
  const others = omit(
    props,
    "animationPreset",
    "assistantVariant",
    "class",
    "message",
    "scrollAnchor",
    "userVariant",
  );
  const isUserMessage = () => props.message.role === "user";
  const preset = () => props.animationPreset ?? MESSAGE_ANIMATIONS["slide-up"];

  return (
    <MessageScrollerItem
      messageId={props.message.id}
      scrollAnchor={isUserMessage()
        ? (props.scrollAnchor ?? true)
        : props.scrollAnchor}
      class={cn(
        isUserMessage() && [preset().class, "motion-reduce:animate-none"],
        props.class,
      )}
      {...others}
    >
      <MessageAnimatedRow
        message={props.message}
        assistantVariant={props.assistantVariant ?? "ghost"}
        userVariant={props.userVariant ?? "muted"}
      />
    </MessageScrollerItem>
  );
};

const MessageAnimatedRow: Component<{
  assistantVariant: BubbleVariant;
  message: MessageAnimatedMessage;
  userVariant: BubbleVariant;
}> = (props) => {
  const isUserMessage = () => props.message.role === "user";
  const paragraphs = createMemo(() =>
    props.message.text
      .split(/\n\s*\n/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean)
  );

  return (
    <Message align={isUserMessage() ? "end" : "start"}>
      <MessageContent>
        <Bubble
          variant={isUserMessage() ? props.userVariant : props.assistantVariant}
        >
          <BubbleContent class="space-y-2">
            <For each={paragraphs()} keyed={false}>
              {(paragraph) => <p class="whitespace-pre-wrap">{paragraph()}</p>}
            </For>
          </BubbleContent>
        </Bubble>
      </MessageContent>
    </Message>
  );
};

export { MessageAnimated };
export type { MessageAnimatedProps };
```

Notes: `For keyed={false}` keeps each `<p>` node while its text streams (item is
an accessor). `class` uses `cn` — pass the array through `cn` (clsx accepts
nested arrays). Verify `Bubble`'s `variant` prop name/values in
`src/registry/ui/bubble.tsx` (`"muted" | "ghost" | "tinted" | …`) and
`Message`'s `align` prop (`"start" | "end"`) — adjust the types if the ported
names differ.

- [ ] **Step 3: Check both files**

Run:
`deno fmt src/lib/message-animations.ts src/components/message-animated.tsx && deno lint --fix src/lib/message-animations.ts src/components/message-animated.tsx && deno check src/lib/message-animations.ts src/components/message-animated.tsx`
Expected: clean.

- [ ] **Step 4: Commit**

```bash
git add apps/docs/src/lib/message-animations.ts apps/docs/src/components/message-animated.tsx
git commit -m "Add MessageAnimated docs chrome and animation presets"
```

---

### Task 10: Docs page (before the examples, so each example task can verify its preview live)

**Files:**

- Create: `apps/docs/src/routes/(app)/docs/components/message-scroller.mdx`
- Source: upstream `apps/v4/content/docs/components/base/message-scroller.mdx`
  (structure + prose) and `apps/v4/content/docs/react/message-scroller.mdx`
  lines 135–277 (API tables); main's page
  `git show main:"apps/docs/src/routes/(app)/docs/components/message-scroller.mdx"`
  for the install Callout and accessor Callout wording.

**Interfaces:**

- Consumes: `ComponentPreview` (`name`, `previewClassName`, `hideCode`),
  `ComponentSource`, `CodeTabs`/`TabsList`/`TabsTrigger`/`TabsContent`,
  `Steps`/`Step`, `Callout` from the MDX component map. Previews referencing
  not-yet-ported examples render the "not found in registry." fallback —
  expected until Tasks 11–14 land.

- [ ] **Step 1: Copy upstream's base page and apply these edits, top to bottom**

```bash
cp /Users/ptzburn/Documents/projects/ui/apps/v4/content/docs/components/base/message-scroller.mdx "apps/docs/src/routes/(app)/docs/components/message-scroller.mdx"
```

1. Frontmatter: keep `title` and `description`; delete the `base: base` and
   `component: true` lines.
2. Every `<ComponentPreview …>` becomes exactly
   `<ComponentPreview name="<same name>" previewClassName="h-auto p-4 sm:p-10" />`,
   keeping `hideCode` where upstream has it (opening-position, commands,
   visibility). Remove `styleName` and `className`. There are eleven: demo,
   anchoring, group-chat, previous-context, streaming, opening-position,
   load-history, animation, commands, visibility, scrollable.
3. Installation block — replace upstream's with:

````mdx
<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">Command</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>

<TabsContent value="cli">

```bash
npx @ptzburn/shadcn-solidjs@latest add message-scroller
```

</TabsContent>

<TabsContent value="manual">

<Steps class="mb-0 pt-2">

<Step>Install the following dependencies:</Step>

```bash
npm install @kobalte/core
```

<Step>Install the following components:</Step>

```bash
npx @ptzburn/shadcn-solidjs@latest add button
```

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource name="message-scroller" />

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

<Callout>
  Unlike upstream, where the behaviour ships as the `@shadcn/react` package,
  the scroll engine is copied into your project alongside the styled parts:
  `message-scroller.tsx` plus five `message-scroller-*` modules. The CLI
  installs all six.
</Callout>
````

4. Usage: import paths `@/components/ui/message` → `~/components/ui/message`,
   `@/components/ui/message-scroller` → `~/components/ui/message-scroller`; the
   list snippet becomes

```tsx
<MessageScrollerProvider>
  <MessageScroller>
    <MessageScrollerViewport>
      <MessageScrollerContent>
        <For each={messages()}>
          {(message) => (
            <MessageScrollerItem
              messageId={message.id}
              scrollAnchor={message.role === "user"}
            >
              <Message />
            </MessageScrollerItem>
          )}
        </For>
      </MessageScrollerContent>
    </MessageScrollerViewport>
    <MessageScrollerButton />
  </MessageScroller>
</MessageScrollerProvider>;
```

and the height-constrained snippet uses `class=` instead of `className=`. 5.
"Animating New Messages": replace the paragraph starting "A common chat
pattern…" through the `motion.create` code block with:

````md
A common chat pattern is to animate the user's message when it is sent, then let
the assistant reply stream into a regular row below it. Keep `messageId` and
`scrollAnchor` on the item and add an entrance class — the docs use
tw-animate-css presets, which only touch transform and opacity.

```tsx
<MessageScrollerItem
  messageId={message.id}
  scrollAnchor
  class="animate-in fade-in slide-in-from-bottom-2 motion-reduce:animate-none"
>
  <Message />
</MessageScrollerItem>;
```
````

Keep the preview and the closing "Avoid animating height…" paragraph. 6.
"Jumping to Messages": import path → `~/components/ui/message-scroller`. Keep
the rest. 7. "Tracking the Reader's Position": import path →
`~/components/ui/message-scroller`; the destructuring snippet becomes

```tsx
const visibility = useMessageScrollerVisibility();

visibility().currentAnchorId;
visibility().visibleMessageIds;
```

8. "Reading Scroll State": import path → `~/components/ui/message-scroller`;
   snippet becomes

```tsx
const scrollable = useMessageScrollerScrollable();

scrollable().start;
scrollable().end;
```

and after the preview add main's Callout:

```mdx
<Callout>
  The two state hooks return Solid accessors, so read them inside a tracked
  scope: `scrollable().end`, not `scrollable.end`. `useMessageScroller`
  returns plain functions and needs no call.
</Callout>
```

9. Performance: rewrite the second paragraph's React wording: "…keep the scroll
   hot path outside of the reactive graph: no signal updates for transcript
   rows, no forced layout on every scroll, and as little off-screen paint work
   as the browser can avoid." and "so scrolling and streaming do not re-render
   transcript rows."
10. Virtualization: keep the prose; replace the code block with this Solid
    snippet and add the Callout before it:

````mdx
<Callout>
  `@tanstack/solid-virtual` currently pins Solid 1, so this snippet shows the
  shape of the integration and is not yet verified on Solid 2.
</Callout>

```tsx showLineNumbers
import { createVirtualizer } from "@tanstack/solid-virtual"
import { For } from "solid-js"

function VirtualizedTranscript(props: {
  messages: Array<{ id: string; content: JSX.Element }>
}) {
  let viewportRef: HTMLDivElement | undefined

  const virtualizer = createVirtualizer({
    get count() {
      return props.messages.length
    },
    getScrollElement: () => viewportRef ?? null,
    estimateSize: () => 86,
    getItemKey: (index) => props.messages[index]?.id ?? index,
    overscan: 8,
  })

  return (
    <MessageScrollerProvider>
      <MessageScroller>
        <MessageScrollerViewport ref={(el) => (viewportRef = el)}>
          <MessageScrollerContent class="block min-h-full">
            <div
              class="relative w-full"
              style={{ height: `${virtualizer.getTotalSize()}px` }}
            >
              <For each={virtualizer.getVirtualItems()}>
                {(virtualItem) => (
                  <div
                    ref={(el) => queueMicrotask(() => virtualizer.measureElement(el))}
                    data-index={virtualItem.index}
                    class="absolute start-0 top-0 w-full"
                    style={{ transform: `translateY(${virtualItem.start}px)` }}
                  >
                    <Message>{props.messages[virtualItem.index]?.content}</Message>
                  </div>
                )}
              </For>
            </div>
          </MessageScrollerContent>
        </MessageScrollerViewport>
        <MessageScrollerButton />
      </MessageScroller>
    </MessageScrollerProvider>
  )
}
```
````

11. Accessibility: `tabIndex={0}` → `tabindex="0"`; `tabIndex={-1}` →
    `tabindex="-1"`; the `aria-busy` snippet becomes
    `<MessageScrollerContent aria-busy={status() === "streaming" ? "true" : "false"}>`.
12. "## Unstyled": replace the section body with:

````md
The behavior in `MessageScroller` lives in `message-scroller-primitive.ts`,
installed next to the styled component. To use it directly with your own markup
and styles, import the namespace object instead of the flat styled parts.

```tsx
import {
  MessageScroller,
  useMessageScroller,
} from "~/components/ui/message-scroller-primitive";
```

```tsx
<MessageScroller.Provider>
  <MessageScroller.Root>
    <MessageScroller.Viewport>
      <MessageScroller.Content>
        <For each={messages()}>
          {(message) => (
            <MessageScroller.Item
              messageId={message.id}
              scrollAnchor={message.role === "user"}
            >
              {/* your message UI */}
            </MessageScroller.Item>
          )}
        </For>
      </MessageScroller.Content>
    </MessageScroller.Viewport>
    <MessageScroller.Button />
  </MessageScroller.Root>
</MessageScroller.Provider>;
```
````

13. "## API Reference": replace the two-line pointer with the tables below
    (adapted from upstream's react page).

```md
## API Reference

The props, data attributes, and hooks are identical for the styled component and
the unstyled parts.

### MessageScrollerProvider

The headless root. It owns scroll state and the behavior props, and provides
them to the parts and the hooks. It renders no DOM of its own.

| Prop                     | Type                                | Default | Description                                                                                                                                                                          |
| ------------------------ | ----------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `autoScroll`             | `boolean`                           | `false` | Follow new content only while the reader is already at the live edge. Wheel, touch, keyboard scroll, and explicit jumps release it.                                                  |
| `defaultScrollPosition`  | `"start" \| "end" \| "last-anchor"` | `"end"` | Opening position on the first non-empty render, applied once. `"last-anchor"` opens at the last `scrollAnchor` row and falls back to `"end"` when the turn fits or no anchor exists. |
| `scrollEdgeThreshold`    | `number`                            | `8`     | Distance from either edge that still counts as being at the start or end. Controls state attributes and scroll button visibility.                                                    |
| `scrollMargin`           | `number`                            | `0`     | Margin applied to the aligned edge for `scrollToMessage`, visibility, and programmatic targets.                                                                                      |
| `scrollPreviousItemPeek` | `number`                            | `64`    | Extra margin added to `scrollMargin` when a newly appended `scrollAnchor` item is positioned so part of the previous item stays visible.                                             |

### MessageScroller

The frame and layout container. It fills its parent, so use it inside a
height-constrained layout, within a `MessageScrollerProvider`.

| Prop       | Type                    | Default | Description                        |
| ---------- | ----------------------- | ------- | ---------------------------------- |
| `...props` | `ComponentProps<"div">` | -       | Props spread to the frame element. |

The root mirrors the scroll-state attributes below (the viewport carries them
too), so you can style the container by scroll state, such as edge fades on the
frame.

| Data attribute       | Value                                             | Description                                                                                            |
| -------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `data-scrollable`    | `"start"` \| `"end"` \| `"start end"` \| _absent_ | Edges the viewport can scroll toward. Query one with `[data-scrollable~="end"]`; absent means it fits. |
| `data-autoscrolling` | present                                           | Present while the viewport is programmatically scrolling to the latest message.                        |

### MessageScrollerViewport

The scrollable viewport.

| Prop                      | Type                    | Default      | Description                                                               |
| ------------------------- | ----------------------- | ------------ | ------------------------------------------------------------------------- |
| `preserveScrollOnPrepend` | `boolean`               | `true`       | Keep the first visible message item stable when older rows are prepended. |
| `role`                    | `string`                | `"region"`   | Landmark role for the labelled scrollable transcript viewport.            |
| `aria-label`              | `string`                | `"Messages"` | Accessible name for the scrollable chat transcript.                       |
| `tabindex`                | `number`                | `0`          | Makes the transcript viewport keyboard-scrollable.                        |
| `...props`                | `ComponentProps<"div">` | -            | Props spread to the viewport element.                                     |

| Data attribute       | Value                                             | Description                                                                                            |
| -------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `data-scrollable`    | `"start"` \| `"end"` \| `"start end"` \| _absent_ | Edges the viewport can scroll toward. Query one with `[data-scrollable~="end"]`; absent means it fits. |
| `data-autoscrolling` | present                                           | Present while the viewport is programmatically scrolling to the latest message.                        |

### MessageScrollerContent

The transcript content element. Every direct child should be a
`MessageScrollerItem`.

| Prop              | Type                    | Default       | Description                                                             |
| ----------------- | ----------------------- | ------------- | ----------------------------------------------------------------------- |
| `role`            | `string`                | `"log"`       | ARIA role applied to the message list for live announcements.           |
| `aria-relevant`   | `string`                | `"additions"` | Live-region updates to announce. Defaults to new transcript rows only.  |
| `aria-busy`       | `"true" \| "false"`     | -             | Marks the live region busy while a turn streams, if needed.             |
| `spacerClassName` | `string`                | -             | Class name for the internal spacer used to make room for anchored rows. |
| `...props`        | `ComponentProps<"div">` | -             | Props spread to the content element.                                    |

### MessageScrollerItem

One transcript row: a message, marker, typing row, separator, or load-more row.

| Prop           | Type                    | Default | Description                                                                    |
| -------------- | ----------------------- | ------- | ------------------------------------------------------------------------------ |
| `messageId`    | `string`                | -       | Stable row id used by `scrollToMessage`, visibility, and prepend preservation. |
| `scrollAnchor` | `boolean`               | `false` | Marks this row as a turn boundary that can anchor newly appended turns.        |
| `...props`     | `ComponentProps<"div">` | -       | Props spread to the item element.                                              |

| Data attribute       | Value                 | Description                        |
| -------------------- | --------------------- | ---------------------------------- |
| `data-message-id`    | `string`              | Mirrors `messageId` when provided. |
| `data-scroll-anchor` | `"true"` \| `"false"` | Mirrors `scrollAnchor`.            |

### MessageScrollerButton

A button that scrolls to the start or end of the transcript. It is inert and
removed from the tab order when there is nothing to scroll toward. The styled
component renders a [`Button`](/docs/components/button); the unstyled part is
polymorphic through `as`.

| Prop        | Type                       | Default       | Description                                                              |
| ----------- | -------------------------- | ------------- | ------------------------------------------------------------------------ |
| `behavior`  | `ScrollBehavior`           | `"smooth"`    | Native scroll behavior used when the button scrolls to its target edge.  |
| `direction` | `"start" \| "end"`         | `"end"`       | Transcript edge the button scrolls toward.                               |
| `variant`   | `Button` variant           | `"secondary"` | Styled component only.                                                   |
| `size`      | `Button` size              | `"icon-sm"`   | Styled component only.                                                   |
| `children`  | `JSX.Element`              | -             | Custom button content. Defaults to the scroll icon and accessible label. |
| `as`        | `ValidComponent`           | `"button"`    | Unstyled part only: custom render target.                                |
| `...props`  | `ComponentProps<"button">` | -             | Props spread to the button.                                              |

| Data attribute   | Value                 | Description                               |
| ---------------- | --------------------- | ----------------------------------------- |
| `data-direction` | `"start"` \| `"end"`  | Mirrors `direction`.                      |
| `data-active`    | `"true"` \| `"false"` | Whether this button can currently scroll. |

### useMessageScroller

Imperative transcript controls. Returns plain functions.

| Method            | Type                                       | Description                     |
| ----------------- | ------------------------------------------ | ------------------------------- |
| `scrollToMessage` | `(messageId: string, options?) => boolean` | Scroll to a mounted message id. |
| `scrollToEnd`     | `(options?) => boolean`                    | Scroll to the latest message.   |
| `scrollToStart`   | `(options?) => boolean`                    | Scroll to the top.              |

All commands return `false` when the command could not be applied.
`scrollToStart` and `scrollToEnd` return `false` only when the viewport is not
mounted yet. `scrollToMessage` returns `false` when the target is not mounted
and cannot be queued.

Command options:

| Option         | Type                                              | Default                 | Description                                          |
| -------------- | ------------------------------------------------- | ----------------------- | ---------------------------------------------------- |
| `align`        | `"start"` \| `"center"` \| `"end"` \| `"nearest"` | `"start"`               | How a message target aligns in the viewport.         |
| `behavior`     | `ScrollBehavior`                                  | `"auto"`                | Native scroll behavior for the command.              |
| `scrollMargin` | `number`                                          | provider `scrollMargin` | Margin applied to the aligned edge for this command. |

### useMessageScrollerScrollable

Returns an accessor for which edges the viewport can scroll toward, for sibling
UI that needs the values in JavaScript. Prefer the `data-scrollable` attribute
for styling the scroller itself.

| Value   | Type      | Description                                                                                                                                                                     |
| ------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `start` | `boolean` | Whether the viewport can scroll toward the start. Content is hidden above (`!start` means at the top).                                                                          |
| `end`   | `boolean` | Whether the viewport can scroll toward the end. Content is hidden below (`!end` means at the bottom). Stays `false` while follow-output is keeping the reader at the live edge. |

### useMessageScrollerVisibility

Returns an accessor for visibility state, for outline, search, and active-turn
UI. Calling the hook subscribes the caller; tracking only runs while at least
one subscriber is mounted.

| Value               | Type             | Description                                                                                    |
| ------------------- | ---------------- | ---------------------------------------------------------------------------------------------- |
| `currentAnchorId`   | `string \| null` | The current anchored turn, based on the last `scrollAnchor` item at or above the reading line. |
| `visibleMessageIds` | `string[]`       | Message ids intersecting the viewport, in document order.                                      |

Filter `visibleMessageIds` in your app when you need a narrower outline, such as
user messages, anchored turns, or search hits.
```

- [ ] **Step 2: Grep the page for leftovers**

```bash
grep -n "className\|tabIndex\|@/components\|@shadcn/react\|styleName\|base-rhea\|/docs/react/\|motion" "apps/docs/src/routes/(app)/docs/components/message-scroller.mdx"
```

Expected: no matches (the only allowed `motion` is inside
`motion-reduce:animate-none`; refine the grep if needed).

- [ ] **Step 3: Format and load the page**

`deno fmt "apps/docs/src/routes/(app)/docs/components/message-scroller.mdx"`
(fmt handles markdown; if it rejects `.mdx`, skip). Reload the dev server page
`http://localhost:3228/docs/components/message-scroller` in headless Chromium
(reuse `smoke.mjs`): expect the h1 "Message Scroller", 11 previews, 11 "not
found in registry" fallbacks for now (or 6 fallbacks + 5 real previews if main's
five example files… no — main's examples are not on solid2; all 11 fall back),
zero page errors. Verify the nav sidebar lists "Message Scroller"
(config/docs.ts entry already exists).

- [ ] **Step 4: Commit**

```bash
git add "apps/docs/src/routes/(app)/docs/components/message-scroller.mdx"
git commit -m "Add the message-scroller docs page (upstream page adapted for Solid)"
```

---

### Example conversion rules (apply in Tasks 11–14)

Every example is a near-verbatim port of the upstream file named in its task.
Mechanical rules:

| Upstream (React)                                                                      | Solid 2                                                                                                                                                                                                                                                                                                                           |
| ------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `"use client"`, `import * as React from "react"`                                      | drop                                                                                                                                                                                                                                                                                                                              |
| `export function XyzExample()`                                                        | `export default function XyzExample()`                                                                                                                                                                                                                                                                                            |
| `className=`                                                                          | `class=`                                                                                                                                                                                                                                                                                                                          |
| `@/styles/base-rhea/ui/x`                                                             | `~/registry/ui/x.tsx`                                                                                                                                                                                                                                                                                                             |
| `@/lib/ai` → `createChat, getMessageText` (+ `useChat` from `@ai-sdk/react`)          | `import { createChat, createChatSession, getMessageText } from "~/lib/ai.ts"`                                                                                                                                                                                                                                                     |
| `@/components/message-animated`                                                       | `~/components/message-animated.tsx`                                                                                                                                                                                                                                                                                               |
| `@/lib/message-animations`                                                            | `~/lib/message-animations.ts`                                                                                                                                                                                                                                                                                                     |
| `useChat({ messages, transport })` → `{ messages, sendMessage, status, setMessages }` | `createChatSession({ messages, transport })` → same names; `messages` is a store array (read `messages.length`, iterate with `<For each={messages}>`), `status` is an accessor (`status()`)                                                                                                                                       |
| `const nextMessage = chat.next(messages)`                                             | `const nextMessage = createMemo(() => chat.next(messages))` and read `nextMessage()`                                                                                                                                                                                                                                              |
| `const isBusy = status === "submitted" \|\| status === "streaming"`                   | `const isBusy = () => status() === "submitted" \|\| status() === "streaming"`                                                                                                                                                                                                                                                     |
| `React.useState(x)`                                                                   | `createSignal(x)`; reads become calls                                                                                                                                                                                                                                                                                             |
| `messages.map((m) => <X key={m.id} … />)`                                             | `<For each={messages}>{(m) => <X … />}</For>`                                                                                                                                                                                                                                                                                     |
| `cond ? <A/> : <B/>`                                                                  | `<Show when={cond} fallback={<B/>}><A/></Show>`                                                                                                                                                                                                                                                                                   |
| `<TooltipTrigger render={<Button … />}>`                                              | `<TooltipTrigger as={Button<"button">} …>` (same for `DropdownMenuTrigger as={InputGroupButton}` / `as={Button<"button">}`, `HoverCardTrigger as="button"`)                                                                                                                                                                       |
| `<DropdownMenuContent align="start" side="top">`                                      | `<DropdownMenu placement="top-start">` on the root, `<DropdownMenuContent>` without align/side (`align="end" side="bottom"` → `placement="bottom-end"`)                                                                                                                                                                           |
| lucide icons                                                                          | `IconPlaceholder` with the tuples below                                                                                                                                                                                                                                                                                           |
| `key={demoKey}` remount                                                               | `<Show when={demoKey()} keyed>{() => …}</Show>` with `createSignal(1)` (never 0 — falsy)                                                                                                                                                                                                                                          |
| `aria-busy={isBusy}`                                                                  | `aria-busy={isBusy() ? "true" : "false"}`                                                                                                                                                                                                                                                                                         |
| `void sendMessage(x)`                                                                 | `sendMessage(x)`                                                                                                                                                                                                                                                                                                                  |
| `onSubmit={(e) => …}`                                                                 | same; type `SubmitEvent`, `e.preventDefault()`                                                                                                                                                                                                                                                                                    |
| Kobalte prop names                                                                    | Slider `value`/`onChange`/`minValue`/`maxValue`; Tabs `value`/`onChange`; ToggleGroup `value`/`onChange` (single string); Select is options-driven (`options`, `itemComponent`, `onChange`); HoverCard `placement`/`gutter`; `toast(title, { description })` → `toast.add({ title, description })` from `~/registry/ui/toast.tsx` |
| Bubble/Message props                                                                  | `Bubble variant="muted"                                                                                                                                                                                                                                                                                                           |

Icon tuples (validated on `main`): arrow-up →
`lucide="arrow-up" tabler="arrow-up" ph="arrow-up" ri="arrow-up-line" hugeicons="arrow-up-02"`;
rotate-cw →
`lucide="rotate-cw" tabler="rotate" ph="arrow-clockwise" ri="refresh-line" hugeicons="refresh"`;
message-circle-dashed →
`lucide="message-circle-dashed" tabler="message-circle" ph="chat-circle-dots" ri="chat-3-line" hugeicons="message-square-dashed"`;
plus →
`lucide="plus" tabler="plus" ph="plus" ri="add-line" hugeicons="plus-sign"`;
paperclip →
`lucide="paperclip" tabler="paperclip" ph="paperclip" ri="attachment-line" hugeicons="attachment-01"`;
image →
`lucide="image" tabler="photo" ph="image" ri="image-line" hugeicons="image-01"`;
telescope →
`lucide="telescope" tabler="telescope" ph="binoculars" ri="search-eye-line" hugeicons="telescope-01"`;
globe →
`lucide="globe" tabler="world" ph="globe" ri="global-line" hugeicons="globe"`.
New lucide names type-error until `deno task build:registry` regenerates
`__lucide__/index.tsx` — run it before `deno check`.

Registry entry shape (append to `apps/docs/src/registry/registry-examples.ts`
next to the existing message-scroller entries, one per example):

```ts
{
  name: "message-scroller-anchoring",
  type: "example",
  files: [
    {
      path: "example/message-scroller-anchoring.tsx",
      type: "example",
    },
  ],
},
```

Verification for every example task: `deno task build:registry` →
`deno fmt`/`lint --fix`/`check` the new files → reload
`/docs/components/message-scroller` in headless Chromium: the task's previews
render (no "not found in registry" for them), zero page/console errors →
hand-drive the interaction listed in the task with Playwright
(`page.locator(...)`, real clicks) → commit.

---

### Task 11: Chat-session examples — demo, streaming, previous-context, animation

**Files:**

- Create: `apps/docs/src/registry/example/message-scroller-demo.tsx`,
  `message-scroller-streaming.tsx`, `message-scroller-previous-context.tsx`,
  `message-scroller-animation.tsx`
- Modify: `apps/docs/src/registry/registry-examples.ts` (add
  `message-scroller-streaming`, `-previous-context`, `-animation`; `-demo`
  already exists)
- Sources: upstream
  `examples/base/message-scroller-{demo,streaming,previous-context,animation}.tsx`

**Interfaces:**

- Consumes: Task 8 `createChat/createChatSession/getMessageText`, Task 9
  `MessageAnimated`/`MESSAGE_ANIMATIONS`, Task 7 styled parts.

- [ ] **Step 1: Write `message-scroller-demo.tsx` (the reference port; the other
      three follow the same shape)**

```tsx
import { MessageAnimated } from "~/components/message-animated.tsx";
import { createChat, createChatSession, getMessageText } from "~/lib/ai.ts";
import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";
import { Button } from "~/registry/ui/button.tsx";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/registry/ui/card.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/registry/ui/dropdown-menu.tsx";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "~/registry/ui/empty.tsx";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
} from "~/registry/ui/input-group.tsx";
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "~/registry/ui/message-scroller.tsx";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/registry/ui/tooltip.tsx";
import { createMemo, For, Show } from "solid-js";

const chat = createChat()
  .user(
    "I'm building a chat for our app and the scroll behavior is driving me nuts. Every time the AI streams a reply, the whole thread jumps around.",
  )
  .sleep(1000)
  .assistant(
    "That's the classic streaming scroll problem. Wrap your message list in `MessageScroller` and turn on `autoScroll` — the viewport pins to the bottom as tokens arrive, so users always see the latest text land in place.\n\nThe important part: it only auto-scrolls while the reader is already at the bottom. The moment they scroll up to read something earlier, auto-scroll backs off and their position is preserved. You get smooth streaming without fighting the user's intent.",
  )
  .user(
    "Okay, but when someone sends a new message the view still feels jarring — like the whole conversation reloads from the top.",
  )
  .sleep(1000)
  .assistant(
    "MessageScrollerItem fixes that with turn anchoring. Set `scrollAnchor` on the turn that should settle near the top instead of blindly snapping to the document bottom.\n\nIt also leaves a small peek of the previous exchange visible above the anchor, so context isn't lost. The reply starts in view without that disorienting jump you get from a plain overflow container.",
  )
  .user(
    "And if they've scrolled up to re-read an older answer? I don't want to yank them back down.",
  )
  .sleep(1000)
  .assistant(
    "You won't. Auto-scroll only runs when the viewport is already pinned to the bottom, so scrolling up is a deliberate opt-out — their place in the thread stays put even as new tokens keep arriving below.\n\nWhen there is content they haven't seen yet, `MessageScrollerButton` appears at the bottom of the viewport. One tap jumps them back to the newest message and re-engages auto-scroll. Same pattern as Slack or iMessage: quiet when you're caught up, helpful when you're not.",
  )
  .user("Last one — does this work with assistive tech?")
  .sleep(1000)
  .assistant(
    '`MessageScrollerContent` sets `role="log"` and `aria-relevant="additions"` by default, so screen readers announce new messages as they stream in.\n\nThe scroll button is a real `<button>` with an sr-only label, and it\'s removed from the tab order when you\'re already at the bottom — no ghost focus stops.',
  );
const initialMessages = chat.get(0);
const transport = chat.transport({ delayMs: 20 });

export default function MessageScrollerDemo() {
  const { messages, sendMessage, status, setMessages } = createChatSession({
    messages: initialMessages,
    transport,
  });
  const nextMessage = createMemo(() => chat.next(messages));
  const isBusy = () => status() === "submitted" || status() === "streaming";

  return (
    <MessageScrollerProvider>
      <div class="relative flex flex-col gap-4">
        <Card class="mx-auto h-140 w-full max-w-sm gap-0">
          <CardHeader class="gap-1 border-b">
            <CardTitle>New Chat</CardTitle>
            <CardDescription>How can I help you today?</CardDescription>
            <CardAction>
              <Tooltip>
                <TooltipTrigger
                  as={Button<"button">}
                  variant="outline"
                  size="icon"
                  aria-label="Reset conversation"
                  onClick={() => setMessages(initialMessages)}
                  disabled={isBusy()}
                >
                  <IconPlaceholder
                    lucide="rotate-cw"
                    tabler="rotate"
                    ph="arrow-clockwise"
                    ri="refresh-line"
                    hugeicons="refresh"
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Reset</p>
                </TooltipContent>
              </Tooltip>
            </CardAction>
          </CardHeader>
          <CardContent class="flex-1 overflow-hidden p-0">
            <Show
              when={messages.length > 0}
              fallback={
                <Empty class="h-full">
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <IconPlaceholder
                        lucide="message-circle-dashed"
                        tabler="message-circle"
                        ph="chat-circle-dots"
                        ri="chat-3-line"
                        hugeicons="message-square-dashed"
                      />
                    </EmptyMedia>
                    <EmptyTitle>Morning, shadcn!</EmptyTitle>
                    <EmptyDescription>
                      What are we working on today? Press send to start a new
                      conversation
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              }
            >
              <MessageScroller>
                <MessageScrollerViewport>
                  <MessageScrollerContent
                    aria-busy={isBusy() ? "true" : "false"}
                    class="p-(--card-spacing)"
                  >
                    <For each={messages}>
                      {(message) => (
                        <MessageAnimated
                          message={message}
                          scrollAnchor={message.role === "user"}
                        />
                      )}
                    </For>
                  </MessageScrollerContent>
                </MessageScrollerViewport>
                <MessageScrollerButton />
              </MessageScroller>
            </Show>
          </CardContent>
          <CardFooter class="flex-col gap-2">
            <form
              onSubmit={(event) => {
                event.preventDefault();
                const next = nextMessage();
                if (!next || isBusy()) {
                  return;
                }
                sendMessage(next);
              }}
              class="w-full"
            >
              <InputGroup>
                <div class="h-14 w-full px-3 py-2.5">
                  <span
                    class="line-clamp-2 opacity-60 data-[status=ready]:opacity-100"
                    data-status={status()}
                  >
                    <Show
                      when={nextMessage()}
                      fallback={
                        <span class="text-muted-foreground">
                          No messages queued. Reset the conversation.
                        </span>
                      }
                    >
                      {(message) => getMessageText(message())}
                    </Show>
                  </span>
                </div>
                <InputGroupAddon align="block-end" class="pt-1">
                  <DropdownMenu placement="top-start">
                    <DropdownMenuTrigger
                      as={InputGroupButton}
                      aria-label="Add files"
                      type="button"
                      size="icon-sm"
                      variant="outline"
                    >
                      <IconPlaceholder
                        lucide="plus"
                        tabler="plus"
                        ph="plus"
                        ri="add-line"
                        hugeicons="plus-sign"
                      />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent class="w-44">
                      <DropdownMenuItem>
                        <IconPlaceholder
                          lucide="paperclip"
                          tabler="paperclip"
                          ph="paperclip"
                          ri="attachment-line"
                          hugeicons="attachment-01"
                        />
                        Add Photos & Files
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <IconPlaceholder
                          lucide="image"
                          tabler="photo"
                          ph="image"
                          ri="image-line"
                          hugeicons="image-01"
                        />
                        Create Image
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <IconPlaceholder
                          lucide="telescope"
                          tabler="telescope"
                          ph="binoculars"
                          ri="search-eye-line"
                          hugeicons="telescope-01"
                        />
                        Deep Research
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <IconPlaceholder
                          lucide="globe"
                          tabler="world"
                          ph="globe"
                          ri="global-line"
                          hugeicons="globe"
                        />
                        Web Search
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <InputGroupButton
                    type="submit"
                    variant="default"
                    size="icon-sm"
                    disabled={!nextMessage() || isBusy()}
                    class="ml-auto"
                  >
                    <IconPlaceholder
                      lucide="arrow-up"
                      tabler="arrow-up"
                      ph="arrow-up"
                      ri="arrow-up-line"
                      hugeicons="arrow-up-02"
                    />
                    <span class="sr-only">Send</span>
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            </form>
          </CardFooter>
        </Card>
        <div class="px-0.5 text-center text-xs text-muted-foreground">
          Demo is read only. Press send to send messages.
        </div>
      </div>
    </MessageScrollerProvider>
  );
}
```

Note: NO `autoScroll` on the provider (upstream's demo has none; main's added it
wrongly). `Add Photos & Files` — if MDX/JSX complains about the bare `&`, write
`Add Photos &amp; Files`.

- [ ] **Step 2: Port `message-scroller-streaming.tsx`**

Same file as the demo except: title "Streaming Messages", description
"Auto-scroll follows the live edge of the conversation.", provider
`<MessageScrollerProvider autoScroll>`, empty-state title "Ready to Stream" /
description "Press send to stream a scripted launch summary.", reset button
`disabled={messages.length === 0 || isBusy()}`, the queued-fallback text "No
messages queued. Reset the stream.", footer note "Streaming is simulated.
`autoScroll` is enabled." — copy the script text (its `.user/.assistant` chain)
verbatim from upstream's `message-scroller-streaming.tsx` lines 59–85
(`chat.transport({ delayMs: 20 })`).

- [ ] **Step 3: Port `message-scroller-previous-context.tsx`**

Upstream: `chat.get(2)`, `transport({ delayMs: 35 })`, `DEFAULT_PEEK = 64` (see
its top lines), a `peek` signal and a `demoKey` remount of the whole provider,
`scrollMargin={24}`, a Slider next to the send button. Solid specifics:

```tsx
const [demoKey, setDemoKey] = createSignal(1);
const [peek, setPeek] = createSignal(DEFAULT_PEEK);
// … createChatSession as in the demo …
return (
  <Show when={demoKey()} keyed>
    {() => (
      <MessageScrollerProvider
        scrollMargin={24}
        scrollPreviousItemPeek={peek()}
      >
        {/* card as in the demo, title "Keeping Context Visible", description "New turns keep part of the previous reply in view." */}
      </MessageScrollerProvider>
    )}
  </Show>
);
```

Reset button:
`onClick={() => { setMessages(initialMessages); setPeek(DEFAULT_PEEK); setDemoKey((key) => key + 1); }}`
with `aria-label="Reset context example"`. Slider block inside the addon,
between the dropdown and the send button:

```tsx
<div class="flex w-28 items-center gap-2">
  <span class="text-xs text-muted-foreground tabular-nums">{peek()}px</span>
  <Slider
    aria-label="Previous context peek"
    value={[peek()]}
    minValue={64}
    maxValue={128}
    step={1}
    disabled={isBusy()}
    onChange={(value) => setPeek(value[0] ?? DEFAULT_PEEK)}
  />
</div>;
```

(`Slider` from `~/registry/ui/slider.tsx`; check its wrapper for the exact prop
names — the ported wrapper forwards Kobalte's `value: number[]`,
`onChange: (value: number[]) => void`, `minValue`, `maxValue`, `step`.) Footer
note: "Adjust the slider and send. Observe the previous message peak".

- [ ] **Step 4: Port `message-scroller-animation.tsx`**

Upstream: `chat.get(0)`, `transport({ delayMs: 15 })`, a `presetId` state
(`"fade"` default), Select of `MESSAGE_ANIMATIONS`,
`MessageAnimated animationPreset={preset}`. Solid specifics:

```tsx
import type { MessageAnimationId } from "~/lib/message-animations.ts";
import { MESSAGE_ANIMATIONS } from "~/lib/message-animations.ts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/registry/ui/select.tsx";

const PRESETS = Object.values(MESSAGE_ANIMATIONS);
const [presetId, setPresetId] = createSignal<MessageAnimationId>("fade");
const preset = () => MESSAGE_ANIMATIONS[presetId()];
```

Footer Select (Kobalte is options-driven; mirror `select-demo.tsx`):

```tsx
<Select<(typeof PRESETS)[number]>
  options={PRESETS}
  optionValue="id"
  optionTextValue="name"
  value={preset()}
  onChange={(value) => value && setPresetId(value.id)}
  placement="top-start"
  itemComponent={(itemProps) => (
    <SelectItem item={itemProps.item}>
      {itemProps.item.rawValue.name}
    </SelectItem>
  )}
>
  <SelectTrigger aria-label="Animation preset" class="w-40">
    <SelectValue<(typeof PRESETS)[number]>>
      {(state) => state.selectedOption().name}
    </SelectValue>
  </SelectTrigger>
  <SelectContent />
</Select>;
```

Rows:
`<MessageAnimated message={message} animationPreset={preset()} userVariant="muted" assistantVariant="ghost" />`
(no `scrollAnchor` prop — MessageAnimated defaults user rows to anchors). Card:
title "Animation", description "Choose how user messages are animated when they
are added to the conversation.", reset `aria-label="Reset animated messages"`
disabled `messages.length === 0 || isBusy()`, empty state "No Messages Yet" /
"Click the button below to send the first message.", send button in the footer
(`Button size="icon" class="ml-auto"` with the arrow-up icon and sr-only "Send
Message"), footer note "Select an animation then click send to see it in
action.". The provider wraps only the scroller inside `CardContent` (as
upstream).

- [ ] **Step 5: Registry entries, build, check, verify**

Add entries for `message-scroller-streaming`,
`message-scroller-previous-context`, `message-scroller-animation` (demo exists).
Then:

```bash
cd apps/docs && deno task build:registry 2>&1 | tail -5
deno fmt src/registry/example/message-scroller-{demo,streaming,previous-context,animation}.tsx && deno lint --fix src/registry/example/message-scroller-{demo,streaming,previous-context,animation}.tsx && deno check src/registry/example/message-scroller-{demo,streaming,previous-context,animation}.tsx src/registry/registry-examples.ts
```

Then in headless Chromium on `/docs/components/message-scroller` (write
`$SCRATCH/pw/examples-check.mjs` following `smoke.mjs`): for the demo preview,
click the send button (`[data-slot=component-preview]` #1 →
`button[type=submit]`), wait 300ms, assert a user bubble appeared and
`[data-slot=message-scroller-content]` has `aria-busy="true"` while streaming,
then after ~4s `aria-busy="false"` and the assistant text is complete; the
`[data-slot=message-scroller-button]` has `data-active="false"` at the end. For
streaming: after send, wait 2s and assert the viewport is at the bottom
(`scrollHeight - scrollTop - clientHeight <= 1`). For previous-context:
drag/keyboard the slider (`ArrowRight` ×10 on the thumb) → the `px` label
changes; send → the previous row's peek is visible. For animation: open the
Select, choose "Pop", send → the new user row carries `zoom-in-95`. Zero
console/page errors.

- [ ] **Step 6: Commit**

```bash
git add apps/docs/src/registry/example/message-scroller-{demo,streaming,previous-context,animation}.tsx apps/docs/src/registry/registry-examples.ts apps/docs/public/r apps/docs/public/registry apps/docs/src/__registry__ apps/docs/src/registry/icons/__lucide__
git commit -m "Port the chat-session message-scroller examples"
```

---

### Task 12: MessageAnimated examples — anchoring, scrollable

**Files:**

- Create: `apps/docs/src/registry/example/message-scroller-anchoring.tsx`,
  `message-scroller-scrollable.tsx`
- Modify: `registry-examples.ts` (add `message-scroller-anchoring`;
  `-scrollable` exists)
- Sources: upstream `examples/base/message-scroller-{anchoring,scrollable}.tsx`

- [ ] **Step 1: Port `message-scroller-anchoring.tsx`**

Keep upstream's `scriptedMessages` array and copy verbatim. Solid state and
handlers:

```tsx
type AnchorRole = "user" | "assistant";
type ChatMessage = { id: string; role: AnchorRole; text: string };

const [anchorRole, setAnchorRole] = createSignal<AnchorRole>("user");
const [messages, setMessages] = createSignal<ChatMessage[]>([]);
const [messageIndex, setMessageIndex] = createSignal(0);
const nextMessage = () => scriptedMessages[messageIndex()];
const reset = () => {
  setMessages([]);
  setMessageIndex(0);
};
```

Header reset:
`<Button type="button" variant="outline" size="icon" aria-label="Reset anchored turns" disabled={messages().length === 0} onClick={reset}>` +
rotate-cw icon. Content:
`<Show when={messages().length > 0} fallback={<Empty …"No anchored messages yet" / "Send the first message to see the selected role anchor.">}>`
→ provider + scroller with
`<For each={messages()}>{(message) => <MessageAnimated message={message} scrollAnchor={message.role === anchorRole()} userVariant="muted" assistantVariant="ghost" />}</For>`.
Footer:

```tsx
<ToggleGroup
  aria-label="Select scroll anchor role"
  value={anchorRole()}
  onChange={(value) => {
    if (value === "user" || value === "assistant") {
      setAnchorRole(value);
      reset();
    }
  }}
>
  <ToggleGroupItem value="user" aria-label="Anchor user messages">User</ToggleGroupItem>
  <ToggleGroupItem value="assistant" aria-label="Anchor assistant messages">Assistant</ToggleGroupItem>
</ToggleGroup>
<Button
  type="button"
  size="icon"
  class="ml-auto"
  disabled={!nextMessage()}
  onClick={() => {
    const next = nextMessage();
    if (!next) return;
    setMessages((list) => [...list, next]);
    setMessageIndex((index) => index + 1);
  }}
>
  {/* arrow-up icon */}
  <span class="sr-only">Send Message</span>
</Button>
```

(`ToggleGroup`/`ToggleGroupItem` from `~/registry/ui/toggle-group.tsx`;
single-select `value: string | null` as in
`toggle-group-font-weight-selector.tsx`.) Card copy: title "Anchoring Turns",
description "Choose which role settles near the top edge.",
`CardContent class="min-h-0 flex-1 overflow-hidden p-0"`, footer note "Toggle
the anchor role, then send messages to compare where turns settle.".

- [ ] **Step 2: Port `message-scroller-scrollable.tsx`**

```tsx
const messages = Array.from({ length: 12 }, (_, index) => ({
  id: `scrollable-${index + 1}`,
  role: index % 2 === 0 ? "user" : "assistant",
  text: index % 2 === 0
    ? `Review scroll checkpoint ${index + 1}.`
    : `Checkpoint ${
      index + 1
    } is synced. …`, /* copy upstream's three-paragraph text verbatim */
})) satisfies Array<{ id: string; role: "user" | "assistant"; text: string }>;
```

Component tree exactly as upstream
(`MessageScrollerProvider defaultScrollPosition="start"` wrapping
`CardContent` + `<ScrollStateFooter />`;
`MessageScrollerContent class="gap-4 p-(--card-spacing)"` containing
`<Transcript />`). `Transcript` returns
`<For each={messages}>{(message) => <MessageAnimated message={message} scrollAnchor={message.role === "user"} userVariant="muted" assistantVariant="ghost" />}</For>`.
Footer:

```tsx
function ScrollStateFooter() {
  const scrollable = useMessageScrollerScrollable();
  return (
    <CardFooter class="justify-center border-t text-center text-sm text-muted-foreground">
      {getScrollStatus(scrollable())}
    </CardFooter>
  );
}
```

with upstream's `getScrollStatus({ start, end })` verbatim.

- [ ] **Step 3: Registry, build, check, verify, commit**

Add the `message-scroller-anchoring` entry; `deno task build:registry`;
fmt/lint/check both files; reload the docs page: anchoring — click Send three
times → the third row (a user turn) sits near the top with the previous row
peeking; toggle "Assistant" → list resets; scrollable — footer reads "You are at
the top. You can only scroll down." initially, after `scrollTop = 400` on its
viewport "You can scroll both ways.", at the end "You are at the bottom. You can
only scroll up.".

```bash
git add apps/docs/src/registry/example/message-scroller-{anchoring,scrollable}.tsx apps/docs/src/registry/registry-examples.ts apps/docs/public/r apps/docs/public/registry apps/docs/src/__registry__ apps/docs/src/registry/icons/__lucide__
git commit -m "Port the anchoring and scrollable message-scroller examples"
```

---

### Task 13: Static-script examples — group-chat, load-history, opening-position

**Files:**

- Create: `apps/docs/src/registry/example/message-scroller-group-chat.tsx`,
  `message-scroller-load-history.tsx`, `message-scroller-opening-position.tsx`
- Modify: `registry-examples.ts` (add `-group-chat`, `-load-history`;
  `-opening-position` exists)
- Sources: upstream
  `examples/base/message-scroller-{group-chat,load-history,opening-position}.tsx`

- [ ] **Step 1: Port `message-scroller-group-chat.tsx`**

Copy `currentUser`, `initialItems`, `rockyMarker`, `rockyMessage`,
`GroupChatItem` verbatim (drop `satisfies` if deno's TS complains — it
shouldn't). State:
`const [demoKey, setDemoKey] = createSignal(1); const [rockyTurn, setRockyTurn] = createSignal<"idle" | "marker" | "message">("idle");`
and

```tsx
const items = createMemo((): GroupChatItem[] =>
  rockyTurn() === "message"
    ? [...initialItems, rockyMarker, rockyMessage]
    : rockyTurn() === "marker"
    ? [...initialItems, rockyMarker]
    : initialItems
);
const buttonLabel = () =>
  rockyTurn() === "idle" ? "Add Rocky" : "Send Message as Rocky";
const isComplete = () => rockyTurn() === "message";
```

Keep upstream's nesting (outer provider around the card, inner provider around
the scroller — verbatim). The remount:
`<Show when={demoKey()} keyed>{() => (<MessageScroller>…</MessageScroller>)}</Show>`
inside the inner provider. Rows:

```tsx
<For each={items()}>
  {(item) =>
    item.type === "message"
      ? <GroupChatMessage item={item} />
      : <GroupChatMarker item={item} scrollAnchor={item.scrollAnchor} />}
</For>;
```

`GroupChatMessage(props: { item: Extract<GroupChatItem, { type: "message" }> })`:
`const isCurrentUser = () => props.item.sender === currentUser; const variant = () => isCurrentUser() ? "muted" : props.item.role === "assistant" ? "ghost" : "tinted";`
→
`<MessageScrollerItem messageId={props.item.id} scrollAnchor={props.item.scrollAnchor}><Message align={isCurrentUser() ? "end" : "start"}><MessageContent><Show when={!isCurrentUser()}><MessageHeader>{props.item.sender}</MessageHeader></Show><Bubble variant={variant()}><BubbleContent>{props.item.text}</BubbleContent></Bubble></MessageContent></Message></MessageScrollerItem>`.
`GroupChatMarker(props: { item; scrollAnchor?: boolean })` →
`<MessageScrollerItem scrollAnchor={props.scrollAnchor ?? false}><Marker variant="separator"><MarkerContent>{props.item.text}</MarkerContent></Marker></MessageScrollerItem>`.
Reset button (Tooltip + `as={Button<"button">}`,
`disabled={rockyTurn() === "idle"}`,
`onClick={() => { setRockyTurn("idle"); setDemoKey((k) => k + 1); }}`); footer
button `disabled={isComplete()}`,
`onClick={() => setRockyTurn((turn) => turn === "idle" ? "marker" : "message")}`,
`class="w-full" variant="secondary"`, label `{buttonLabel()}`; helper text
`{rockyTurn() === "idle" ? "This will create a marker and make it the anchor" : "Now send Rocky's reply into the conversation"}`.
Card title "Group Chat", description "A group chat with several participants and
an assistant. The Marker is marked as a turn.", footer note as upstream.

- [ ] **Step 2: Port `message-scroller-load-history.tsx`**

Copy the `chat` script verbatim (upstream lines 29–58; no `.sleep`);
`const history = chat.get(); const INITIAL_VISIBLE_COUNT = 5;`. State:
`const [demoKey, setDemoKey] = createSignal(1); const [visibleCount, setVisibleCount] = createSignal(INITIAL_VISIBLE_COUNT); const visibleMessages = createMemo(() => history.slice(-visibleCount())); const canLoadHistory = () => visibleCount() < history.length;`.
Remount `<Show when={demoKey()} keyed>` around `<MessageScroller>`. Rows:
`<For each={visibleMessages()}>{(message) => { const isUserMessage = message.role === "user"; return (<MessageScrollerItem messageId={message.id}><Message align={isUserMessage ? "end" : "start"}><MessageContent><Bubble variant={isUserMessage ? "muted" : "ghost"}><BubbleContent class="space-y-2"><For each={paragraphsOf(getMessageText(message))}>{(paragraph) => <p class="whitespace-pre-wrap">{paragraph}</p>}</For></BubbleContent></Bubble></MessageContent></Message></MessageScrollerItem>); }}</For>`
followed by the static
`<MessageScrollerItem scrollAnchor={false}><Marker variant="separator"><MarkerContent>End of Conversation</MarkerContent></Marker></MessageScrollerItem>`.
Define once per file:
`const paragraphsOf = (text: string) => text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);`.
Load button:
`onClick={() => { setVisibleCount(history.length); toast.add({ title: "History loaded", description: "Scroll up to see earlier messages." }); }}`
with `import { toast } from "~/registry/ui/toast.tsx"`; label
`{canLoadHistory() ? "Load History" : "History Loaded"}`; reset (Tooltip)
`disabled={visibleCount() === INITIAL_VISIBLE_COUNT}` →
`setVisibleCount(INITIAL_VISIBLE_COUNT); setDemoKey((k) => k + 1)`. Titles/notes
as upstream ("Load History", "Prepended messages keep your place.", "Restore
earlier messages while keeping your place.", "Click Load History to load the
entire conversation").

- [ ] **Step 3: Port `message-scroller-opening-position.tsx`**

Copy `messages` and `positions` verbatim. State:
`const [positionKey, setPositionKey] = createSignal(0); const [position, setPosition] = createSignal<"start" | "end" | "last-anchor">("last-anchor");`.
Tabs footer:

```tsx
<Tabs
  value={position()}
  onChange={(value) => {
    if (value === "start" || value === "end" || value === "last-anchor") {
      setPosition(value);
      setPositionKey((key) => key + 1);
    }
  }}
  class="w-full"
>
  <TabsList class="w-full">
    <For each={positions}>
      {(option) => (
        <TabsTrigger value={option.value}>{option.label}</TabsTrigger>
      )}
    </For>
  </TabsList>
</Tabs>;
```

Scroller child component:

```tsx
function OpeningPositionScroller(props: { position: "start" | "end" | "last-anchor"; positionKey: number }) {
  const { scrollToEnd, scrollToMessage, scrollToStart } = useMessageScroller();

  // Re-run on every position/positionKey change (React's layout effect deps).
  createEffect(
    () => [props.position, props.positionKey] as const,
    ([position]) => {
      const frame = requestAnimationFrame(() => {
        if (position === "start") { scrollToStart({ behavior: "auto" }); return; }
        if (position === "end") { scrollToEnd({ behavior: "auto" }); return; }
        scrollToMessage("open-3", { align: "start", behavior: "auto", scrollMargin: 64 });
      });
      return () => cancelAnimationFrame(frame);
    },
  );

  return (/* MessageScroller > Viewport > Content(class="p-(--card-spacing)") > For messages → MessageScrollerItem messageId scrollAnchor={isUserMessage} > Message/Bubble/paragraphs, + MessageScrollerButton */);
}
```

Rendered as
`<MessageScrollerProvider><OpeningPositionScroller position={position()} positionKey={positionKey()} /></MessageScrollerProvider>`
inside `CardContent class="flex-1 overflow-hidden p-0"`. Copy titles ("Opening
Position", "Choose where a saved transcript opens.") and the footer note.

- [ ] **Step 4: Registry, build, check, verify, commit**

Add `message-scroller-group-chat` and `message-scroller-load-history` entries;
`deno task build:registry`; fmt/lint/check the three files; reload the docs page
and drive: group-chat — click "Add Rocky" → the "Rocky has joined the chat"
marker sits near the top with peek; click again → Rocky's message appears below;
reset → back to three items. load-history — scroll its viewport to a middle row,
note that row's offset, click "Load History" → the row's offset is unchanged
(±1px) and a toast appears; reset works. opening-position — initial: the
"open-3" row sits 64px from the top; click "start" → scrollTop 0; "end" →
bottom; "last-anchor" → back to 64px.

```bash
git add apps/docs/src/registry/example/message-scroller-{group-chat,load-history,opening-position}.tsx apps/docs/src/registry/registry-examples.ts apps/docs/public/r apps/docs/public/registry apps/docs/src/__registry__ apps/docs/src/registry/icons/__lucide__
git commit -m "Port the group-chat, load-history and opening-position message-scroller examples"
```

---

### Task 14: Hook examples — commands, visibility

**Files:**

- Create: `apps/docs/src/registry/example/message-scroller-commands.tsx`,
  `message-scroller-visibility.tsx`
- Modify: `registry-examples.ts` (both entries already exist)
- Sources: upstream `examples/base/message-scroller-{commands,visibility}.tsx`

- [ ] **Step 1: Port `message-scroller-commands.tsx`**

Copy the `chat` script verbatim (it passes explicit ids:
`.user("…", { id: "command-activation" })`);
`const messages = chat.get(); const userMessages = messages.filter((m) => m.role === "user");`.
Tree as upstream (`MessageScrollerProvider defaultScrollPosition="end"`,
`CardAction` holds `<CommandMenu />`, rows = `For each={messages}` →
`MessageScrollerItem messageId scrollAnchor={isUserMessage}` with
Message/Bubble/paragraphs). Menu:

```tsx
function CommandMenu() {
  const { scrollToMessage } = useMessageScroller();
  return (
    <DropdownMenu placement="bottom-end">
      <DropdownMenuTrigger
        as={Button<"button">}
        type="button"
        variant="secondary"
      >
        Jump to...
      </DropdownMenuTrigger>
      <DropdownMenuContent class="w-64">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Conversations</DropdownMenuLabel>
          <For each={userMessages}>
            {(message) => (
              <DropdownMenuItem
                onSelect={() =>
                  scrollToMessage(message.id, {
                    align: "start",
                    behavior: "smooth",
                  })}
              >
                <span class="line-clamp-1 min-w-0">
                  {getTrimmedMessageText(message)}
                </span>
              </DropdownMenuItem>
            )}
          </For>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
function getTrimmedMessageText(message: (typeof userMessages)[number]) {
  const text = getMessageText(message);
  return text.length > 42 ? `${text.slice(0, 39)}...` : text;
}
```

(Kobalte's item selection callback is `onSelect`; if the ported
`DropdownMenuItem` forwards `onClick` instead — check `dropdown-menu.tsx` — use
that.) Copy titles ("Commands", "Drive the transcript from outside.") and the
footer note.

- [ ] **Step 2: Port `message-scroller-visibility.tsx`**

Copy the `chat` script verbatim (ids `vis-brief`, `vis-impact`, `vis-actions`,
`vis-checklist`); `messages`/`userMessages` as above; provider
`scrollMargin={12}`; layout as upstream (the outline sits in
`<div class="absolute top-1/2 -right-12 -translate-y-1/2"><TranscriptOutline /></div>`
next to the card, both inside the provider). Outline:

```tsx
function TranscriptOutline() {
  const { scrollToMessage } = useMessageScroller();
  const visibility = useMessageScrollerVisibility();
  const currentAnchorId = () => visibility().currentAnchorId;

  return (
    <HoverCard placement="left" gutter={-28}>
      <HoverCardTrigger
        as="button"
        type="button"
        aria-label="Open transcript outline"
        class="flex h-9 w-9 flex-col items-center justify-center gap-1 rounded-md transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <For each={userMessages}>
          {(message) => (
            <span
              data-current={message.id === currentAnchorId() ? "true" : "false"}
              class="h-0.5 w-4 rounded-full bg-muted-foreground/40 data-[current=true]:bg-foreground"
            />
          )}
        </For>
      </HoverCardTrigger>
      <HoverCardContent class="flex w-64 flex-col gap-1 rounded-2xl p-1">
        <For each={userMessages}>
          {(message) => (
            <button
              type="button"
              aria-current={currentAnchorId() === message.id
                ? "location"
                : undefined}
              class="flex min-h-7 items-center rounded-xl px-2 py-1.5 text-left text-sm transition-colors outline-none hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground aria-current:bg-accent aria-current:text-accent-foreground"
              onClick={() =>
                scrollToMessage(message.id, {
                  align: "start",
                  behavior: "smooth",
                })}
            >
              <span class="line-clamp-1 min-w-0">
                {getTrimmedMessageText(message)}
              </span>
            </button>
          )}
        </For>
      </HoverCardContent>
    </HoverCard>
  );
}
```

`data-current` MUST be the explicit `"true"/"false"` string (Solid boolean attrs
are presence-only and the CSS selects `data-[current=true]`). Copy titles
("Transcript Outline", "Track the current anchored turn.") and the note "Open
the outline to jump between anchored turns as you read.".

- [ ] **Step 3: Build, check, verify, commit**

`deno task build:registry`; fmt/lint/check both files; reload the docs page (all
11 previews now real; `grep`-style assertion: zero "not found in registry").
Drive: commands — open "Jump to...", pick the second entry → the
`command-compare` row scrolls to the top (smooth; wait 600ms); visibility —
hover the dots (or `page.hover`) → outline opens; the first dot is
`data-current="true"`; scroll the viewport to the bottom → the last dot becomes
current; click an outline entry → that turn scrolls to the reading line.

```bash
git add apps/docs/src/registry/example/message-scroller-{commands,visibility}.tsx apps/docs/public/r apps/docs/public/registry apps/docs/src/__registry__ apps/docs/src/registry/icons/__lucide__
git commit -m "Port the commands and visibility message-scroller examples"
```

---

### Task 15: Final verification, cleanup, notes

**Files:**

- Delete: `apps/docs/src/routes/message-scroller-lab.tsx` (and its
  `.git/info/exclude` line)
- Modify (if findings): the memory file
  `/Users/ptzburn/.claude/projects/-Users-ptzburn-Documents-projects-shadcn-solidjs/memory/solid2-component-port-recipe.md`
  (append a short "message-scroller (2026-08-17)" paragraph: engine port facts,
  `~/lib/ai.ts` simulator, lab+suite pattern, any Solid 2 gotchas discovered)
  and `MEMORY.md` if a new file is added.

- [ ] **Step 1: Re-run the behavior suite one last time against the committed
      engine**

```bash
cd "$SCRATCH/pw" && node message-scroller.mjs http://localhost:3228
```

Expected: `N/N passed`, exit 0.

- [ ] **Step 2: Docs sweep + prod build**

```bash
node "$SCRATCH/pw/smoke.mjs" http://localhost:3228 /docs/components/message-scroller /docs/components/attachment /docs/components/message
```

Expected: `OK` for all three, `previews=11` on message-scroller, `notFound=0`,
no console/page errors. Then stop the dev server, delete the lab route, and run
the whole-tree checks:

```bash
rm apps/docs/src/routes/message-scroller-lab.tsx
sed -i '' '/message-scroller-lab.tsx/d' .git/info/exclude
cd apps/docs && deno task check && deno task build:registry && deno task build 2>&1 | tail -5
git status --short   # only build outputs (if any) should be dirty; commit them
```

Expected: `deno task check` clean (fmt, lint, typecheck), registry build shows
no message-scroller skips, `deno task build` succeeds. If the prod build changed
tracked outputs, `git add` + commit "Rebuild registry outputs".

- [ ] **Step 3: Record what was learned**

Append to the recipe memory (2–6 lines): the message-scroller engine is a
faithful upstream mirror in Solid 2 (signals+equals stores, onSettled
lifecycles, array refs, passive wheel via ref), the four upstream fixes main
lacked, the `~/lib/ai.ts` simulator + `MessageAnimated` chrome, the lab-route +
Playwright behavior-suite pattern (scratchpad `pw/message-scroller.mjs`, N
scenarios), any new Solid 2 gotcha met while making the suite green, and the
`main` findings list (spec §10) as "to report". Update `MEMORY.md` only if a new
memory file was created.

- [ ] **Step 4: Final commit and summary**

```bash
git status --short && git log --oneline -14
```

Report to the user: what shipped (files), suite results (scenario count), docs
page state, deviations from upstream, the `main` findings, and anything
deferred.

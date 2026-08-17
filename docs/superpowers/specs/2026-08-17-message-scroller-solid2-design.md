# Message Scroller on Solid 2 — design

Date: 2026-08-17 · Branch: `solid2` · Status: approved in brainstorming,
awaiting implementation plan

## 1. Goal

Port shadcn/ui's **MessageScroller** — the headless chat-transcript scroll
engine (`@shadcn/react/message-scroller`) plus its styled registry component,
docs page and examples — to Solid 2.0 in this repo (`apps/docs`), replacing the
`main` branch's Solid 1 port, which was taken from an older upstream snapshot
and is missing later behavior fixes.

Deliverables:

1. Headless engine in six registry files
   (`apps/docs/src/registry/ui/message-scroller-*`).
2. Styled `message-scroller.tsx` (nova style inlined).
3. `scroll-fade-*` Tailwind utility family in `app.css` (needed by the viewport;
   also un-defers AttachmentGroup's `scroll-fade-x`).
4. Docs-only helpers: `~/lib/ai.ts` (chat simulation),
   `~/lib/message-animations.ts`, `~/components/message-animated.tsx`.
5. Eleven examples + upstream's full docs page adapted for Solid.
6. A scratchpad Playwright behavior suite that drives upstream's test scenarios
   against the real port (not committed).

## 2. Sources of truth

| What                         | Path (in `~/Documents/projects/ui`, commit `607e8a9`, 2026-08-04)                                                                                                                                                                        |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Engine                       | `packages/react/src/message-scroller/{types,stores,geometry,use-message-scroller-refs,use-message-scroller-commands,use-message-scroller-controller,components,index,utils}.ts(x)`                                                       |
| Engine tests (behavior spec) | `packages/react/src/message-scroller/message-scroller.test.tsx` (jsdom, 44 cases), `message-scroller.browser.test.tsx` (chromium, 17 cases)                                                                                              |
| Styled component             | `apps/v4/registry/bases/base/ui/message-scroller.tsx` (radix/aria variants differ only in import paths)                                                                                                                                  |
| Registry entry               | `apps/v4/registry/bases/base/ui/_registry.ts` (`message-scroller`: deps `@shadcn/react`, registryDeps `button`)                                                                                                                          |
| Nova style                   | `apps/v4/registry/styles/style-nova.css` — only `.cn-message-scroller-content { @apply gap-6 }`                                                                                                                                          |
| scroll-fade CSS              | `packages/shadcn/src/tailwind.css` (`/* scroll-fade */` block through `scroll-fade-none`)                                                                                                                                                |
| Docs page                    | `apps/v4/content/docs/components/base/message-scroller.mdx` (behavior page) + `apps/v4/content/docs/react/message-scroller.mdx` (API reference tables)                                                                                   |
| Examples                     | `apps/v4/examples/base/message-scroller-{demo,anchoring,group-chat,previous-context,streaming,opening-position,load-history,animation,commands,visibility,scrollable}.tsx` (`message-scroller-state` is unreferenced upstream — skipped) |
| Docs chrome                  | `apps/v4/components/message-animated.tsx`, `apps/v4/lib/message-animations.ts`                                                                                                                                                           |
| Style ground truth           | `git show main:apps/docs/public/r/message-scroller.json` (main's own inlined output)                                                                                                                                                     |
| Local reference (critically) | `main` branch: `apps/docs/src/registry/ui/message-scroller*.ts(x)`, its mdx page and 5 examples                                                                                                                                          |

Solid 2 stack: `solid-js` 2.0.0-rc.0 (`@solidjs/signals` rc.0 — the
omit/$SOURCES Vite patch stays required), `@solidjs/web` 2.0.0-rc.0,
`@kobalte/core` 2.0.0-alpha.0, Tailwind 4.3.3, SSR off.

## 3. Non-goals

- Publishing the engine as an npm package (upstream ships `@shadcn/react`; we
  ship files through the registry like `main`).
- Porting `@shadcn/helpers` (the ~3k-line AI-SDK chat runtime). The docs get a
  purpose-built simulator instead.
- Motion-based animations (`motion/react`). CSS/tw-animate-css instead.
- Virtualization support beyond a documented pattern (`@tanstack/solid-virtual`
  pins Solid 1).
- Fixing `main`. Findings about `main` are recorded (§10) for a separate report.

## 4. Architecture

Approach: **faithful mirror of upstream in Solid 2 idioms**. Module
decomposition, function names, ref-bag field names and branch order stay
upstream's, so future upstream diffs apply mechanically and the port can be
audited against upstream's 61 test scenarios. Only the React plumbing (hooks,
`useSyncExternalStore`, ref callbacks, effect ordering) is translated. The
scroll hot path stays imperative (rAF/observer driven, DOM `data-*` mirroring) —
upstream's stated performance design; no signal-driven scrolling.

### 4.1 Files (all `apps/docs/src/registry/ui/`)

| File                              | Mirrors upstream                                                                                                         | Contents                                                                                                                                                                                                                                                                              |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `message-scroller-types.ts`       | `types.ts`                                                                                                               | constants, all types. `MessageScrollerContextValue` exposes `scrollableState: Accessor<…>`, `visibilityState: Accessor<…>`, `addVisibilitySubscriber/removeVisibilitySubscriber` instead of the two stores. `Ref<T> = { current: T }`.                                                |
| `message-scroller-geometry.ts`    | `geometry.ts`                                                                                                            | verbatim (pure DOM math). Keep explicit return types for `deno lint`.                                                                                                                                                                                                                 |
| `message-scroller-controller.ts`  | `stores.ts` + `use-message-scroller-refs.ts` + `use-message-scroller-commands.ts` + `use-message-scroller-controller.ts` | three functions **in this order**: `createMessageScrollerRefs(props)`, `createMessageScrollerCommands({ refs, commitScrollState, scheduleStateCommit, scheduleVisibilitySync })`, `createMessageScrollerController(props)`; plus `areScrollStatesEqual` / `areVisibilityStatesEqual`. |
| `message-scroller-components.tsx` | `components.tsx`                                                                                                         | contexts, hooks, `MessageScrollerProvider`, `MessageScroller` (Root), `Viewport`, `Content`, `Item`, `Button`.                                                                                                                                                                        |
| `message-scroller-primitive.ts`   | `index.ts`                                                                                                               | `export const MessageScroller = { Provider, Root, Viewport, Content, Item, Button }`; re-exports hooks and public types. Carries the divergence comment block (§10).                                                                                                                  |
| `message-scroller.tsx`            | `bases/base/ui/message-scroller.tsx`                                                                                     | styled wrapper.                                                                                                                                                                                                                                                                       |

The registry entry already lists these six files; its `dependencies` become
`["@kobalte/core"]` (drop `@solid-primitives/refs` — Solid 2 array refs replace
`mergeRefs`).

### 4.2 Public API (identical names to upstream)

- Provider props: `autoScroll=false`, `defaultScrollPosition="end"`,
  `scrollEdgeThreshold=8`, `scrollPreviousItemPeek=64`, `scrollMargin=0`,
  `children`.
- `MessageScroller` (Root): `ComponentProps<"div">` (from `@solidjs/web`).
- `MessageScrollerViewport`: div props + `preserveScrollOnPrepend=true`;
  defaults `role="region"`, `aria-label="Messages"`, `tabindex=0` (overridable).
- `MessageScrollerContent`: div props + `spacerClassName`; defaults
  `role="log"`, `aria-relevant="additions"`.
- `MessageScrollerItem`: div props + `messageId?`, `scrollAnchor=false`; renders
  `data-message-id`, `data-scroll-anchor="true"|"false"`.
- `MessageScrollerButton<T extends ValidComponent = "button">`: Kobalte
  `PolymorphicProps<T, …>` (`as=` instead of Base UI `render=`) +
  `behavior="smooth"`, `direction="end"`; renders `type="button"`, `inert` when
  inactive, `tabindex=-1` when inactive (consumer value otherwise),
  `data-active="true"|"false"`, `data-direction`; default children
  `<span>Scroll to {direction}</span>`.
- Hooks: `useMessageScroller()` →
  `{ scrollToMessage, scrollToEnd, scrollToStart }` (plain functions returning
  `boolean`); `useMessageScrollerScrollable()` → `Accessor<{ start; end }>`;
  `useMessageScrollerVisibility()` →
  `Accessor<{ currentAnchorId; visibleMessageIds }>` (subscribing = calling the
  hook).
- Types re-exported: `MessageScrollerDefaultScrollPosition`,
  `MessageScrollerScrollAlign`, `MessageScrollerScrollOptions`,
  `MessageScrollerScrollable`, `MessageScrollerVisibilityState`,
  `MessageScrollerButtonDirection`, `MessageScrollerProviderProps`, part prop
  types.

## 5. React → Solid 2 translation rules

### 5.1 State ("stores")

- In `createMessageScrollerRefs`:
  `const [scrollableState, setScrollableState] =
  createSignal(EMPTY_MESSAGE_SCROLLER_SCROLLABLE, { equals: areScrollStatesEqual })`
  and the same for visibility with `areVisibilityStatesEqual`. Custom `equals`
  reproduces "subscribers only update on real transitions".
- Sync mirror: `refs.scrollableSnapshot` (plain field) written in
  `commitScrollState` next to the signal set; `mirrorStateAttributes` reads the
  mirror, never the signal (Solid 2 signal reads lag until flush).
- Visibility ref-count: `visibilitySubscriberCount` in the controller.
  `addVisibilitySubscriber()` → on 0→1 `observeVisibility()`;
  `removeVisibilitySubscriber()` → on 1→0 `unobserveVisibility()`.
  `hasVisibilityListeners()` gates the rAF sync as upstream's
  `visibilityStore.hasListeners()`.

### 5.2 Ref bag & prop mirroring

- `Ref<T> = { current: T }` objects with upstream's exact names
  (`autoScrollRef`, `modeRef`, `lastScrollTopRef`, `streamingTurnRef`,
  `handledScrollAnchorsRef`, …) built once in `createMessageScrollerRefs`,
  initial values from `untrack(() => props.x ?? default)`.
- Latest-prop mirroring: four
  `createRenderEffect(() => props.x ?? default, v => { xRef.current = v })` in
  the controller (autoScroll, scrollEdgeThreshold, scrollMargin,
  scrollPreviousItemPeek).
- `defaultScrollPosition`: `createRenderEffect` that stores the value and clears
  `defaultScrollPositionAppliedRef` when it changes; then
  `createEffect(() => props.defaultScrollPosition ?? "end", () => { applyDefaultScrollPosition() })`
  (runs on mount and on change — upstream's
  `useLayoutEffect([applyDefaultScrollPosition])`).
- autoScroll effect:
  `createEffect(() => props.autoScroll ?? false, autoScroll => {
  if (autoScroll && modeRef.current === "following-bottom" && itemCountRef.current > 0)
  scrollToEnd({ behavior: "auto" }); else commitScrollState(); })`.
- Teardown: `onCleanup` in the controller cancels `stateFrameRef`,
  `visibilityFrameRef`, `pendingScrollFrameRef`, `autoscrollingTimeoutRef`,
  disconnects the IntersectionObserver.

### 5.3 Engine logic carried from **current** upstream (all missing on `main`)

1. `reconcileFollowMode`: track `lastScrollTopRef`; release follow-bottom only
   when `scrollable.end && scrolledUp && !autoscrolling`; do not arm while
   `modeRef.current` is `"settling-jump"` **or** `"anchored-to-message"`.
2. `commitScrollState`: publish `{ ...nextState, end: false }` while
   `modeRef.current === "following-bottom"` (reconcile on raw geometry first).
3. `handleResize`: after `reanchorToAnchoredMessage()`, if `autoScroll` and the
   spacer went `>0 → 0`, `scrollToEnd({ behavior: "auto" })`.
4. Both ResizeObservers coalesce their callback onto `requestAnimationFrame`
   (cancel the previous frame) — avoids "ResizeObserver loop completed with
   undelivered notifications" because `handleResize` mutates the observed
   spacer.

Everything else (`handleContentChange` branch order, prepend restore, pending
`scrollToMessage` queue, `applyDefaultScrollPosition` `last-anchor` logic,
commands, `userScrollIntent`) is a line-for-line translation.

### 5.4 Component lifecycle mapping

| Upstream                                      | Solid 2                                                                                                                                                                                  |
| --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `React.createContext` + `.Provider`           | `createContext<T                                                                                                                                                                         |
| ref callback `(el) => …`                      | ref function; compose consumer ref with the array form `ref={[internal, props.ref]}` (falsy entries are skipped by `applyRef`); refs run under a null owner → no `onCleanup` inside refs |
| `useLayoutEffect`/`useEffect` mount + cleanup | `onSettled(() => { …; return cleanup })`                                                                                                                                                 |
| `useEffect([messageId])` re-register          | `createEffect(() => props.messageId, (id, prev) => …, { defer: true })`                                                                                                                  |
| unmount ref(null)                             | component `onCleanup` (Root/Viewport/Content null their elements; Item unregisters `registerMessage(id, null, element)`)                                                                 |
| `onWheel` (React passive root listener)       | ref: `el.addEventListener("wheel", handleWheel, { passive: true })` — Solid 2 has no `on:` namespace; consumer `onWheel` invoked from the handler                                        |
| `onScroll/onTouchMove/onKeyDown`              | Solid handlers wrapping consumer handlers via `callEventHandler` supporting `JSX.EventHandlerUnion` (bound tuple called as `handler[0](handler[1], event)`)                              |
| `inert: !isActive`                            | `inert={!isActive()}` (boolean attr = presence in Solid 2)                                                                                                                               |
| `tabIndex: isActive ? tabIndex : -1`          | `tabindex={isActive() ? props.tabindex : -1}`                                                                                                                                            |
| `useRender` + `render` prop                   | Kobalte `Polymorphic` `as={props.as ?? "button"}`                                                                                                                                        |
| `useLatest(onClick)`                          | read `props.onClick` at call time (props are live)                                                                                                                                       |

Component specifics:

- **Provider**:
  `const { context, registerMessage } = createMessageScrollerController(props)`;
  nested
  `<MessageScrollerContext value={context}><MessageScrollerItemContext value={registerMessage}>`.
- **Root**: `ref={[context.setRootElement, props.ref]}` (composes —
  upstream/main drop registration when a consumer passes `ref`);
  `onCleanup(() => setRootElement(null))`.
- **Viewport**: `createRenderEffect` mirrors `preserveScrollOnPrepend ?? true`
  into `preserveScrollOnPrependRef`; `onSettled` installs the rAF-coalesced
  ResizeObserver on the viewport and returns cancel+disconnect; `onCleanup`
  nulls the viewport element.
- **Content**: `onSettled` → `setSpacerElement(spacer)` again (computed `gap` is
  only readable once connected), `handleContentChange()`,
  `MutationObserver(childList)`, rAF-coalesced ResizeObserver; cleanup
  disconnects both, nulls content + spacer. Spacer is the last child:
  `<div ref aria-hidden="true" data-message-scroller-spacer="" hidden class={props.spacerClassName} />`.
- **Item**: register in the ref (synchronous during render, before Content's
  `onSettled` so a queued `scrollToMessage` can flush on the first content
  change), re-register on id change, unregister with element identity on cleanup
  (duplicate-id safety).
- **Button**:
  `isActive = createMemo(() => direction() === "start" ? state().start : state().end)`;
  click:
  `if (!isActive()) return; call consumer onClick; if (!defaultPrevented) { blur(); scrollTo(Start|End)({ behavior }) }`.

### 5.5 Solid 2 hazards (checked in review)

- Defaults via `??` inside components; `merge()` only for plain wrapper
  defaults, never a `cond ? undefined : x` prop into a Kobalte root
  (merge-undefined gotcha).
- No signal/store writes in component bodies or effect compute phases: every
  `setScrollableState`/`setVisibilityState` call site is an
  rAF/observer/event/`onSettled`/effect-apply path.
- `data-*` booleans are explicit strings; only `inert`/`hidden` use presence
  semantics.
- One-time deliberate reads use `untrack` (initial ref values from props).
- `STRICT_READ_UNTRACKED`: effect apply phases only read the ref bag and plain
  values.

## 6. Styled component & CSS

`message-scroller.tsx` = upstream `bases/base/ui/message-scroller.tsx` per the
port recipe: `omit`/`merge`, `IconPlaceholder`
(`lucide="arrow-down" tabler="arrow-down"
ph="arrow-down" ri="arrow-down-line" hugeicons="arrow-down-02"`),
`data-slot`s and `data-direction/data-variant/data-size` as upstream,
`MessageScrollerPrimitive.Button
as={Button}` forwarding `variant="secondary"`,
`size="icon-sm"`. Nova inlining: `cn-message-scroller-content` → `gap-6`; the
other `cn-message-scroller*` markers have no nova rules (cross-check
`main:apps/docs/public/r/message-scroller.json`). Class strings otherwise
upstream's, including
`scroll-fade-b scrollbar-thin scrollbar-gutter-stable …
data-autoscrolling:scrollbar-thumb-transparent data-autoscrolling:scrollbar-track-transparent`
(the `scrollbar-*` utilities are Tailwind 4.3 built-ins — verified in
`tailwindcss/dist/lib.js`).

`app.css`: append the **full** `scroll-fade` block from
`packages/shadcn/src/tailwind.css` (`@property --scroll-fade-{t,b,s,e,mask}`,
the four `@theme inline` keyframes, `@utility scroll-fade`, `-y`, `-x`, `-t`,
`-b`, `-l`, `-r`, `-s`, `-e`, `scroll-fade-*`, `scroll-fade-{t,b,s,e}-*`,
`scroll-fade-none`) — not `main`'s partial three utilities. Verify
AttachmentGroup's `scroll-fade-x` starts working.

## 7. Docs helpers, examples, page

### 7.1 `apps/docs/src/lib/ai.ts` (docs-only)

Minimal simulator (~150 lines) with upstream's import path so example source
reads the same:

```ts
type ChatMessage = { id: string; role: "user" | "assistant"; text: string }
createChat(): Chat  // .user(text) .assistant(text) .sleep(ms) → Chat (chainable)
Chat.get(count?: number): ChatMessage[]     // clones of the first N scripted messages
Chat.next(messages: readonly ChatMessage[]): ChatMessage | null  // next scripted user turn
Chat.transport(opts?: { delayMs?: number }): ChatTransport        // scripted streaming
createChatSession({ messages, transport }): {
  messages: Accessor<ChatMessage[]>; status: Accessor<"ready"|"submitted"|"streaming">;
  sendMessage(m: ChatMessage): void; setMessages(m: ChatMessage[]): void }
getMessageText(m: ChatMessage): string
```

`sendMessage` appends the user turn, sets `submitted`, honors the scripted
`sleep`, then streams the following assistant turn word-per-tick (`/\S+\s*/g`,
`delayMs` apart, default 20) as `streaming`, then `ready`. Timers are cleaned on
owner disposal and on `setMessages` (reset). Reads run through Solid signals so
`For` and `aria-busy` react.

### 7.2 `~/lib/message-animations.ts` + `~/components/message-animated.tsx`

Presets `fade | slide-up | slide-side | pop` as tw-animate-css class sets
(`animate-in
fade-in`, `slide-in-from-bottom-4`, `slide-in-from-right-4`,
`zoom-in-95`) with `motion-reduce:animate-none`; `MESSAGE_ANIMATIONS` map +
`MessageAnimationPreset` type. `MessageAnimated` renders `MessageScrollerItem`
(user rows animated with `scrollAnchor ??
true`; assistant rows plain) around
`Message`/`MessageContent`/`Bubble`/`BubbleContent` with paragraph splitting,
`userVariant="muted"`, `assistantVariant="ghost"`.

### 7.3 Examples (registry/example, entries in `registry-examples.ts`)

| Example          | Demonstrates                           | Notes                                                        |
| ---------------- | -------------------------------------- | ------------------------------------------------------------ |
| demo             | full chat card                         | provider **without** `autoScroll` (main added it wrongly)    |
| anchoring        | toggle anchor role user/assistant      | ToggleGroup                                                  |
| group-chat       | marker rows as anchors                 | Marker + Message                                             |
| previous-context | `scrollPreviousItemPeek` slider        | Slider                                                       |
| streaming        | `autoScroll` follow/release            | chat session                                                 |
| opening-position | `defaultScrollPosition` tabs           | Tabs; remount on change                                      |
| load-history     | prepend + `preserveScrollOnPrepend`    | `toast` from `~/registry/ui/toast.tsx` (sonner → toast rule) |
| animation        | presets via Select                     | MessageAnimated                                              |
| commands         | jump menu via `useMessageScroller`     | DropdownMenu                                                 |
| visibility       | TOC via `useMessageScrollerVisibility` | HoverCard                                                    |
| scrollable       | `useMessageScrollerScrollable` status  | —                                                            |

Conversion rules: `.map` → `For`; `className` → `class`; `render={<X/>}` →
`as={X}`; `lucide-react` → `IconPlaceholder` (five names); `useState` →
`createSignal`; `status ===` → `status() ===`; `~/registry/ui/…` imports; `Show`
for conditionals; `Repeat` for count-based fillers. All required registry
components already exist on solid2 (card, button, dropdown-menu, empty,
input-group, tooltip, toggle-group, slider, select, tabs, hover-card, marker,
message, bubble, toast).

### 7.4 Docs page `apps/docs/src/routes/(app)/docs/components/message-scroller.mdx`

Upstream's base page, structure and prose intact, adapted:

- Install: `npx @ptzburn/shadcn-solidjs@latest add message-scroller`; manual:
  `npm install
  @kobalte/core`, `add button`,
  `<ComponentSource name="message-scroller" />`, main's Callout that the engine
  ships as six files installed together.
- Snippets: Solid syntax (`For`, `class`, `status() === "streaming"`,
  `~/components/ui/message-scroller`).
- All eleven
  `<ComponentPreview name="message-scroller-…" previewClassName="h-auto p-4 sm:p-10" />`.
- "Animating New Messages": replace `motion.create` with the tw-animate-css
  preset note.
- "Virtualization": keep prose; snippet adapted to `createVirtualizer` from
  `@tanstack/solid-virtual` with a Callout that the package currently pins Solid
  1, so the snippet is illustrative and untested on Solid 2.
- "Unstyled": point at `message-scroller-primitive.ts`'s `MessageScroller.*`
  namespace.
- API Reference inlined from upstream's react page
  (Provider/Root/Viewport/Content/Item/ Button + data-attribute tables, hooks +
  command options), adjusted: `tabindex`, `as` instead of `render`, hooks return
  accessors, Button `variant`/`size`, main's accessor Callout.

`config/docs.ts` already has the nav item.

## 8. Verification

1. Per-file `deno fmt` / `deno lint --fix` / `deno check` while porting; final
   whole-tree `deno task check`, `deno task build:registry` (the six
   message-scroller items — ui + five pre-existing example entries — stop being
   skipped; the six new example entries activate; icon map grows),
   `deno task build`.
2. **Behavior suite** (scratchpad `pw/message-scroller.mjs`, playwright-core
   1.48.2 + cached chromium-1148) against a temporary dev route
   `/dev/message-scroller-lab` (added for the run, removed before commit) that
   renders an instrumented scroller with knobs: append/prepend/replace rows,
   stream text, resize viewport, toggle `autoScroll`, set
   `defaultScrollPosition`, subscribe visibility, call commands with options;
   hook outputs mirrored into DOM for assertions. Scenarios ported from
   upstream's browser + jsdom tests, driven through the real pointer path (wheel
   deltas, scrollbar drag, keyboard):
   - opening: end / start / `last-anchor` (overflowing anchor at reading line
     with peek; fitting turn or no anchor → end); async mount; explicit
     `scrollToMessage` beats the default; queued target flushes on mount;
     missing id after mount → `false`
   - autoScroll: follows appends/growth/late resize; releases on
     wheel/touch/scroll keys/ scrollbar drag; **not** on content growth past the
     edge; no follow without autoScroll; bulk multi-anchor append keeps
     following; single new anchor holds at the reading line while the reply
     streams; hand-off to follow when the spacer is consumed; a user gesture
     during a programmatic jump can re-arm at the bottom
   - anchoring: new anchor placed with previous-item peek; replaced row (same
     count) anchors; anchored turn holds when content below collapses;
     spacer-only overflow shows no end button; `end:false` while following (no
     button strobe)
   - prepend: first visible row preserved; command-path seeded anchor preserved;
     `preserveScrollOnPrepend={false}` opt-out
   - visibility: tracked only while subscribed; ids in document order;
     `currentAnchorId` sticks above the viewport; anchor in the peek band wins;
     unsubscribe resets
   - button: `inert`/`tabindex=-1`/`data-active` when idle; click scrolls and
     re-arms follow with autoScroll; `direction="start"`
   - commands: `align` start/center/end/nearest, `scrollMargin`, content padding
     respected
   - a11y defaults and overrides
3. Docs sweep with the existing `smoke.mjs`
   (`/docs/components/message-scroller`, `/docs/components/attachment`): zero
   console/page errors, 11 previews, no "not found in registry"; hand-drive each
   demo once.
4. Engine error handling is upstream's: commands return `false` when unmounted;
   observers guarded by `typeof X === "undefined"`; only the missing-context
   errors throw.

## 9. Work breakdown (for the plan)

1. Engine files (types → geometry → controller → components → primitive).
2. Styled wrapper + `scroll-fade` CSS + registry entry deps.
3. Lab route + Playwright suite; iterate on the engine until green.
4. `~/lib/ai.ts`, `message-animations.ts`, `message-animated.tsx`.
5. Eleven examples + registry-examples entries; `build:registry`.
6. Docs page.
7. Whole-tree check, prod build, smoke sweep, remove the lab route, commit.

## 10. Divergence log (also as a comment block in `message-scroller-primitive.ts`)

Deliberate differences from upstream:

- Distributed as six registry files, not `@shadcn/react`.
- `useMessageScrollerScrollable` / `useMessageScrollerVisibility` return
  accessors.
- Button polymorphism via Kobalte `as`, not Base UI `render`.
- Lowercase intrinsic attributes (`tabindex`, `class`); `inert` as a native
  boolean attr.
- Consumer `ref` on Root is composed (upstream lets a spread `ref` replace
  registration).
- Docs helpers are minimal stand-ins (`~/lib/ai.ts`, tw-animate-css
  `MessageAnimated`).

Findings about `main` (to report separately, not fixed here):

- Engine snapshot predates upstream fixes 5.3 (1)–(4).
- Root drops registration when a consumer passes `ref`.
- Demo example passes `autoScroll`; upstream's does not.
- Only three of the `scroll-fade` utilities were ported.
- Page trimmed to 5 of 11 previews and drops the Virtualization section.

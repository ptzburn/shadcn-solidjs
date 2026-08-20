# Date Picker Composition Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use
> superpowers:subagent-driven-development (recommended) or
> superpowers:executing-plans to implement this plan task-by-task. Steps use
> checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Ark UI `DatePicker` component with a documented
`Popover` + `Calendar` composition, matching shadcn/ui, and drop the project's
only Ark UI dependency.

**Architecture:** The date picker stops being a registry component. Seven
examples compose `Popover`, `Calendar` and form primitives directly; the docs
page teaches that composition. Removal of `registry/ui/date-picker.tsx` takes
`@ark-ui/solid`, eleven `cn-date-picker-*` style markers and their
`port-style.ts` derivations with it.

**Tech Stack:** Deno workspace, SolidJS 1.9, Kobalte (popover, button, field,
input-group), Corvu Calendar (via `registry/ui/calendar.tsx`), chrono-node,
Tailwind v4.

**Spec:** `docs/superpowers/specs/2026-08-19-date-picker-composition-design.md`

## Global Constraints

- No comments in `apps/docs/src/registry/**` sources — components and examples
  alike. Maintainer rationale belongs in the commit message.
- Docs prose never says "upstream" and never compares the project to shadcn/ui,
  Radix, Ark UI or React Aria. Describe components on their own terms.
- Icons in registry sources are `IconPlaceholder` markers carrying all five
  libraries (`lucide`, `tabler`, `ph`, `ri`, `hugeicons`), never direct
  `~icons/*` imports.
- Run `deno fmt` and `deno lint --fix` on every file touched; the pre-commit
  hook runs `deno fmt`, `deno lint --fix` and `deno task check` and will abort a
  failing commit.
- Kobalte positions popovers from the root: alignment is
  `placement="bottom-start"` / `"bottom-end"` on `<Popover>`, never an `align`
  prop on `<PopoverContent>`.
- No new dependencies. Dates format through `Intl` (`toLocaleDateString`), not
  date-fns.
- `Calendar` API is `mode`, `value`, `onValueChange`, `initialMonth`, `month`,
  `onMonthChange`, `captionLayout`, `numberOfMonths`. Single mode values are
  `Date | null`; range mode values are `{ from: Date | null; to: Date | null }`.
- Every example file default-exports a component whose name matches the file in
  PascalCase.

---

### Task 1: Rewrite the seven examples as compositions

**Files:**

- Modify: `apps/docs/src/registry/example/date-picker-demo.tsx`
- Modify: `apps/docs/src/registry/example/date-picker-basic.tsx`
- Modify: `apps/docs/src/registry/example/date-picker-range.tsx`
- Modify: `apps/docs/src/registry/example/date-picker-dob.tsx`
- Modify: `apps/docs/src/registry/example/date-picker-input.tsx`
- Modify: `apps/docs/src/registry/example/date-picker-natural-language.tsx`
- Modify: `apps/docs/src/registry/example/date-picker-time.tsx`

**Interfaces:**

- Consumes: `Calendar` from `~/registry/ui/calendar.tsx`; `Popover`,
  `PopoverContent`, `PopoverTrigger` from `~/registry/ui/popover.tsx`; `Button`
  from `~/registry/ui/button.tsx`; `Field`, `FieldGroup`, `FieldLabel` from
  `~/registry/ui/field.tsx`; `InputGroup`, `InputGroupAddon`,
  `InputGroupButton`, `InputGroupInput` from `~/registry/ui/input-group.tsx`;
  `Input` from `~/registry/ui/input.tsx`; `IconPlaceholder` from
  `~/registry/icons/icon-placeholder.tsx`.
- Produces: seven example modules named `date-picker-*`, each default-exporting
  a component. `registry-examples.ts` already lists all seven; their entries do
  not change.

- [ ] **Step 1: Rewrite `date-picker-demo.tsx`**

```tsx
import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";
import { Button } from "~/registry/ui/button.tsx";
import { Calendar } from "~/registry/ui/calendar.tsx";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/registry/ui/popover.tsx";

import { createSignal, Show } from "solid-js";

const formatDate = (date: Date) =>
  date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

export default function DatePickerDemo() {
  const [date, setDate] = createSignal<Date | null>(null);

  return (
    <Popover placement="bottom-start">
      <PopoverTrigger
        as={Button<"button">}
        variant="outline"
        class="w-[212px] justify-between font-normal"
      >
        <Show when={date()} fallback={<span>Pick a date</span>}>
          {(value) => formatDate(value())}
        </Show>
        <IconPlaceholder
          lucide="chevron-down"
          tabler="chevron-down"
          ph="caret-down"
          ri="arrow-down-s-line"
          hugeicons="arrow-down-01"
        />
      </PopoverTrigger>
      <PopoverContent class="w-auto p-0">
        <Calendar
          mode="single"
          value={date()}
          onValueChange={setDate}
          initialMonth={date() ?? undefined}
        />
      </PopoverContent>
    </Popover>
  );
}
```

- [ ] **Step 2: Rewrite `date-picker-basic.tsx`**

```tsx
import { Button } from "~/registry/ui/button.tsx";
import { Calendar } from "~/registry/ui/calendar.tsx";
import { Field, FieldLabel } from "~/registry/ui/field.tsx";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/registry/ui/popover.tsx";

import { createSignal, Show } from "solid-js";

const formatDate = (date: Date) =>
  date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

export default function DatePickerBasic() {
  const [date, setDate] = createSignal<Date | null>(null);

  return (
    <Field class="mx-auto w-44">
      <FieldLabel for="date-picker-basic">Date</FieldLabel>
      <Popover placement="bottom-start">
        <PopoverTrigger
          as={Button<"button">}
          variant="outline"
          id="date-picker-basic"
          class="justify-start font-normal"
        >
          <Show when={date()} fallback={<span>Pick a date</span>}>
            {(value) => formatDate(value())}
          </Show>
        </PopoverTrigger>
        <PopoverContent class="w-auto p-0">
          <Calendar
            mode="single"
            value={date()}
            onValueChange={setDate}
            initialMonth={date() ?? undefined}
          />
        </PopoverContent>
      </Popover>
    </Field>
  );
}
```

- [ ] **Step 3: Rewrite `date-picker-range.tsx`**

```tsx
import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";
import { Button } from "~/registry/ui/button.tsx";
import { Calendar } from "~/registry/ui/calendar.tsx";
import { Field, FieldLabel } from "~/registry/ui/field.tsx";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/registry/ui/popover.tsx";

import { createSignal, Show } from "solid-js";

type DateRange = { from: Date | null; to: Date | null };

const addDays = (date: Date, days: number) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);

const formatDate = (date: Date) =>
  date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

const formatRange = (range: DateRange) => {
  if (!range.from) return null;
  if (!range.to) return formatDate(range.from);
  return `${formatDate(range.from)} - ${formatDate(range.to)}`;
};

export default function DatePickerRange() {
  const from = new Date(new Date().getFullYear(), 0, 20);
  const [range, setRange] = createSignal<DateRange>({
    from,
    to: addDays(from, 20),
  });

  return (
    <Field class="mx-auto w-60">
      <FieldLabel for="date-picker-range">Date Picker Range</FieldLabel>
      <Popover placement="bottom-start">
        <PopoverTrigger
          as={Button<"button">}
          variant="outline"
          id="date-picker-range"
          class="justify-start px-2.5 font-normal"
        >
          <IconPlaceholder
            lucide="calendar"
            tabler="calendar"
            ph="calendar-blank"
            ri="calendar-line"
            hugeicons="calendar-03"
          />
          <Show when={formatRange(range())} fallback={<span>Pick a date</span>}>
            {(label) => label()}
          </Show>
        </PopoverTrigger>
        <PopoverContent class="w-auto p-0">
          <Calendar
            mode="range"
            value={range()}
            onValueChange={setRange}
            initialMonth={range().from ?? undefined}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </Field>
  );
}
```

- [ ] **Step 4: Rewrite `date-picker-dob.tsx`**

```tsx
import { Button } from "~/registry/ui/button.tsx";
import { Calendar } from "~/registry/ui/calendar.tsx";
import { Field, FieldLabel } from "~/registry/ui/field.tsx";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/registry/ui/popover.tsx";

import { createSignal, Show } from "solid-js";

export default function DatePickerDob() {
  const [open, setOpen] = createSignal(false);
  const [date, setDate] = createSignal<Date | null>(null);

  return (
    <Field class="mx-auto w-44">
      <FieldLabel for="date-picker-dob">Date of birth</FieldLabel>
      <Popover open={open()} onOpenChange={setOpen} placement="bottom-start">
        <PopoverTrigger
          as={Button<"button">}
          variant="outline"
          id="date-picker-dob"
          class="justify-start font-normal"
        >
          <Show when={date()} fallback="Select date">
            {(value) => value().toLocaleDateString()}
          </Show>
        </PopoverTrigger>
        <PopoverContent class="w-auto overflow-hidden p-0">
          <Calendar
            mode="single"
            value={date()}
            initialMonth={date() ?? undefined}
            captionLayout="dropdown"
            onValueChange={(value) => {
              setDate(value);
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
    </Field>
  );
}
```

- [ ] **Step 5: Rewrite `date-picker-input.tsx`**

```tsx
import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";
import { Calendar } from "~/registry/ui/calendar.tsx";
import { Field, FieldLabel } from "~/registry/ui/field.tsx";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "~/registry/ui/input-group.tsx";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/registry/ui/popover.tsx";

import { createSignal } from "solid-js";

const formatDate = (date: Date | null) =>
  date
    ? date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
    : "";

const isValidDate = (date: Date) => !Number.isNaN(date.getTime());

export default function DatePickerInput() {
  const initial = new Date(2025, 5, 1);
  const [open, setOpen] = createSignal(false);
  const [date, setDate] = createSignal<Date | null>(initial);
  const [month, setMonth] = createSignal(initial);
  const [value, setValue] = createSignal(formatDate(initial));

  return (
    <Field class="mx-auto w-48">
      <FieldLabel for="date-picker-input">Subscription Date</FieldLabel>
      <InputGroup>
        <InputGroupInput
          id="date-picker-input"
          value={value()}
          placeholder="June 01, 2025"
          onInput={(event) => {
            const next = new Date(event.currentTarget.value);
            setValue(event.currentTarget.value);
            if (isValidDate(next)) {
              setDate(next);
              setMonth(next);
            }
          }}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown") {
              event.preventDefault();
              setOpen(true);
            }
          }}
        />
        <InputGroupAddon align="inline-end">
          <Popover open={open()} onOpenChange={setOpen} placement="bottom-end">
            <PopoverTrigger
              as={InputGroupButton<"button">}
              variant="ghost"
              size="icon-xs"
              aria-label="Select date"
            >
              <IconPlaceholder
                lucide="calendar"
                tabler="calendar"
                ph="calendar-blank"
                ri="calendar-line"
                hugeicons="calendar-03"
              />
            </PopoverTrigger>
            <PopoverContent class="w-auto overflow-hidden p-0">
              <Calendar
                mode="single"
                value={date()}
                month={month()}
                onMonthChange={setMonth}
                onValueChange={(next) => {
                  setDate(next);
                  setValue(formatDate(next));
                  setOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  );
}
```

- [ ] **Step 6: Rewrite `date-picker-natural-language.tsx`**

```tsx
import { parseDate } from "chrono-node";
import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";
import { Calendar } from "~/registry/ui/calendar.tsx";
import { Field, FieldLabel } from "~/registry/ui/field.tsx";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "~/registry/ui/input-group.tsx";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/registry/ui/popover.tsx";

import { createSignal } from "solid-js";

const formatDate = (date: Date | null) =>
  date
    ? date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
    : "";

export default function DatePickerNaturalLanguage() {
  const [open, setOpen] = createSignal(false);
  const initial = parseDate("In 2 days");
  const [value, setValue] = createSignal("In 2 days");
  const [date, setDate] = createSignal<Date | null>(initial);
  const [month, setMonth] = createSignal(initial ?? new Date());

  return (
    <Field class="mx-auto max-w-xs">
      <FieldLabel for="date-picker-natural-language">Schedule Date</FieldLabel>
      <InputGroup>
        <InputGroupInput
          id="date-picker-natural-language"
          value={value()}
          placeholder="Tomorrow or next week"
          onInput={(event) => {
            setValue(event.currentTarget.value);
            const parsed = parseDate(event.currentTarget.value);
            if (parsed) {
              setDate(parsed);
              setMonth(parsed);
            }
          }}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown") {
              event.preventDefault();
              setOpen(true);
            }
          }}
        />
        <InputGroupAddon align="inline-end">
          <Popover open={open()} onOpenChange={setOpen} placement="bottom-end">
            <PopoverTrigger
              as={InputGroupButton<"button">}
              variant="ghost"
              size="icon-xs"
              aria-label="Select date"
            >
              <IconPlaceholder
                lucide="calendar"
                tabler="calendar"
                ph="calendar-blank"
                ri="calendar-line"
                hugeicons="calendar-03"
              />
            </PopoverTrigger>
            <PopoverContent class="w-auto overflow-hidden p-0">
              <Calendar
                mode="single"
                value={date()}
                month={month()}
                onMonthChange={setMonth}
                captionLayout="dropdown"
                onValueChange={(next) => {
                  setDate(next);
                  setValue(formatDate(next));
                  if (next) setMonth(next);
                  setOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>
        </InputGroupAddon>
      </InputGroup>
      <p class="px-1 text-muted-foreground text-sm">
        Your post will be published on{" "}
        <span class="font-medium">{formatDate(date())}</span>.
      </p>
    </Field>
  );
}
```

- [ ] **Step 7: Rewrite `date-picker-time.tsx`**

```tsx
import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";
import { Button } from "~/registry/ui/button.tsx";
import { Calendar } from "~/registry/ui/calendar.tsx";
import { Field, FieldGroup, FieldLabel } from "~/registry/ui/field.tsx";
import { Input } from "~/registry/ui/input.tsx";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/registry/ui/popover.tsx";

import { createSignal, Show } from "solid-js";

const formatDate = (date: Date) =>
  date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

export default function DatePickerTime() {
  const [open, setOpen] = createSignal(false);
  const [date, setDate] = createSignal<Date | null>(null);

  return (
    <FieldGroup class="mx-auto max-w-xs flex-row">
      <Field>
        <FieldLabel for="date-picker-time-date">Date</FieldLabel>
        <Popover open={open()} onOpenChange={setOpen} placement="bottom-start">
          <PopoverTrigger
            as={Button<"button">}
            variant="outline"
            id="date-picker-time-date"
            class="w-32 justify-between font-normal"
          >
            <Show when={date()} fallback="Select date">
              {(value) => formatDate(value())}
            </Show>
            <IconPlaceholder
              lucide="chevron-down"
              tabler="chevron-down"
              ph="caret-down"
              ri="arrow-down-s-line"
              hugeicons="arrow-down-01"
            />
          </PopoverTrigger>
          <PopoverContent class="w-auto overflow-hidden p-0">
            <Calendar
              mode="single"
              value={date()}
              captionLayout="dropdown"
              initialMonth={date() ?? undefined}
              onValueChange={(value) => {
                setDate(value);
                setOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </Field>
      <Field class="w-32">
        <FieldLabel for="date-picker-time-time">Time</FieldLabel>
        <Input
          type="time"
          id="date-picker-time-time"
          step="1"
          value="10:30:00"
          class="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
        />
      </Field>
    </FieldGroup>
  );
}
```

- [ ] **Step 8: Format, lint and type-check**

Run:
`cd apps/docs && deno fmt src/registry/example && deno lint --fix src/registry/example && deno check src/registry/example/date-picker-*.tsx`
Expected: no errors. The Tailwind lint plugin sorts class strings; accept its
rewrites.

- [ ] **Step 9: Verify no example still imports the old component**

Run: `grep -rn "ui/date-picker" apps/docs/src/registry/example` Expected: no
output.

- [ ] **Step 10: Commit**

```bash
git add apps/docs/src/registry/example
git commit -m "Compose the date picker examples from Popover and Calendar"
```

---

### Task 2: Rewrite the docs page and drop the inline example

**Files:**

- Modify: `apps/docs/src/routes/(app)/docs/components/date-picker.mdx`
- Delete: `apps/docs/src/registry/example/date-picker-inline.tsx`
- Modify: `apps/docs/src/registry/registry-examples.ts` (remove the
  `date-picker-inline` entry)

**Interfaces:**

- Consumes: the seven example names from Task 1.
- Produces: a docs page whose `ComponentPreview` names are exactly those seven.

- [ ] **Step 1: Delete the inline example and its registry entry**

```bash
git rm apps/docs/src/registry/example/date-picker-inline.tsx
```

Then remove this block from `apps/docs/src/registry/registry-examples.ts`:

```ts
{
  name: "date-picker-inline",
  type: "example",
  files: [
    {
      path: "example/date-picker-inline.tsx",
      type: "example",
    },
  ],
},
```

- [ ] **Step 2: Replace the page body**

Write `apps/docs/src/routes/(app)/docs/components/date-picker.mdx`:

````mdx
---
title: Date Picker
description: A date picker component with range and presets.
---

<ComponentPreview name="date-picker-demo" />

## About

A date picker is a composition of the [Popover](/docs/components/popover) and
[Calendar](/docs/components/calendar) components. There is no `DatePicker`
component to install: you build the picker you need from those two.

## Installation

See the installation instructions for the
[Popover](/docs/components/popover#installation) and
[Calendar](/docs/components/calendar#installation) components.

## Usage

```tsx showLineNumbers
import { Button } from "~/components/ui/button"
import { Calendar } from "~/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover"
````

```tsx showLineNumbers
const [date, setDate] = createSignal<Date | null>(null);

return (
  <Popover placement="bottom-start">
    <PopoverTrigger as={Button<"button">} variant="outline">
      {date() ? date()!.toLocaleDateString() : "Pick a date"}
    </PopoverTrigger>
    <PopoverContent class="w-auto p-0">
      <Calendar mode="single" value={date()} onValueChange={setDate} />
    </PopoverContent>
  </Popover>
);
```

## Composition

A date picker is built from `Popover` and `Calendar`:

```text
Popover
├── PopoverTrigger
└── PopoverContent
    └── Calendar
```

The trigger is whatever you want the field to look like — a `Button`, or an
`InputGroup` with a button in its addon when the date can also be typed.

## Basic

A basic date picker component.

<ComponentPreview name="date-picker-basic" />

## Range Picker

A date picker component for selecting a range of dates. Set `mode="range"` and
`numberOfMonths` to show more than one month.

<ComponentPreview name="date-picker-range" previewClassName="h-[30rem] md:h-96" />

## Date of Birth

A date picker component for selecting a date of birth. This component uses the
`captionLayout="dropdown"` prop for month and year selection, and closes the
popover once a day is picked.

<ComponentPreview name="date-picker-dob" previewClassName="h-96" />

## Input

A date picker component with an input field for selecting a date. The input
parses what is typed, and `ArrowDown` opens the calendar.

<ComponentPreview name="date-picker-input" previewClassName="h-[30rem]" />

## Time Picker

A date picker component with a time input field for selecting a time.

<ComponentPreview name="date-picker-time" previewClassName="h-96" />

## Natural Language Picker

This component uses the `chrono-node` library to parse natural language dates.

<ComponentPreview name="date-picker-natural-language" previewClassName="h-[30rem]" />

## API Reference

See the [Calendar](/docs/components/calendar#api-reference) and
[Popover](/docs/components/popover) pages for the props of the two components a
date picker is built from.

````
- [ ] **Step 3: Check the house rules**

Run: `grep -rn "upstream\|shadcn/ui\|Ark UI" "apps/docs/src/routes/(app)/docs/components/date-picker.mdx"`
Expected: no output.

- [ ] **Step 4: Commit**

```bash
git add -A apps/docs/src/routes apps/docs/src/registry
git commit -m "Teach the date picker as a Popover and Calendar composition"
````

---

### Task 3: Delete the component, the dependency and its style markers

**Files:**

- Delete: `apps/docs/src/registry/ui/date-picker.tsx`
- Modify: `apps/docs/src/registry/registry-ui.ts` (remove the `date-picker`
  item)
- Modify: `apps/docs/deno.json` (remove `@ark-ui/solid`)
- Modify: all eight `apps/docs/src/registry/styles/style-*.css`
- Modify: `apps/docs/src/scripts/port-style.ts`

**Interfaces:**

- Consumes: nothing — every consumer was rewritten in Tasks 1 and 2.
- Produces: a registry with no `date-picker` ui item and no `cn-date-picker-*`
  marker.

- [ ] **Step 1: Confirm nothing imports the component any more**

Run: `grep -rn "ui/date-picker\|@ark-ui" apps/docs/src` Expected: only
`apps/docs/src/registry/registry-ui.ts` (the item being deleted).

- [ ] **Step 2: Delete the component and its registry entry**

```bash
git rm apps/docs/src/registry/ui/date-picker.tsx
```

Remove this block from `apps/docs/src/registry/registry-ui.ts`:

```ts
{
  name: "date-picker",
  type: "ui",
  dependencies: ["@ark-ui/solid"],
  files: [
    {
      path: "ui/date-picker.tsx",
      type: "ui",
    },
  ],
},
```

- [ ] **Step 3: Drop the dependency**

Remove the `"@ark-ui/solid": "npm:@ark-ui/solid@^5.38.0",` line from
`apps/docs/deno.json`, then run `deno install` from the repo root to refresh
`deno.lock`.

- [ ] **Step 4: Strip the eleven markers from all eight styles**

Each style declares exactly eleven `cn-date-picker-*` rules:
`cn-date-picker-content`, `-input`, `-next-trigger`, `-prev-trigger`,
`-range-text`, `-table-cell`, `-table-cell-trigger`, `-table-header`,
`-table-row`, `-trigger`, `-view`. They appear both as empty one-liners
(`.cn-date-picker-view {}`) and as `@apply` blocks. `style-nova.css`
additionally carries a `/* MARK: Date Picker */` comment that goes with them.

Run this from `apps/docs`:

```bash
python3 - <<'PY'
import re, glob
for path in sorted(glob.glob("src/registry/styles/style-*.css")):
    css = open(path).read()
    css = re.sub(r"[ \t]*/\* MARK: Date Picker \*/\n", "", css)
    css = re.sub(r"[ \t]*\.cn-date-picker-[a-z-]+ \{\}\n\n?", "", css)
    css = re.sub(r"[ \t]*\.cn-date-picker-[a-z-]+ \{\n.*?\n[ \t]*\}\n\n?", "", css, flags=re.S)
    open(path, "w").write(css)
PY
```

Then verify: `grep -rc "cn-date-picker" src/registry/styles/` — expected `0` for
all eight files.

- [ ] **Step 5: Remove the derivations from `port-style.ts`**

Delete these four entries from the `KOBALTE_ONLY` map in
`apps/docs/src/scripts/port-style.ts`, together with the comment above each:
`"cn-date-picker-trigger"`, `"cn-date-picker-input"`,
`"cn-date-picker-content"`, `"cn-date-picker-range-text"`.

In the same file's header comment, delete the trailing clause that reads
`, except \`cn-date-picker-content\` padding (nova was hand-tuned to p-3; the
derivation follows the style's own popover
padding)`so the sentence ends at`reproduces its values exactly.`

Also update the `KOBALTE_ONLY` doc comment: it opens by listing the surfaces the
markers cover — drop "an Ark UI date picker," from that list.

- [ ] **Step 6: Verify style coverage is clean**

Run: `cd apps/docs && deno run -A ./src/scripts/check-style-coverage.ts`
Expected: PASS for every style, with no `cn-date-picker-*` in any unused list.

- [ ] **Step 7: Format, lint, type-check**

Run: `cd apps/docs && deno fmt src && deno lint --fix src && deno check src`
Expected: no errors.

- [ ] **Step 8: Commit**

```bash
git add -A apps/docs deno.lock
git commit -m "Drop the Ark UI date picker component and its dependency"
```

---

### Task 4: Rebuild the registry and verify end to end

**Files:**

- Modify: `apps/docs/src/__registry__/index.tsx`, `apps/docs/public/r/**`,
  `apps/docs/public/registry/**` (all generated)

**Interfaces:**

- Consumes: the registry definitions from Tasks 1–3.
- Produces: generated registry output with no `date-picker` ui item.

- [ ] **Step 1: Rebuild**

Run: `deno task --cwd=apps/docs build:registry` Expected: it reports one fewer
ui item than before (59, down from 60).

- [ ] **Step 2: Verify the generated output**

```bash
test ! -f apps/docs/public/r/date-picker.json && echo "component item gone"
test -f apps/docs/public/r/date-picker-demo.json || echo "MISSING example item"
grep -rn "ark-ui" apps/docs/public/r/ | head
```

Expected: `component item gone`, no missing-example line, and no `ark-ui`
matches.

- [ ] **Step 3: Run the full check suite**

Run from the repo root:
`deno task check && deno task lint && deno fmt --check && deno task test`
Expected: all pass; the test count stays at 77.

- [ ] **Step 4: Verify the page in a browser**

Start the dev server (`deno task dev`, port 3228) and drive
`/docs/components/date-picker` with headless Chromium (`playwright-core` at
`/Users/ptzburn/.npm/_npx/705bc6b22212b352/node_modules/playwright-core`,
Chromium at
`~/Library/Caches/ms-playwright/chromium-1148/chrome-mac/Chromium.app/Contents/MacOS/Chromium`).
Wait for hydration by polling for `$$click` expandos rather than trusting
`networkidle`.

Assert, for each of the seven previews: it renders; for the four
button-triggered ones (`demo`, `basic`, `dob`, `time`) clicking the trigger
opens a `[role=dialog]` popover, clicking a day updates the trigger's label, and
for `dob`/`time` the popover then closes; for `input` and `natural-language`,
typing into the field moves the calendar's caption month. Console and page
errors must stay empty apart from the known `api.github.com` rate-limit noise.

- [ ] **Step 5: Commit the generated output**

```bash
git add apps/docs/src/__registry__ apps/docs/public
git commit -m "Rebuild the registry without the date picker component"
```

---

## Notes for the executor

- The four commits above can be squashed into one before pushing; the split
  exists so a reviewer can reject the removal without rejecting the examples.
- `add date-picker` stops resolving for consumers after Task 3. That is intended
  and must be stated in the final commit message.
- If `deno install` in Task 3 pulls anything beyond dropping `@ark-ui/solid`
  from the lock, stop and report it rather than committing the extra churn.

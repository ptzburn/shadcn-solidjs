import type { JSX } from "@solidjs/web";

import { IconPlaceholder } from "~/registry/icons/icon-placeholder.tsx";
import { Button } from "~/registry/ui/button.tsx";
import { Card, CardContent, CardHeader } from "~/registry/ui/card.tsx";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/registry/ui/collapsible.tsx";
import { Tabs, TabsList, TabsTrigger } from "~/registry/ui/tabs.tsx";
import { For } from "solid-js";

type FileTreeItem = { name: string } | { name: string; items: FileTreeItem[] };

export default function CollapsibleFileTree() {
  const fileTree: FileTreeItem[] = [
    {
      name: "components",
      items: [
        {
          name: "ui",
          items: [
            { name: "button.tsx" },
            { name: "card.tsx" },
            { name: "dialog.tsx" },
            { name: "input.tsx" },
            { name: "select.tsx" },
            { name: "table.tsx" },
          ],
        },
        { name: "login-form.tsx" },
        { name: "register-form.tsx" },
      ],
    },
    {
      name: "lib",
      items: [{ name: "utils.ts" }, { name: "cn.ts" }, { name: "api.ts" }],
    },
    {
      name: "hooks",
      items: [
        { name: "use-media-query.ts" },
        { name: "use-debounce.ts" },
        { name: "use-local-storage.ts" },
      ],
    },
    {
      name: "types",
      items: [{ name: "index.d.ts" }, { name: "api.d.ts" }],
    },
    {
      name: "public",
      items: [
        { name: "favicon.ico" },
        { name: "logo.svg" },
        { name: "images" },
      ],
    },
    { name: "app.tsx" },
    { name: "layout.tsx" },
    { name: "globals.css" },
    { name: "package.json" },
    { name: "tsconfig.json" },
    { name: "README.md" },
    { name: ".gitignore" },
  ];

  const renderItem = (fileItem: FileTreeItem): JSX.Element => {
    if ("items" in fileItem) {
      return (
        <Collapsible>
          <CollapsibleTrigger
            as={Button}
            variant="ghost"
            size="sm"
            class="group w-full justify-start transition-none hover:bg-accent hover:text-accent-foreground"
          >
            <IconPlaceholder
              lucide="chevron-right"
              tabler="chevron-right"
              ph="caret-right"
              ri="arrow-right-s-line"
              hugeicons="arrow-right-01"
              class="transition-transform group-data-expanded:rotate-90"
            />
            <IconPlaceholder
              lucide="folder"
              tabler="folder"
              ph="folder"
              ri="folder-line"
              hugeicons="folder-01"
            />
            {fileItem.name}
          </CollapsibleTrigger>
          <CollapsibleContent class="mt-1 ml-5">
            <div class="flex flex-col gap-1">
              <For each={fileItem.items}>{(child) => renderItem(child)}</For>
            </div>
          </CollapsibleContent>
        </Collapsible>
      );
    }
    return (
      <Button
        variant="link"
        size="sm"
        class="w-full justify-start gap-2 text-foreground"
      >
        <IconPlaceholder
          lucide="file"
          tabler="file"
          ph="file"
          ri="file-line"
          hugeicons="file-01"
        />
        <span>{fileItem.name}</span>
      </Button>
    );
  };

  return (
    <Card class="mx-auto w-full max-w-[16rem] gap-2" size="sm">
      <CardHeader>
        <Tabs defaultValue="explorer">
          <TabsList class="w-full">
            <TabsTrigger value="explorer">Explorer</TabsTrigger>
            <TabsTrigger value="settings">Outline</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <div class="flex flex-col gap-1">
          <For each={fileTree}>{(item) => renderItem(item)}</For>
        </div>
      </CardContent>
    </Card>
  );
}

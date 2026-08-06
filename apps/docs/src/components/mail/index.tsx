import { createSignal, type Signal } from "solid-js";

import { cookieStorage, makePersisted } from "@solid-primitives/storage";

import { cn } from "~/lib/utils.ts";
import {
  Resizable,
  ResizableHandle,
  ResizablePanel,
} from "~/registry/ui/resizable.tsx";
import { Separator } from "~/registry/ui/separator.tsx";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/registry/ui/tabs.tsx";
import { Input } from "~/registry/ui/input.tsx";

import {
  IconArchive,
  IconFile,
  IconInbox,
  IconMessages,
  IconSend,
  IconShoppingCart,
  IconTrash,
  IconUpdates,
  IconUsers,
} from "../icons.tsx";
import { AccountSwitcher } from "./account-switcher.tsx";
import { MailDisplay } from "./mail-display.tsx";
import { MailList } from "./mail-list.tsx";
import { Nav } from "./nav.tsx";

export function Mail() {
  const [sizes, setSizes] = makePersisted<
    number[],
    Signal<number[]>,
    { path: string }
  >(createSignal<number[]>([]), {
    name: "resizable-sizes",
    storage: cookieStorage,
    storageOptions: {
      path: "/",
    },
  });

  const [isCollapsed, setIsCollapsed] = createSignal(false);

  return (
    <Resizable sizes={sizes()} onSizesChange={setSizes}>
      <ResizablePanel
        initialSize={sizes()[0] ?? 0.2}
        minSize={0.1}
        maxSize={0.2}
        collapsible
        onCollapse={(e) => {
          setIsCollapsed(e === 0), console.log("collapse", e);
        }}
        onExpand={() => {
          setIsCollapsed(false), console.log("expand");
        }}
        class={cn(
          isCollapsed() &&
            "min-w-[50px] transition-all duration-300 ease-in-out",
        )}
      >
        <AccountSwitcher isCollapsed={isCollapsed()} />
        <Separator />
        <Nav
          isCollapsed={isCollapsed()}
          links={[
            {
              title: "Inbox",
              label: "128",
              icon: IconInbox,
              variant: "default",
            },
            {
              title: "Drafts",
              label: "9",
              icon: IconFile,
              variant: "ghost",
            },
            {
              title: "Sent",
              label: "",
              icon: IconSend,
              variant: "ghost",
            },
            {
              title: "Trash",
              label: "23",
              icon: IconTrash,
              variant: "ghost",
            },
            {
              title: "Archive",
              label: "",
              icon: IconArchive,
              variant: "ghost",
            },
          ]}
        />
        <Separator />
        <Nav
          isCollapsed={isCollapsed()}
          links={[
            {
              title: "Social",
              label: "972",
              icon: IconUsers,
              variant: "ghost",
            },
            {
              title: "Updates",
              label: "342",
              icon: IconUpdates,
              variant: "ghost",
            },
            {
              title: "Forums",
              label: "128",
              icon: IconMessages,
              variant: "ghost",
            },
            {
              title: "Shopping",
              label: "8",
              icon: IconShoppingCart,
              variant: "ghost",
            },
            {
              title: "Promotions",
              label: "21",
              icon: IconArchive,
              variant: "ghost",
            },
          ]}
        />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel initialSize={sizes()[1] ?? 0.4} minSize={0.3}>
        <Tabs defaultValue="all">
          <div class="flex items-center px-4 py-2">
            <h1 class="text-xl font-bold">Inbox</h1>
            <TabsList class="ml-auto">
              <TabsTrigger value="all" class="text-zinc-600 dark:text-zinc-200">
                All mail
              </TabsTrigger>
              <TabsTrigger
                value="unread"
                class="text-zinc-600 dark:text-zinc-200"
              >
                Unread
              </TabsTrigger>
            </TabsList>
          </div>
          <Separator />
          <div class="p-4">
            <div class="relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="absolute left-2 top-2.5 size-4 text-muted-foreground"
                viewBox="0 0 24 24"
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 10a7 7 0 1 0 14 0a7 7 0 1 0-14 0m18 11l-6-6"
                />
              </svg>
              <Input class="pl-8" placeholder="Search" type="text" />
            </div>
          </div>
          <TabsContent value="all" class="m-0">
            <MailList type="all" />
          </TabsContent>
          <TabsContent value="unread" class="m-0">
            <MailList type="unread" />
          </TabsContent>
        </Tabs>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel initialSize={sizes()[2] ?? 0.4} minSize={0.3}>
        <MailDisplay />
      </ResizablePanel>
    </Resizable>
  );
}

import { For, type JSX } from "solid-js";
import IconActivity01 from "~icons/hugeicons/activity-01";
import IconAnalytics01 from "~icons/hugeicons/analytics-01";
import IconAnalyticsUp from "~icons/hugeicons/analytics-up";
import IconArrowDataTransferHorizontal from "~icons/hugeicons/arrow-data-transfer-horizontal";
import IconBank from "~icons/hugeicons/bank";
import IconBookOpen02 from "~icons/hugeicons/book-open-02";
import IconCalendar03 from "~icons/hugeicons/calendar-03";
import IconChartBarLine from "~icons/hugeicons/chart-bar-line";
import IconCreditCard from "~icons/hugeicons/credit-card";
import IconFile02 from "~icons/hugeicons/file-02";
import IconGlobe02 from "~icons/hugeicons/globe-02";
import IconHelpCircle from "~icons/hugeicons/help-circle";
import IconMessage01 from "~icons/hugeicons/message-01";
import IconNotification03 from "~icons/hugeicons/notification-03";
import IconPaintBoard from "~icons/hugeicons/paint-board";
import IconPieChart from "~icons/hugeicons/pie-chart";
import IconShield01 from "~icons/hugeicons/shield-01";
import IconTarget02 from "~icons/hugeicons/target-02";
import IconUser from "~icons/hugeicons/user";
import IconWallet01 from "~icons/hugeicons/wallet-01";

import { cn } from "~/lib/utils.ts";
import { Card } from "~/registry/ui/card.tsx";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "~/registry/ui/sidebar.tsx";

type NavEntry = {
  label: string;
  icon: () => JSX.Element;
  isActive?: boolean;
};

type NavSection = {
  label: string;
  class: string;
  entries: NavEntry[];
};

const SECTIONS: NavSection[] = [
  {
    label: "Overview",
    class: "xl:col-start-1 xl:row-start-2",
    entries: [
      { label: "Analytics", icon: () => <IconAnalytics01 />, isActive: true },
      {
        label: "Transactions",
        icon: () => <IconArrowDataTransferHorizontal />,
      },
      { label: "Investments", icon: () => <IconAnalyticsUp /> },
      { label: "Accounts", icon: () => <IconBank /> },
      { label: "Spending", icon: () => <IconPieChart /> },
    ],
  },
  {
    label: "Planning",
    class: "xl:col-start-1 xl:row-start-1",
    entries: [
      { label: "Documents", icon: () => <IconFile02 /> },
      { label: "Budget", icon: () => <IconWallet01 /> },
      { label: "Reports", icon: () => <IconChartBarLine /> },
      { label: "Goals", icon: () => <IconTarget02 /> },
      { label: "Calendar", icon: () => <IconCalendar03 /> },
    ],
  },
  {
    label: "Support",
    class: "flex xl:col-start-2 xl:row-start-1",
    entries: [
      { label: "Help Center", icon: () => <IconHelpCircle /> },
      { label: "Docs", icon: () => <IconBookOpen02 /> },
      { label: "Contact Us", icon: () => <IconMessage01 /> },
      { label: "Status", icon: () => <IconActivity01 /> },
      { label: "Community", icon: () => <IconGlobe02 /> },
    ],
  },
  {
    label: "Account",
    class: "flex xl:col-start-2 xl:row-start-2",
    entries: [
      { label: "Profile", icon: () => <IconUser /> },
      { label: "Billing", icon: () => <IconCreditCard />, isActive: true },
      { label: "Notifications", icon: () => <IconNotification03 /> },
      { label: "Security", icon: () => <IconShield01 /> },
      { label: "Appearance", icon: () => <IconPaintBoard /> },
    ],
  },
];

function SidebarSection(props: { section: NavSection }) {
  return (
    <Card
      class={cn(
        "w-full overflow-hidden rounded-3xl py-0",
        props.section.class,
      )}
    >
      <SidebarProvider class="min-h-0">
        <Sidebar collapsible="none" class="w-full bg-transparent">
          <SidebarContent class="gap-0 overflow-hidden">
            <SidebarGroup>
              <SidebarGroupLabel>{props.section.label}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu class="gap-1">
                  <For each={props.section.entries}>
                    {(entry) => (
                      <SidebarMenuItem>
                        <SidebarMenuButton isActive={entry.isActive}>
                          {entry.icon()}
                          {entry.label}
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )}
                  </For>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
    </Card>
  );
}

export function SidebarNav() {
  return (
    <div class="grid w-full grid-cols-2 gap-4 xl:gap-6">
      <For each={SECTIONS}>
        {(section) => <SidebarSection section={section} />}
      </For>
    </div>
  );
}

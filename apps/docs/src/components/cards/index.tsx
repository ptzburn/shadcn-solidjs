import MessageScrollerDemo from "~/registry/example/message-scroller-demo.tsx";

import { AccountAccess } from "./account-access.tsx";
import { AnalyticsCard } from "./analytics-card.tsx";
import { ClaimableBalance } from "./claimable-balance.tsx";
import { ContributionHistory } from "./contribution-history.tsx";
import { DividendIncome } from "./dividend-income.tsx";
import { EmptyDistributeTrack } from "./empty-distribute-track.tsx";
import { NewMilestone } from "./new-milestone.tsx";
import { NotificationSettings } from "./notification-settings.tsx";
import { Payments } from "./payments.tsx";
import { PayoutThreshold } from "./payout-threshold.tsx";
import { PowerUsage } from "./power-usage.tsx";
import { QrConnect } from "./qr-connect.tsx";
import { SavingsTargets } from "./savings-targets.tsx";
import { SidebarNav } from "./sidebar-nav.tsx";
import { AccountAccess as SkeletonAccountAccess } from "./skeleton/account-access.tsx";
import { AnalyticsCard as SkeletonAnalyticsCard } from "./skeleton/analytics-card.tsx";
import { ClaimableBalance as SkeletonClaimableBalance } from "./skeleton/claimable-balance.tsx";
import { ContributionHistory as SkeletonContributionHistory } from "./skeleton/contribution-history.tsx";
import { DividendIncome as SkeletonDividendIncome } from "./skeleton/dividend-income.tsx";
import { EmptyDistributeTrack as SkeletonEmptyDistributeTrack } from "./skeleton/empty-distribute-track.tsx";
import { NewMilestone as SkeletonNewMilestone } from "./skeleton/new-milestone.tsx";
import { NotificationSettings as SkeletonNotificationSettings } from "./skeleton/notification-settings.tsx";
import { Payments as SkeletonPayments } from "./skeleton/payments.tsx";
import { PayoutThreshold as SkeletonPayoutThreshold } from "./skeleton/payout-threshold.tsx";
import { PowerUsage as SkeletonPowerUsage } from "./skeleton/power-usage.tsx";
import { QrConnect as SkeletonQrConnect } from "./skeleton/qr-connect.tsx";
import { SavingsTargets as SkeletonSavingsTargets } from "./skeleton/savings-targets.tsx";
import { TransferFunds as SkeletonTransferFunds } from "./skeleton/transfer-funds.tsx";
import { UIElements as SkeletonUIElements } from "./skeleton/ui-elements.tsx";
import { UIElements } from "./ui-elements.tsx";

function CardsSkeletonRails() {
  return (
    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-x-0 top-12 z-10 hidden min-[2200px]:block [&_[data-slot=skeleton]:nth-child(even)]:hidden"
    >
      <div class="absolute top-0 left-[calc(50%-950px-var(--rail-width)-var(--gap))] grid w-(--rail-width) grid-cols-[repeat(2,var(--rail-column))] gap-(--gap) opacity-50 [--rail-column:20rem] [--rail-width:calc(var(--rail-column)*2+var(--gap))]">
        <div class="flex flex-col gap-(--gap)">
          <SkeletonContributionHistory />
          <SkeletonClaimableBalance />
          <SkeletonDividendIncome />
          <SkeletonPayoutThreshold />
        </div>
        <div class="flex flex-col gap-(--gap)">
          <SkeletonUIElements />
          <SkeletonSavingsTargets />
          <SkeletonNewMilestone />
          <SkeletonPayoutThreshold />
          <SkeletonAccountAccess />
        </div>
      </div>
      <div class="absolute top-0 right-[calc(50%-950px-var(--rail-width)-var(--gap))] grid w-(--rail-width) grid-cols-[repeat(2,var(--rail-column))] gap-(--gap) opacity-50 [--rail-column:20rem] [--rail-width:calc(var(--rail-column)*2+var(--gap))]">
        <div class="flex flex-col gap-(--gap)">
          <SkeletonNewMilestone />
          <SkeletonPayoutThreshold />
          <SkeletonAccountAccess />
          <SkeletonQrConnect />
          <SkeletonTransferFunds />
          <SkeletonPayments />
          <SkeletonEmptyDistributeTrack />
        </div>
        <div class="flex flex-col gap-(--gap)">
          <SkeletonQrConnect />
          <SkeletonTransferFunds />
          <SkeletonPayments />
          <SkeletonEmptyDistributeTrack />
          <SkeletonAnalyticsCard />
          <SkeletonNotificationSettings />
          <SkeletonPowerUsage />
        </div>
      </div>
    </div>
  );
}

// The `max-md:` sizing is ours: upstream swaps the whole grid for a static
// screenshot below md, so it never defines a phone layout for these.
export function CardsDemo() {
  return (
    <div
      data-slot="demo"
      class="theme-neutral relative flex w-full max-w-none flex-col gap-(--gap) overflow-hidden bg-muted p-12 pb-0! [--gap:--spacing(8)] 3xl:[--gap:--spacing(8)] max-md:p-4 max-md:[--gap:--spacing(4)] min-[1900px]:p-12 min-[1900px]:[--gap:--spacing(10)]! lg:p-6 lg:[--gap:--spacing(6)] dark:bg-background"
    >
      <CardsSkeletonRails />
      <div class="relative z-10 mx-auto grid gap-(--gap) **:data-[slot=card]:w-full min-[1400px]:grid-cols-4! min-[1900px]:grid-cols-5! md:max-w-3xl md:grid-cols-2 lg:max-w-none lg:grid-cols-3 xl:max-w-[1600px] 2xl:max-w-[1900px]">
        <div class="flex flex-col items-start gap-(--gap)">
          <UIElements />
          <SidebarNav />
          <SavingsTargets />
        </div>
        <div class="hidden flex-col gap-(--gap) lg:flex">
          <ContributionHistory />
          <ClaimableBalance />
          <DividendIncome />
        </div>
        <div class="hidden flex-col gap-(--gap) min-[1400px]:flex">
          <NewMilestone />
          <PayoutThreshold />
          <AccountAccess />
        </div>
        <div class="hidden flex-col gap-(--gap) md:flex">
          <QrConnect />
          <div class="**:[.text-center.text-xs]:hidden">
            <MessageScrollerDemo />
          </div>
          <Payments />
        </div>
        <div class="hidden flex-col gap-(--gap) min-[1900px]:flex">
          <EmptyDistributeTrack />
          <AnalyticsCard />
          <NotificationSettings />
          <PowerUsage />
        </div>
      </div>
      <div class="absolute inset-x-0 top-0 z-1 h-120 bg-linear-to-b from-background via-muted to-transparent dark:hidden" />
      <div class="absolute inset-x-0 bottom-0 z-20 h-48 bg-linear-to-t from-background via-muted/80 to-transparent lg:h-80 xl:h-64 dark:via-background/80" />
    </div>
  );
}

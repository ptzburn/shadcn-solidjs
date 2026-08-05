import { CookieSettings } from "./cookie-settings.tsx";
import { CreateAccount } from "./create-account.tsx";
import { Notifications } from "./notifications.tsx";
import { PaymentMethod } from "./payment-method.tsx";
import { ReportAnIssue } from "./report-an-issue.tsx";
import { ShareDocument } from "./share-document.tsx";
import { SolidUI } from "./solid-ui.tsx";
import { TeamMembers } from "./team-members.tsx";

export function Cards() {
  return (
    <>
      <div class="md:hidden">
        <img
          src="/examples/cards-light.png"
          width={1280}
          height={1214}
          alt="Cards"
          class="block dark:hidden"
        />
        <img
          src="/examples/cards-dark.png"
          width={1280}
          height={1214}
          alt="Cards"
          class="hidden dark:block"
        />
      </div>
      <div class="hidden items-start justify-center gap-6 rounded-lg p-8 md:grid lg:grid-cols-2 xl:grid-cols-3">
        <div class="col-span-2 grid items-start gap-6 lg:col-span-1">
          <CreateAccount />
          <PaymentMethod />
        </div>
        <div class="col-span-2 grid items-start gap-6 lg:col-span-1">
          <TeamMembers />
          <ShareDocument />
          <Notifications />
        </div>
        <div class="col-span-2 grid items-start gap-6 lg:col-span-2 lg:grid-cols-2 xl:col-span-1 xl:grid-cols-1">
          <ReportAnIssue />
          <SolidUI />
          <CookieSettings />
        </div>
      </div>
    </>
  );
}

import { Dashboard } from "~/components/dashboard/index.tsx";
import { MetaTags } from "~/components/meta-tags.tsx";

export default function DashboardRoute() {
  return (
    <>
      <MetaTags
        title="Dashboard"
        description="Example dashboard app built using the components."
      />
      <Dashboard />
    </>
  );
}

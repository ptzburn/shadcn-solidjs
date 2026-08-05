import { Authentication } from "~/components/authentication/index.tsx";
import { MetaTags } from "~/components/meta-tags.tsx";

export default function AuthenticationRoute() {
  return (
    <>
      <MetaTags
        title="Authentication"
        description="Authentication forms built using the components."
      />
      <Authentication />
    </>
  );
}

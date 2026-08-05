import { Mail } from "~/components/mail/index.tsx";
import { MetaTags } from "~/components/meta-tags.tsx";

export default function CardsRoute() {
  return (
    <>
      <MetaTags
        title="Mail"
        description="Examples of a mailing app built using the components."
      />
      <Mail />
    </>
  );
}

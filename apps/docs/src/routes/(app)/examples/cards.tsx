import { Cards } from "~/components/cards/index.tsx";
import { MetaTags } from "~/components/meta-tags.tsx";

export default function CardsRoute() {
  return (
    <>
      <MetaTags
        title="Cards"
        description="Examples of cards built using the components."
      />
      <Cards />
    </>
  );
}

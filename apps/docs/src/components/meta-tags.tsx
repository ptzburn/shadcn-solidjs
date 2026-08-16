import { Link, Meta, Title } from "@solidjs/meta";
import { merge } from "solid-js";

const BASE_URL = "https://shadcn-solidjs.com";

export interface HeadProps {
  title?: string;
  description?: string;
}

// Charset and viewport live statically in Document.tsx: with ssr off,
// managed meta applies only after the client bundle runs, too late for
// the viewport. Main's raw lowercase icon tags become managed Link/Meta
// here so they land in the head instead of the mount point.
export function MetaTags(rawProps: HeadProps) {
  const props = merge(
    {
      title: "shadcn-solidjs",
      description:
        "Beautifully designed components built with Kobalte and Tailwind CSS.",
    },
    rawProps,
  );
  return (
    <>
      <Title>{props.title}</Title>

      <Meta name="title" content={props.title} />
      <Meta name="description" content={props.description} />
      <Meta
        name="keywords"
        content="shadcn,Solid,SolidJS,SolidStart,UI,Components,TailwindCSS,Kobalte"
      />
      <Meta name="author" content="ptzburn" />

      <Meta name="twitter:card" content="summary_large_image" />
      <Meta name="twitter:site" content={BASE_URL} />
      <Meta name="twitter:title" content={props.title} />
      <Meta name="twitter:description" content={props.description} />
      <Meta name="twitter:image" content={`${BASE_URL}/og.png`} />
      <Meta name="twitter:image:alt" content={props.title} />

      <Meta name="og:title" content={props.title} />
      <Meta name="og:type" content="article" />
      <Meta name="og:url" content={BASE_URL} />
      <Meta name="og:image" content={`${BASE_URL}/og.png`} />
      <Meta name="og:image:alt" content={props.title} />
      <Meta name="og:image:width" content="1200" />
      <Meta name="og:image:height" content="630" />

      <Link rel="canonical" href={BASE_URL} />
      <Link rel="manifest" href={`${BASE_URL}/site.webmanifest`} />
      <Link
        rel="icon"
        type="image/png"
        href="/favicon-96x96.png"
        sizes="96x96"
      />
      <Link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <Link rel="shortcut icon" href="/favicon.ico" />
      <Link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      <Meta name="apple-mobile-web-app-title" content={props.title} />
    </>
  );
}

import { HydrationScript, type JSX } from "@solidjs/web";

export default function Document(props: { children: JSX.Element }) {
  return (
    <html lang="en">
      <head>
        {
          /* Static rather than @solidjs/meta: with ssr off, managed meta
            applies only after the client bundle runs, and the viewport must
            be right from the first paint or mobile renders a zoomed-out
            desktop layout. */
        }
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <HydrationScript />
      </head>
      <body>
        {props.children}
      </body>
    </html>
  );
}

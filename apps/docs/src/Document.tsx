import { HydrationScript, type JSX } from "@solidjs/web";

export default function Document(props: { children: JSX.Element }) {
  return (
    <html lang="en">
      <head>
        <HydrationScript />
      </head>
      <body>
        {props.children}
      </body>
    </html>
  );
}

// The `~icons/…` virtual modules unplugin-icons serves. The declaration the
// plugin ships for Solid imports its types from `solid-js`, where Solid 2.0
// moved them to `@solidjs/web`, so the docs declare the module themselves,
// as the installation guide tells consumers to.
declare module "~icons/*" {
  import type { ComponentProps, JSX } from "@solidjs/web";

  const component: (props: ComponentProps<"svg">) => JSX.Element;
  export default component;
}

import { assertEquals } from "@std/assert";
import { orderDocPages } from "./llms.ts";

Deno.test("orders pages as the llms index lists them, then the rest alphabetically", () => {
  const index = `# Site

- [Intro](https://v2.shadcn-solidjs.com/docs/introduction.md): Core ideas.
- [Button](https://v2.shadcn-solidjs.com/docs/components/button.md)
- [Full](https://v2.shadcn-solidjs.com/llms-full.txt)
`;
  const pages = [
    "/docs/components/button",
    "/docs/components/alert",
    "/docs/introduction",
    "/docs/cli",
  ];
  assertEquals(orderDocPages(index, pages), [
    "/docs/introduction",
    "/docs/components/button",
    "/docs/cli",
    "/docs/components/alert",
  ]);
});

import { expect, test } from "vite-plus/test";
import { orderDocPages } from "./llms.ts";

test("orders pages as the llms index lists them, then the rest alphabetically", () => {
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
  expect(orderDocPages(index, pages)).toEqual([
    "/docs/introduction",
    "/docs/components/button",
    "/docs/cli",
    "/docs/components/alert",
  ]);
});

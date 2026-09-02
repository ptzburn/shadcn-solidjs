import type { Registry } from "~/registry/schema.ts";

/**
 * Shared code that ui items import but do not carry: the `cn` helper behind
 * every `~/lib/utils.ts` import, and the hooks behind `~/lib/hooks/*`.
 */
export const lib: Registry = [
  {
    name: "utils",
    type: "lib",
    dependencies: ["clsx", "tailwind-merge"],
    files: [
      {
        path: "lib/utils.ts",
        type: "lib",
      },
    ],
  },
  {
    name: "use-media-query",
    type: "hook",
    files: [
      {
        path: "hook/use-media-query.ts",
        type: "hook",
      },
    ],
  },
];

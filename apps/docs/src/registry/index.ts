import { blocks } from "~/registry/registry-blocks.ts";
import { examples } from "~/registry/registry-examples.ts";
import { themes } from "~/registry/registry-themes.ts";
import { ui } from "~/registry/registry-ui.ts";
import type { RegistryInput } from "~/registry/schema.ts";

export const registry: RegistryInput = [
  ...ui,
  ...examples,
  ...blocks,
  ...themes,
];

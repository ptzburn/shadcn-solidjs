import { blocks } from "~/registry/registry-blocks.ts";
import { examples } from "~/registry/registry-examples.ts";
import { lib } from "~/registry/registry-lib.ts";
import { themes } from "~/registry/registry-themes.ts";
import { ui } from "~/registry/registry-ui.ts";
import type { RegistryInput } from "~/registry/schema.ts";

export const registry: RegistryInput = [
  ...ui,
  ...lib,
  ...examples,
  ...blocks,
  ...themes,
];

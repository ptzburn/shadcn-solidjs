import { blocks } from "~/registry/registry-blocks.ts";
import { examples } from "~/registry/registry-examples.ts";
import { ui } from "~/registry/registry-ui.ts";
import type { Registry } from "~/registry/schema.ts";

export const registry: Registry = [...ui, ...examples, ...blocks];

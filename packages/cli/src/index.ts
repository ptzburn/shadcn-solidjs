#!/usr/bin/env node
/**
 * The shadcn-solidjs CLI. `init` configures a SolidJS project for the registry
 * — `components.json`, the stylesheet tokens and the `cn` util — and `add`
 * copies components and their dependencies into it.
 *
 * Importing this module runs the CLI against `process.argv`, so run it rather
 * than import it:
 *
 * ```sh
 * npx @ptzburn/shadcn-solidjs@beta init
 * npx @ptzburn/shadcn-solidjs@beta add button card dialog
 * ```
 *
 * The shebang above is kept by tsdown in the published bin, and lets the
 * source run directly with `node src/index.ts` during development.
 *
 * @module
 */
import process from "node:process";

import { Command } from "commander";

import { add } from "./commands/add.ts";
import { init } from "./commands/init.ts";
import { VERSION } from "./version.ts";

process.on("SIGINT", () => process.exit(0));
process.on("SIGTERM", () => process.exit(0));

const program = new Command()
  .name("shadcn-solidjs")
  .description("add SolidJS components to your project")
  .version(VERSION, "-v, --version", "display the version number");

program.addCommand(init).addCommand(add);

program.parse();

#!/usr/bin/env node
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

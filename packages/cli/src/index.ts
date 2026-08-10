// No shebang here on purpose: dnt writes one into the npm bin, and a second
// copy in the source lands below it and parses as code. Deno does not need it.
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

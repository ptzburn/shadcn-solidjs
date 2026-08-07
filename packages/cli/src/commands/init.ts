import { Command } from "commander";

import { notImplemented } from "../utils/not-implemented.ts";

export const init = new Command()
  .name("init")
  .description("initialize your project and install dependencies")
  .option(
    "-c, --cwd <cwd>",
    "the working directory. defaults to the current directory.",
  )
  .option("-y, --yes", "skip confirmation prompt.", false)
  .option("-d, --defaults", "use default configuration.", false)
  .option("-f, --force", "force overwrite of existing configuration.", false)
  .option("-s, --silent", "mute output.", false)
  .option("-b, --base-color <color>", "the base color to use.")
  .option("--css-variables", "use css variables for theming.", true)
  .option("--no-css-variables", "use utility classes for theming.")
  .action(() => {
    notImplemented("init");
  });

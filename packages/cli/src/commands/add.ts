import { Command } from "commander";

import { notImplemented } from "../utils/not-implemented.ts";

export const add = new Command()
  .name("add")
  .description("add a component to your project")
  .argument(
    "[components...]",
    "the components to add, or a url to the component.",
  )
  .option(
    "-c, --cwd <cwd>",
    "the working directory. defaults to the current directory.",
  )
  .option("-y, --yes", "skip confirmation prompt.", false)
  .option("-o, --overwrite", "overwrite existing files.", false)
  .option("-a, --all", "add all available components.", false)
  .option("-p, --path <path>", "the path to add the component to.")
  .option("-s, --silent", "mute output.", false)
  .option("--dry-run", "preview the changes without writing files.", false)
  .action(() => {
    notImplemented("add");
  });

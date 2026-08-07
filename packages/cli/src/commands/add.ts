import path from "node:path";
import process from "node:process";

import { Command } from "commander";

import { getConfig, MissingConfigError } from "../config/get-config.ts";
import { detectProjectTarget } from "../runtime/detect.ts";
import { handleError } from "../utils/handle-error.ts";
import { logger, setSilent } from "../utils/logger.ts";
import {
  addComponents,
  type AddResult,
  listComponentNames,
} from "./add-components.ts";

interface AddCommandOptions {
  cwd?: string;
  overwrite: boolean;
  all: boolean;
  path?: string;
  silent: boolean;
  dryRun: boolean;
}

/** Paths read relative to the project being written to, not to this process. */
function report(result: AddResult, projectCwd: string, dryRun: boolean): void {
  const verb = dryRun ? "Would write" : "Wrote";
  const show = (file: string) => path.relative(projectCwd, file);

  for (const file of result.files.created) {
    logger.success(`${verb} ${show(file)}`);
  }
  for (const file of result.files.overwritten) {
    logger.success(`${verb} ${show(file)} (overwritten)`);
  }
  for (const file of result.files.unchanged) {
    logger.info(`${show(file)} is already up to date`);
  }
  for (const file of result.files.skipped) {
    logger.warn(
      `${show(file)} exists and differs. Pass --overwrite to replace it.`,
    );
  }

  const installed = [
    ...result.dependencies.installed,
    ...result.dependencies.devInstalled,
  ];
  if (installed.length > 0) {
    logger.success(
      `${dryRun ? "Would install" : "Installed"} ${installed.join(", ")}`,
    );
  }
  if (result.dependencies.alreadyPresent.length > 0) {
    logger.info(
      `Left ${
        result.dependencies.alreadyPresent.join(", ")
      } at the version already declared`,
    );
  }

  if (result.pendingCss) {
    logger.warn(
      "This item carries CSS variables, which this version does not apply yet.",
    );
  }
}

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
  .action(async (components: string[], options: AddCommandOptions) => {
    try {
      setSilent(options.silent);
      const cwd = path.resolve(options.cwd ?? process.cwd());

      const config = await getConfig(cwd);
      if (!config) throw new MissingConfigError(cwd);

      const target = detectProjectTarget(cwd)!;

      const requested = options.all ? await listComponentNames() : components;
      if (requested.length === 0) {
        logger.error("Specify a component to add, or pass --all.");
        process.exit(1);
      }

      const result = await addComponents(requested, config, target, {
        overwrite: options.overwrite,
        path: options.path,
        silent: options.silent,
        dryRun: options.dryRun,
      });

      report(result, config.resolvedPaths.cwd, options.dryRun);
    } catch (error) {
      handleError(error);
    }
  });

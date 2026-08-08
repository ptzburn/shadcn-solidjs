import path from "node:path";
import process from "node:process";

import { Command } from "commander";
import prompts from "prompts";

import {
  DEFAULT_STYLE,
  ICON_LIBRARIES,
  ICON_LIBRARY_NAMES,
  isIconLibrary,
  isStyle,
  STYLE_NAMES,
  STYLES,
} from "../registry/constants.ts";
import { detectProjectTarget } from "../runtime/detect.ts";
import { handleError } from "../utils/handle-error.ts";
import { logger, setSilent } from "../utils/logger.ts";
import {
  DEFAULT_BASE_COLOR,
  InitError,
  initProject,
  type InitResult,
  listBaseColors,
} from "./init-project.ts";

interface InitCommandOptions {
  cwd?: string;
  yes: boolean;
  defaults: boolean;
  force: boolean;
  silent: boolean;
  baseColor?: string;
  style?: string;
  cssVariables: boolean;
}

const ICON_PLUGIN_SNIPPET = `import Icons from "unplugin-icons/vite";

export default defineConfig({
  plugins: [
    Icons({ compiler: "solid", autoInstall: true }),
  ],
});`;

function reportNextSteps(result: InitResult, cwd: string): void {
  logger.log();
  logger.success(
    `Wrote ${path.relative(cwd, result.configPath) || "components.json"}`,
  );
  logger.success(`Updated ${path.relative(cwd, result.cssPath)}`);

  if (result.nodeModulesDirWarning) {
    logger.log();
    logger.warn(result.nodeModulesDirWarning);
  }

  if (result.needsIconPlugin) {
    logger.log();
    logger.warn(
      result.viteConfigPath
        ? `Components use \`~icons/…\` imports. Register unplugin-icons in ${
          path.relative(cwd, result.viteConfigPath)
        }:`
        : "Components use `~icons/…` imports. Register unplugin-icons in your Vite config:",
    );
    logger.log();
    logger.log(ICON_PLUGIN_SNIPPET);
  }

  logger.log();
  logger.info(
    "Now run `shadcn-solidjs add button` to add your first component.",
  );
}

/** Interactive choices, skipped entirely under `--yes` or `--defaults`. */
async function promptForOptions(
  options: InitCommandOptions,
): Promise<{ baseColor: string; iconLibrary: string; style: string }> {
  if (options.yes || options.defaults) {
    return {
      baseColor: options.baseColor ?? DEFAULT_BASE_COLOR,
      iconLibrary: "lucide",
      style: options.style ?? DEFAULT_STYLE,
    };
  }

  const baseColors = await listBaseColors();
  const answers = await prompts(
    [
      {
        type: options.baseColor ? null : "select",
        name: "baseColor",
        message: "Which base color would you like to use?",
        choices: baseColors.map((name) => ({ title: name, value: name })),
        initial: Math.max(0, baseColors.indexOf(DEFAULT_BASE_COLOR)),
      },
      {
        type: "select",
        name: "iconLibrary",
        message: "Which icon library would you like to use?",
        choices: ICON_LIBRARY_NAMES.map((name) => ({
          title: ICON_LIBRARIES[name].title,
          value: name,
        })),
      },
      {
        type: options.style ? null : "select",
        name: "style",
        message: "Which style would you like to use?",
        choices: STYLE_NAMES.map((name) => ({
          title: STYLES[name].title,
          description: STYLES[name].description,
          value: name,
        })),
        initial: Math.max(0, STYLE_NAMES.indexOf(DEFAULT_STYLE)),
      },
    ],
    { onCancel: () => process.exit(1) },
  );

  return {
    baseColor: options.baseColor ?? answers.baseColor,
    iconLibrary: answers.iconLibrary,
    style: options.style ?? answers.style,
  };
}

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
  .option("--style <style>", "the style to use.")
  .option("--css-variables", "use css variables for theming.", true)
  .option("--no-css-variables", "use utility classes for theming.")
  .action(async (options: InitCommandOptions) => {
    try {
      setSilent(options.silent);
      const cwd = path.resolve(options.cwd ?? process.cwd());

      const target = detectProjectTarget(cwd);
      if (!target) {
        throw new InitError(
          `Could not find a deno.json or package.json above ${cwd}.`,
        );
      }

      if (options.baseColor && !options.baseColor.trim()) {
        throw new InitError("--base-color needs a value.");
      }

      if (options.style && !options.style.trim()) {
        throw new InitError("--style needs a value.");
      }

      const { baseColor, iconLibrary, style } = await promptForOptions(options);
      if (!isIconLibrary(iconLibrary)) {
        throw new InitError(
          `Unknown icon library "${iconLibrary}". Choose one of: ${
            ICON_LIBRARY_NAMES.join(", ")
          }.`,
        );
      }
      if (!isStyle(style)) {
        throw new InitError(
          `Unknown style "${style}". Choose one of: ${STYLE_NAMES.join(", ")}.`,
        );
      }

      const result = await initProject(cwd, target, {
        baseColor,
        iconLibrary,
        style,
        cssVariables: options.cssVariables,
        force: options.force,
        silent: options.silent,
      });

      reportNextSteps(result, cwd);
    } catch (error) {
      handleError(error);
    }
  });

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

import type { Config } from "../config/schema.ts";
import type { RegistryItemFile } from "../registry/schema.ts";
import type { ProjectTarget } from "../runtime/target.ts";
import { transformImports } from "../transformers/transform-import.ts";

export interface UpdateFilesOptions {
  overwrite?: boolean;
  /** Explicit destination from `--path`. */
  path?: string;
  /** Resolve and transform without touching disk. */
  dryRun?: boolean;
}

export interface UpdateFilesResult {
  created: string[];
  overwritten: string[];
  /** Already present and byte-identical. */
  unchanged: string[];
  /** Present, different, and left alone because `--overwrite` was absent. */
  skipped: string[];
}

export class UnsafeTargetError extends Error {
  constructor(readonly file: string, readonly resolved: string) {
    super(
      `Refusing to write "${file}": it resolves to ${resolved}, outside the project.`,
    );
    this.name = "UnsafeTargetError";
  }
}

export class MissingContentError extends Error {
  constructor(readonly file: string) {
    super(`The registry item file "${file}" carries no content.`);
    this.name = "MissingContentError";
  }
}

/** Registry paths are `src/registry/<type>/<rest>`; `<rest>` is what ships. */
function relativeTargetPath(file: RegistryItemFile): string {
  const match = file.path.match(/^src\/registry\/[^/]+\/(.+)$/);
  return match ? match[1] : file.path.slice(file.path.lastIndexOf("/") + 1);
}

function directoryForType(file: RegistryItemFile, config: Config): string {
  switch (file.type) {
    case "registry:lib":
      return config.resolvedPaths.lib;
    case "registry:hook":
      return config.resolvedPaths.hooks;
    case "registry:ui":
      return config.resolvedPaths.ui;
    case "registry:block":
    case "registry:component":
    case "registry:page":
      return config.resolvedPaths.components;
    default:
      return config.resolvedPaths.components;
  }
}

/**
 * A registry is remote input, so the destination is confirmed to sit inside
 * the project before anything is written.
 */
function assertWithin(resolved: string, root: string, file: string): string {
  const relative = path.relative(root, resolved);
  const escapes = !relative || relative === ".." ||
    relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative);
  if (escapes) throw new UnsafeTargetError(file, resolved);
  return resolved;
}

export function resolveFilePath(
  file: RegistryItemFile,
  config: Config,
  options: UpdateFilesOptions,
  index: number,
): string {
  const { cwd } = config.resolvedPaths;
  const relative = relativeTargetPath(file);

  if (options.path) {
    const looksLikeFile = /\.[^/\\]+$/.test(options.path);
    const destination = looksLikeFile && index === 0
      ? path.resolve(cwd, options.path)
      : path.resolve(cwd, options.path, relative);
    return assertWithin(destination, cwd, file.path);
  }

  if (file.target) {
    const target = file.target.startsWith("~/")
      ? path.resolve(cwd, file.target.slice(2))
      : path.resolve(cwd, file.target);
    return assertWithin(target, cwd, file.path);
  }

  return assertWithin(
    path.resolve(directoryForType(file, config), relative),
    cwd,
    file.path,
  );
}

export interface PlannedFile {
  file: RegistryItemFile;
  destination: string;
  content: string;
}

/** Resolves destinations and applies transformers without writing. */
export function planFiles(
  files: RegistryItemFile[],
  config: Config,
  target: ProjectTarget,
  options: UpdateFilesOptions = {},
): PlannedFile[] {
  return files.map((file, index) => {
    if (file.content === undefined) throw new MissingContentError(file.path);
    return {
      file,
      destination: resolveFilePath(file, config, options, index),
      content: transformImports(file.content, { config, target }),
    };
  });
}

export function updateFiles(
  files: RegistryItemFile[],
  config: Config,
  target: ProjectTarget,
  options: UpdateFilesOptions = {},
): UpdateFilesResult {
  const result: UpdateFilesResult = {
    created: [],
    overwritten: [],
    unchanged: [],
    skipped: [],
  };

  for (const planned of planFiles(files, config, target, options)) {
    const { destination, content } = planned;
    const exists = existsSync(destination);

    if (exists && readFileSync(destination, "utf8") === content) {
      result.unchanged.push(destination);
      continue;
    }

    if (exists && !options.overwrite) {
      result.skipped.push(destination);
      continue;
    }

    if (!options.dryRun) {
      mkdirSync(path.dirname(destination), { recursive: true });
      writeFileSync(destination, content, "utf8");
    }

    (exists ? result.overwritten : result.created).push(destination);
  }

  return result;
}

import { existsSync } from "node:fs";
import path from "node:path";

import {
  createPathsMatcher,
  getTsconfig,
  type TsConfigResult,
} from "get-tsconfig";

import { exec } from "./exec.ts";
import { detectPackageManager, installArgs } from "./package-manager.ts";
import {
  type AddDependenciesOptions,
  assertSafeSpecs,
  type ProjectTarget,
} from "./target.ts";

/** Targets whose `paths` entry marks the project-wide alias. */
const PROJECT_ROOT_TARGETS = ["./*", "./src/*", "./app/*", "./resources/js/*"];

export class NodeTarget implements ProjectTarget {
  readonly runtime = "node" as const;

  #tsconfig: TsConfigResult | null | undefined;

  constructor(readonly cwd: string, readonly configPath: string) {}

  static detect(cwd: string): NodeTarget | null {
    const configPath = path.join(path.resolve(cwd), "package.json");
    return existsSync(configPath)
      ? new NodeTarget(path.resolve(cwd), configPath)
      : null;
  }

  /** Resolved once; `getTsconfig` walks up and follows `extends` itself. */
  private tsconfig(): TsConfigResult | null {
    if (this.#tsconfig === undefined) {
      this.#tsconfig = getTsconfig(this.cwd) ??
        getTsconfig(this.cwd, "jsconfig.json");
    }
    return this.#tsconfig;
  }

  aliasPrefix(): Promise<string | null> {
    const paths = this.tsconfig()?.config.compilerOptions?.paths;
    if (!paths) return Promise.resolve(null);

    const entries = Object.entries(paths);
    const projectWide = entries.find(([, targets]) =>
      targets.some((target) => PROJECT_ROOT_TARGETS.includes(target))
    );

    const [key] = projectWide ?? entries[0] ?? [];
    return Promise.resolve(key ? key.replace(/\/\*$/, "") : null);
  }

  resolveImport(specifier: string): Promise<string | null> {
    const tsconfig = this.tsconfig();
    if (!tsconfig) return Promise.resolve(null);

    const matcher = createPathsMatcher(tsconfig);
    const candidates = matcher?.(specifier) ?? [];
    return Promise.resolve(candidates[0] ?? null);
  }

  async addDependencies(
    specs: string[],
    options: AddDependenciesOptions = {},
  ): Promise<void> {
    if (specs.length === 0) return;
    assertSafeSpecs(specs);

    const manager = detectPackageManager(this.cwd);
    await exec(
      manager,
      installArgs(manager, specs, options.dev ?? false),
      { cwd: this.cwd, silent: options.silent },
    );
  }

  /**
   * Registry sources carry Deno-mandatory extensions; Node and Vite projects
   * conventionally import without them.
   */
  importSpecifier(specifier: string): string {
    return specifier.replace(/\.tsx?$/, "");
  }
}

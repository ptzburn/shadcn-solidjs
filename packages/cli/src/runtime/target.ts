export type Runtime = "deno" | "node";

export interface AddDependenciesOptions {
  dev?: boolean;
  silent?: boolean;
}

/**
 * The one abstraction that keeps `init` and `add` free of runtime branching.
 *
 * A target describes the project being installed *into* — which is unrelated
 * to the runtime this CLI happens to be executing under. A CLI running on Node
 * installs into a Deno project perfectly well.
 */
export interface ProjectTarget {
  readonly runtime: Runtime;
  readonly cwd: string;
  /** The runtime's project config: deno.json(c) or package.json. */
  readonly configPath: string;

  /** The import alias prefix the project uses, e.g. `~` or `@`. */
  aliasPrefix(): Promise<string | null>;

  /** Maps an aliased import specifier to an absolute path, or null. */
  resolveImport(specifier: string): Promise<string | null>;

  addDependencies(
    specs: string[],
    options?: AddDependenciesOptions,
  ): Promise<void>;

  /**
   * Emits the specifier a component file should import by. Deno requires the
   * file extension; Node and Vite projects conventionally omit it.
   */
  importSpecifier(specifier: string): string;
}

export class UnsafeDependencyError extends Error {
  constructor(readonly spec: string) {
    super(
      `Refusing to install "${spec}": a dependency may not begin with "-".`,
    );
    this.name = "UnsafeDependencyError";
  }
}

/**
 * A registry is remote input, so a name that would be read as a flag by the
 * package manager is rejected before it reaches the process boundary.
 */
export function assertSafeSpecs(specs: string[]): void {
  for (const spec of specs) {
    if (spec.startsWith("-")) throw new UnsafeDependencyError(spec);
  }
}

/**
 * Longest-prefix match over an import map, the way both `deno.json` `imports`
 * and tsconfig `paths` behave: `~/` beats `~` for `~/lib/utils.ts`.
 */
export function matchLongestPrefix(
  specifier: string,
  entries: Iterable<[string, string]>,
): { key: string; value: string; rest: string } | null {
  let best: { key: string; value: string; rest: string } | null = null;

  for (const [key, value] of entries) {
    if (!specifier.startsWith(key)) continue;
    if (best && key.length <= best.key.length) continue;
    best = { key, value, rest: specifier.slice(key.length) };
  }

  return best;
}

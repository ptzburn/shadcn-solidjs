export interface AddDependenciesOptions {
  dev?: boolean;
  silent?: boolean;
}

/**
 * The seam that keeps `init` and `add` free of project-layout details: a
 * target describes the project being installed *into*.
 */
export interface ProjectTarget {
  readonly cwd: string;
  /** The project's package.json. */
  readonly configPath: string;

  /** The import alias prefix the project uses, e.g. `~` or `@`. */
  aliasPrefix(): Promise<string | null>;

  /** Maps an aliased import specifier to an absolute path, or null. */
  resolveImport(specifier: string): Promise<string | null>;

  /**
   * Package names the project already declares, so re-running `add` never
   * rewrites a range the consumer pinned deliberately.
   */
  existingDependencies(): Promise<Set<string>>;

  addDependencies(specs: string[], options?: AddDependenciesOptions): Promise<void>;

  /**
   * Emits the specifier a component file should import by. Registry sources
   * carry file extensions; Node and Vite projects conventionally omit them.
   */
  importSpecifier(specifier: string): string;
}

export class UnsafeDependencyError extends Error {
  readonly spec: string;

  constructor(spec: string) {
    super(`Refusing to install "${spec}": a dependency may not begin with "-".`);
    this.name = "UnsafeDependencyError";
    this.spec = spec;
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

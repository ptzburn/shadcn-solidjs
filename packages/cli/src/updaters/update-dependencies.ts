import type { ProjectTarget } from "../runtime/target.ts";

export interface UpdateDependenciesOptions {
  silent?: boolean;
  dryRun?: boolean;
}

export interface UpdateDependenciesResult {
  installed: string[];
  devInstalled: string[];
  /** Already declared, so left at whatever range the project pinned. */
  alreadyPresent: string[];
}

/** `@scope/pkg@1.2.3` carries a version; `@scope/pkg` does not. */
function hasVersion(spec: string): boolean {
  return (spec.startsWith("@") ? spec.slice(1) : spec).includes("@");
}

export function bareName(spec: string): string {
  if (!hasVersion(spec)) return spec;
  return spec.slice(0, spec.lastIndexOf("@"));
}

/**
 * Drops bare names the project already declares, so re-running `add` never
 * rewrites a range the consumer pinned. A spec that carries its own version
 * is always passed through, since it is asking for something specific.
 */
export function selectNewSpecs(
  specs: string[],
  existing: Set<string>,
): { install: string[]; present: string[] } {
  const install: string[] = [];
  const present: string[] = [];

  for (const spec of specs) {
    if (hasVersion(spec) || !existing.has(bareName(spec))) {
      install.push(spec);
    } else {
      present.push(spec);
    }
  }

  return { install, present };
}

export async function updateDependencies(
  dependencies: string[],
  devDependencies: string[],
  target: ProjectTarget,
  options: UpdateDependenciesOptions = {},
): Promise<UpdateDependenciesResult> {
  const existing = await target.existingDependencies();
  const deps = selectNewSpecs(dependencies, existing);
  const devDeps = selectNewSpecs(devDependencies, existing);

  if (!options.dryRun) {
    await target.addDependencies(deps.install, { silent: options.silent });
    await target.addDependencies(devDeps.install, {
      dev: true,
      silent: options.silent,
    });
  }

  return {
    installed: deps.install,
    devInstalled: devDeps.install,
    alreadyPresent: [...deps.present, ...devDeps.present],
  };
}

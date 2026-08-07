// `cn` is authored in the registry so consumers and the docs site share one
// definition; re-exported here to keep the `~/lib/utils.ts` import path that
// registry components use.
export { cn } from "~/registry/lib/utils.ts";

export function clamp(val: number, min: number, max: number) {
  return val > max ? max : val < min ? min : val;
}

export function toggleValue<T>(array: T[], value: T): T[] {
  return array.includes(value)
    ? array.filter((item) => item !== value)
    : [...array, value];
}

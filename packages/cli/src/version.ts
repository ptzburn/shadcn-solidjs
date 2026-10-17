/**
 * The published version, duplicated from `version` in package.json because
 * the bundled bin cannot read that file at runtime. `version.test.ts` asserts
 * the two stay in sync.
 */
export const VERSION = "0.2.0-beta.1";

/**
 * The npm dist-tag this version belongs under: prereleases go to `beta`.
 * `publishConfig.tag` in package.json is what npm actually uses, and the same
 * test asserts it agrees with this.
 */
export const DIST_TAG = VERSION.includes("-") ? "beta" : "latest";

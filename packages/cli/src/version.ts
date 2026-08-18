/**
 * The published version, duplicated from `version` in deno.json because a
 * bundled npm build cannot read that file at runtime. `version_test.ts`
 * asserts the two stay in sync.
 */
export const VERSION = "0.2.0-beta.0";

/** The npm dist-tag this version is published under: prereleases go to `beta`. */
export const DIST_TAG = VERSION.includes("-") ? "beta" : "latest";

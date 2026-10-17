// The docs app's `src/` directory as an absolute path, for the build-time
// modules that vite.config.ts loads (the MDX component plugin, the markdown
// export). They must not resolve from `process.cwd()`: the root `vp test`
// loads the same config from the workspace root. This lives in a `.ts` file
// on purpose: Vite replaces `import.meta.url` in a bundled config with the
// original file's location only for files matching its config extensions,
// and a `.tsx` module is left with a dangling reference.
export const srcDir = new URL("../", import.meta.url).pathname;

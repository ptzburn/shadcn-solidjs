// Resolves the two path aliases for the registry build scripts, which run on
// plain Node (type stripping is built in; the aliases are not). Node knows
// nothing of tsconfig `paths`, so this hook maps them the way vite.config.ts
// and tsconfig.json do: `~/` → `src/`, and the primitives package's
// subpath → its workspace source. Register it with
// `node --import ./scripts/lib/alias.mjs`.
import { registerHooks } from "node:module";

const SRC = new URL("../../src/", import.meta.url);
const MESSAGE_SCROLLER = new URL(
  "../../../../packages/solid/src/message-scroller/index.ts",
  import.meta.url,
);

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith("~/")) {
      return nextResolve(new URL(specifier.slice(2), SRC).href, context);
    }
    if (specifier === "@ptzburn/shadcn-solid/message-scroller") {
      return nextResolve(MESSAGE_SCROLLER.href, context);
    }
    return nextResolve(specifier, context);
  },
});

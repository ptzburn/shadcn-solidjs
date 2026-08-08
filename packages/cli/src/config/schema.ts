import { z } from "zod";

/** A registry URL template, or the same plus auth params/headers. */
export const registryConfigItemSchema = z.union([
  z.string().refine((s) => s.includes("{name}"), {
    message: "Registry URL must include {name} placeholder",
  }),
  z.object({
    url: z.string().refine((s) => s.includes("{name}"), {
      message: "Registry URL must include {name} placeholder",
    }),
    params: z.record(z.string(), z.string()).optional(),
    headers: z.record(z.string(), z.string()).optional(),
  }),
]);

export const registryConfigSchema = z.record(
  z.string().refine((key) => key.startsWith("@"), {
    message: "Registry names must start with @ (e.g. @acme)",
  }),
  registryConfigItemSchema,
);

/**
 * components.json.
 *
 * Diverges from upstream in three ways, each deliberate:
 *
 * - No `rsc`. Solid has no React Server Components.
 * - No `tailwind.config`. This registry is Tailwind v4 only, where upstream's
 *   own `updateTailwindConfig` returns immediately anyway.
 * - Not `.strict()`. Upstream rejects unknown keys, which means a
 *   components.json carried over from a React project fails outright rather
 *   than on the fields that actually matter. Unknown keys are stripped.
 *
 * `tsx` is retained for compatibility but only `true` is supported: emitting
 * JS would need the Babel downlevel pass this CLI does not port.
 */
export const rawConfigSchema = z.object({
  $schema: z.string().optional(),
  tsx: z.coerce.boolean().default(true),
  tailwind: z.object({
    css: z.string(),
    baseColor: z.string(),
    cssVariables: z.boolean().default(true),
    prefix: z.string().default("").optional(),
  }),
  iconLibrary: z.string().optional(),
  style: z.string().optional(),
  aliases: z.object({
    components: z.string(),
    utils: z.string(),
    ui: z.string().optional(),
    lib: z.string().optional(),
    hooks: z.string().optional(),
  }),
  registries: registryConfigSchema.optional(),
});

export const configSchema = rawConfigSchema.extend({
  resolvedPaths: z.object({
    cwd: z.string(),
    tailwindCss: z.string(),
    utils: z.string(),
    components: z.string(),
    lib: z.string(),
    hooks: z.string(),
    ui: z.string(),
  }),
});

export type RawConfig = z.infer<typeof rawConfigSchema>;
export type Config = z.infer<typeof configSchema>;
export type RegistryConfig = z.infer<typeof registryConfigSchema>;
export type RegistryConfigItem = z.infer<typeof registryConfigItemSchema>;

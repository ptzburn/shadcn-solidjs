import * as v from "valibot";

export const registryTypeSchema = v.picklist([
  "ui",
  "example",
  "block",
  "page",
  "component",
  "theme",
]);

export const registryFileSchema = v.object({
  path: v.string(),
  content: v.optional(v.string()),
  type: registryTypeSchema,
  target: v.optional(v.string()),
});

export const registryCssVarsSchema = v.object({
  theme: v.optional(v.record(v.string(), v.string())),
  light: v.optional(v.record(v.string(), v.string())),
  dark: v.optional(v.record(v.string(), v.string())),
});

export const registryItemSchema = v.object({
  name: v.string(),
  title: v.optional(v.string()),
  dependencies: v.optional(v.array(v.string())),
  registryDependencies: v.optional(v.array(v.string())),
  files: v.optional(v.array(registryFileSchema), []),
  type: registryTypeSchema,
  description: v.optional(v.string()),
  cssVars: v.optional(registryCssVarsSchema),
});

export const registryIndexSchema = v.record(
  v.string(),
  v.object({ ...registryItemSchema.entries, component: v.any() }),
);

export const registrySchema = v.array(registryItemSchema);

export type RegistryItem = v.InferOutput<typeof registryItemSchema>;
export type RegistryIndex = v.InferOutput<typeof registryIndexSchema>;
export type Registry = v.InferOutput<typeof registrySchema>;
/** Authoring type: `files` may be omitted (themes have none). */
export type RegistryInput = v.InferInput<typeof registrySchema>;

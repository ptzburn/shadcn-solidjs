import { z } from "zod";

export const registryTypeSchema = z.enum([
  "ui",
  "lib",
  "hook",
  "example",
  "block",
  "page",
  "component",
  "theme",
]);

export const registryFileSchema = z.object({
  path: z.string(),
  content: z.string().optional(),
  type: registryTypeSchema,
  target: z.string().optional(),
});

export const registryCssVarsSchema = z.object({
  theme: z.record(z.string(), z.string()).optional(),
  light: z.record(z.string(), z.string()).optional(),
  dark: z.record(z.string(), z.string()).optional(),
});

export const registryItemSchema = z.object({
  name: z.string(),
  title: z.string().optional(),
  dependencies: z.array(z.string()).optional(),
  registryDependencies: z.array(z.string()).optional(),
  files: z.array(registryFileSchema).default([]),
  type: registryTypeSchema,
  description: z.string().optional(),
  cssVars: registryCssVarsSchema.optional(),
});

export const registryIndexSchema = z.record(
  z.string(),
  registryItemSchema.extend({ component: z.any() }),
);

export const registrySchema = z.array(registryItemSchema);

export type RegistryItem = z.infer<typeof registryItemSchema>;
export type RegistryIndex = z.infer<typeof registryIndexSchema>;
export type Registry = z.infer<typeof registrySchema>;
/** Authoring type: `files` may be omitted (themes have none). */
export type RegistryInput = z.input<typeof registrySchema>;

import { z } from "zod";

/**
 * Item vocabulary kept bit-compatible with
 * https://ui.shadcn.com/schema/registry-item.json so third-party registries
 * interoperate, even though this registry only emits ui, lib, hook and theme.
 */
export const registryItemTypeSchema = z.enum([
  "registry:lib",
  "registry:block",
  "registry:component",
  "registry:ui",
  "registry:hook",
  "registry:page",
  "registry:file",
  "registry:theme",
  "registry:style",
  "registry:item",
  "registry:base",
  "registry:font",
  "registry:example",
  "registry:internal",
]);

export const registryItemFileSchema = z.object({
  path: z.string(),
  content: z.string().optional(),
  type: registryItemTypeSchema,
  target: z.string().optional(),
});

export const registryItemCssVarsSchema = z.object({
  theme: z.record(z.string(), z.string()).optional(),
  light: z.record(z.string(), z.string()).optional(),
  dark: z.record(z.string(), z.string()).optional(),
});

/** Arbitrarily nested CSS-in-JSON: at-rules, selectors, declarations. */
export type RegistryItemCss = {
  [key: string]: string | RegistryItemCss;
};

export const registryItemCssSchema: z.ZodType<RegistryItemCss> = z.lazy(() =>
  z.record(z.string(), z.union([z.string(), registryItemCssSchema]))
);

export const registryItemSchema = z.object({
  $schema: z.string().optional(),
  name: z.string(),
  type: registryItemTypeSchema,
  title: z.string().optional(),
  description: z.string().optional(),
  author: z.string().optional(),
  dependencies: z.array(z.string()).optional(),
  devDependencies: z.array(z.string()).optional(),
  registryDependencies: z.array(z.string()).optional(),
  files: z.array(registryItemFileSchema).optional(),
  cssVars: registryItemCssVarsSchema.optional(),
  css: registryItemCssSchema.optional(),
  docs: z.string().optional(),
  categories: z.array(z.string()).optional(),
  meta: z.record(z.string(), z.any()).optional(),
});

/** The `registry.json` / `index.json` shape: items with `files` stripped. */
export const registryIndexSchema = z.object({
  $schema: z.string().optional(),
  name: z.string(),
  homepage: z.string().optional(),
  items: z.array(registryItemSchema),
});

/**
 * The shape `resolveRegistryTree` collapses a set of items into: every file to
 * write, plus the union of everything those files need installed or patched.
 */
export const registryResolvedItemsTreeSchema = z.object({
  dependencies: z.array(z.string()),
  devDependencies: z.array(z.string()),
  files: z.array(registryItemFileSchema),
  cssVars: registryItemCssVarsSchema.optional(),
  css: registryItemCssSchema.optional(),
  docs: z.array(z.string()),
});

export type RegistryItem = z.infer<typeof registryItemSchema>;
export type RegistryItemFile = z.infer<typeof registryItemFileSchema>;
export type RegistryItemType = z.infer<typeof registryItemTypeSchema>;
export type RegistryItemCssVars = z.infer<typeof registryItemCssVarsSchema>;
export type RegistryIndex = z.infer<typeof registryIndexSchema>;
export type RegistryResolvedItemsTree = z.infer<
  typeof registryResolvedItemsTreeSchema
>;

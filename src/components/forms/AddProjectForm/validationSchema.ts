import { z } from "zod";

// Define the component schema
export const componentSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Component name is required"),
  description: z.string().optional(),
});

// Define the module schema
export const moduleSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Module name is required"),
  description: z.string().optional(),
  components: z
    .array(componentSchema)
    .min(1, "Each module must have 1 component at least")
    .default([]),
});

// Define the project schema
export const projectFormSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().optional(),
  modules: z
    .array(moduleSchema)
    .min(1, "Each project must have 1 module at least")
    .default([]),
});

export type ComponentData = z.infer<typeof componentSchema>;
export type ModuleData = z.infer<typeof moduleSchema>;
export type ProjectFormData = z.infer<typeof projectFormSchema>;

import { z } from "zod";

export const userFormSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z
    .string()
    .min(10, "Phone number is required")
    .regex(
      /^\+\d+$/,
      "Phone number must start with '+' followed by numbers only"
    ),
  role: z.enum(["user", "manager"], {
    errorMap: () => ({ message: "Please select a role" }),
  }),
  projects: z.array(z.string()),
});

export type UserFormData = z.infer<typeof userFormSchema>;

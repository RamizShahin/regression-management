import { z } from "zod";

export const personalInfoSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters"),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters"),
  email: z.string().email("Invalid email address"),
});

export const accountDetailsSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be less than 20 characters"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  role: z.enum(["admin", "manager", "user"], {
    errorMap: () => ({ message: "Please select a valid role" }),
  }),
});

export const additionalInfoSchema = z.object({
  department: z
    .string()
    .min(2, "Department must be at least 2 characters")
    .max(50, "Department must be less than 50 characters"),
  position: z
    .string()
    .min(2, "Position must be at least 2 characters")
    .max(50, "Position must be less than 50 characters"),
  startDate: z.string().refine((date) => {
    const selectedDate = new Date(date);
    const today = new Date();
    return selectedDate >= today;
  }, "Start date must be today or in the future"),
});

export const userFormSchema = z.object({
  ...personalInfoSchema.shape,
  ...accountDetailsSchema.shape,
  ...additionalInfoSchema.shape,
});

export type UserFormData = z.infer<typeof userFormSchema>;

import { z } from "zod";

export const accountTypeSchema = z.object({
  accountType: z.enum(["individual", "business"], {
    required_error: "Please select an account type",
  }),
});

export const baseUserDetailsSchema = z.object({
  firstName: z
    .string({
      required_error: "This field cannot be empty",
    })
    .min(2, {
      message: "First name must be greater than 2 characters.",
    })
    .max(50, "firstname must be less than 50 characters"),

  lastName: z
    .string({
      required_error: "This field cannot be empty",
    })
    .min(2, {
      message: "Last name must be greater than 2 characters.",
    })
    .max(50, "lastname must be less than 50 characters"),

  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^\+?[\d\s-()]+$/, "Please enter a valid phone number"),

  email: z
    .string()
    .email("Please enter a valid email address")
    .min(1, "Email is required"),
});

const individualUserDetailsSchema = baseUserDetailsSchema.extend({
  accountType: z.literal("individual"),
});

const businessUserDetailsSchema = baseUserDetailsSchema.extend({
  accountType: z.literal("business"),

  address: z
    .string({
      required_error: "This field cannot be empty",
    })
    .min(2, {
      message: "Address must be at least 2 characters.",
    })
    .max(100, {
      message: "Address must not be longer than 100 characters.",
    }),
  dob: z
    .string()
    .min(2, { message: "Please enter a valid date of birth" })
    .refine(
      (date) => {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(date)) return false;
        const parsedDate = new Date(date);
        return parsedDate instanceof Date && !isNaN(parsedDate.getTime());
      },
      { message: "Please enter a valid date (YYYY-MM-DD)" }
    ),
});

export const userDetailsSchema = z.discriminatedUnion("accountType", [
  individualUserDetailsSchema,
  businessUserDetailsSchema,
]);

export const otpVerificationSchema = z.object({
  code: z
    .string()
    .length(6, "Verification code must be 6 digits")
    .regex(/^\d+$/, "Verification code must contain only numbers"),
});

export const passwordCreationSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/\d/, "Password must contain at least one number")
      .regex(
        /[^a-zA-Z0-9]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const signInSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address")
    .min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address")
    .min(1, "Email is required"),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/\d/, "Password must contain at least one number")
      .regex(
        /[^a-zA-Z0-9]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type AccountTypeFormData = z.infer<typeof accountTypeSchema>;
export type UserDetailsFormData = z.infer<typeof userDetailsSchema>;
export type OtpVerificationFormData = z.infer<typeof otpVerificationSchema>;
export type PasswordCreationFormData = z.infer<typeof passwordCreationSchema>;
export type SignInFormData = z.infer<typeof signInSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

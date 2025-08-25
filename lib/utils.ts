import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Helper functions
export const checkPasswordStrength = (password: string) => {
  const requirements = [
    {
      label: "At least 8 characters",
      met: password.length >= 8,
    },
    {
      label: "One uppercase letter",
      met: /[A-Z]/.test(password),
    },
    {
      label: "One lowercase letter",
      met: /[a-z]/.test(password),
    },
    {
      label: "One number",
      met: /\d/.test(password),
    },
    {
      label: "One special character",
      met: /[^a-zA-Z0-9]/.test(password),
    },
  ];

  const metCount = requirements.filter((req) => req.met).length;
  const strength =
    metCount === 0
      ? "weak"
      : metCount <= 2
      ? "weak"
      : metCount <= 3
      ? "medium"
      : metCount <= 4
      ? "strong"
      : "very-strong";

  return {
    requirements,
    strength,
    score: metCount,
    maxScore: requirements.length,
  };
};

// Reset code validation helper
export const validateResetCode = (code: string) => {
  const issues: string[] = [];

  if (!code) {
    issues.push("Code is empty");
  }

  if (typeof code !== "string") {
    issues.push(`Code is not a string (type: ${typeof code})`);
  }

  const cleanCode = String(code).trim();

  if (cleanCode.length < 6) {
    issues.push(
      `Code length is ${cleanCode.length}, expected at least 6 characters`
    );
  }

  if (cleanCode.length > 100) {
    issues.push(`Code length is ${cleanCode.length}, seems too long`);
  }

  // Check for common issues
  if (/\s/.test(cleanCode)) {
    issues.push("Code contains spaces");
  }

  return {
    isValid: issues.length === 0,
    issues,
    cleanCode,
  };
};

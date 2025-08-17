"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { resetPasswordSchema, type ResetPasswordFormData } from "@/schemas";
import Image from "next/image";

interface ResetPasswordStepProps {
  onSubmit: (data: ResetPasswordFormData) => void;
  isLoading?: boolean;
}

export function ResetPasswordStep({
  onSubmit,
  isLoading = false,
}: ResetPasswordStepProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const password = form.watch("password");

  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { strength: "", color: "" };

    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/\d/.test(pwd)) score++;
    if (/[^a-zA-Z0-9]/.test(pwd)) score++;

    if (score <= 2) return { strength: "Weak", color: "text-red-500" };
    if (score <= 3) return { strength: "Good", color: "text-yellow-500" };
    if (score <= 4) return { strength: "Strong", color: "text-blue-500" };
    return { strength: "Excellent", color: "text-green-500" };
  };

  const passwordStrength = getPasswordStrength(password);

  return (
    <div className="p-8 space-y-6">
      {/* Icon */}
      <div className="flex justify-center">
        <div className="w-40 h-40 flex items-center justify-center">
          <Image
            src="/images/image.png"
            alt="Forgot Password Icon"
            width={100}
            height={100}
            className="w-full h-full"
          />
        </div>
      </div>

      {/* Header */}
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2 text-white">
          Reset password
        </h2>
        <p className="text-gray-400 text-sm">
          Please kindly set your new password
        </p>
      </div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">New password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      placeholder="Send Code"
                      disabled={isLoading}
                      className="bg-transparent border-0 border-b border-gray-600 rounded-none px-0 py-3 pr-10 text-white placeholder:text-gray-500 focus:border-white focus-visible:ring-0"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                      className="absolute right-0 top-3 text-gray-400 hover:text-white">
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </FormControl>
                {password && (
                  <div className="text-sm">
                    <span className="text-gray-400">Password Strength: </span>
                    <span className={passwordStrength.color}>
                      {passwordStrength.strength}
                    </span>
                  </div>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Re-enter password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Send Code"
                      disabled={isLoading}
                      className="bg-transparent border-0 border-b border-gray-600 rounded-none px-0 py-3 pr-10 text-white placeholder:text-gray-500 focus:border-white focus-visible:ring-0"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      disabled={isLoading}
                      className="absolute right-0 top-3 text-gray-400 hover:text-white">
                      {showConfirmPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-white hover:bg-gray-100 text-black py-3 rounded-lg font-medium">
            {isLoading ? "Resetting..." : "Reset Password"}
          </Button>
        </form>
      </Form>
    </div>
  );
}

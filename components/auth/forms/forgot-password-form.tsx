"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Mail } from "lucide-react";
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
import { forgotPasswordSchema, type ForgotPasswordFormData } from "@/schemas";

export function ForgotPasswordForm({
  onSubmit,
  onBackToSignIn,
  isLoading = false,
}: ForgotPasswordFormProps) {
  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2 text-white">
          Forgot Password?
        </h2>
        <p className="text-gray-400 text-sm">
          {
            "Don't worry! Enter your email address and we'll send you a reset link."
          }
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Email address</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      type="email"
                      placeholder="Enter your email"
                      disabled={isLoading}
                      className="bg-transparent border-0 border-b border-gray-600 rounded-none px-0 py-3 pr-10 text-white placeholder:text-gray-500 focus:border-white focus-visible:ring-0"
                    />
                    <Mail className="absolute right-0 top-3 h-5 w-5 text-gray-400" />
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
            {isLoading ? "Sending..." : "Send Reset Link"}
          </Button>
        </form>
      </Form>

      <div className="text-center">
        <button
          type="button"
          onClick={onBackToSignIn}
          disabled={isLoading}
          className="text-sm text-gray-400 hover:text-white underline">
          Back to Sign In
        </button>
      </div>
    </div>
  );
}

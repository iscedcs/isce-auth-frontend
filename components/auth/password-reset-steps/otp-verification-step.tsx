"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ArrowLeft } from "lucide-react";
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
import { otpVerificationSchema, type OtpVerificationFormData } from "@/schemas";
import Image from "next/image";

interface OtpVerificationStepProps {
  onSubmit: (data: OtpVerificationFormData) => void;
  onResendCode: () => void;
  onBackToLogin: () => void;
  isLoading?: boolean;
  email?: string;
}

export function OtpVerificationStep({
  onSubmit,
  onResendCode,
  onBackToLogin,
  isLoading = false,
  email,
}: OtpVerificationStepProps) {
  const form = useForm<OtpVerificationFormData>({
    resolver: zodResolver(otpVerificationSchema),
    defaultValues: {
      code: "",
    },
  });

  const getMaskedEmail = (email: string) => {
    if (!email) return "";
    const [localPart, domain] = email.split("@");
    if (localPart.length <= 2) return email;
    return `${localPart.substring(0, 2)}${"*".repeat(
      localPart.length - 2
    )}@${domain}`;
  };

  return (
    <div className="p-8 space-y-6">
      {/* Icon */}
      <div className="flex justify-center">
        <div className="w-40 h-40 flex items-center justify-center">
          <Image
            src="/images/signpost1.png"
            alt="OTP Verification Icon"
            width={70}
            height={70}
            className="w-full h-full"
          />
        </div>
      </div>

      {/* Header */}
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2 text-white">
          Enter OTP Code
        </h2>
        <p className="text-gray-400 text-sm">
          {`We've sent a verification code to your email address.`}
        </p>
      </div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">
                  Enter the 6-digit code
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="00000n"
                    maxLength={6}
                    disabled={isLoading}
                    className="bg-transparent border-0 border-b border-gray-600 rounded-none px-0 py-3 text-white placeholder:text-gray-500 focus:border-white focus-visible:ring-0 text-center text-lg tracking-widest"
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^a-zA-Z0-9]/g, "");
                      field.onChange(value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Resend Code */}
          <div className="text-center">
            <Button
              type="button"
              onClick={onResendCode}
              disabled={isLoading}
              className="text-sm text-gray-400 hover:text-white underline">
              {isLoading ? "Sending..." : "Don't receive code? Resend Code"}
            </Button>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-white hover:bg-gray-100 text-black py-3 rounded-lg font-medium">
            {isLoading ? "Verifying..." : "Continue"}
          </Button>
        </form>
      </Form>

      {/* Back to Login */}
      <button
        onClick={onBackToLogin}
        disabled={isLoading}
        className="flex items-center justify-center space-x-2 text-sm text-gray-400 hover:text-white w-full">
        <ArrowLeft size={16} />
        <span>Back to Login</span>
      </button>
    </div>
  );
}

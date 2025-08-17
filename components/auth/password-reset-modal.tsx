"use client";

import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ForgotPasswordStep } from "./password-reset-steps/forgot-password-step";
import { OtpVerificationStep } from "./password-reset-steps/otp-verification-step";
import { ResetPasswordStep } from "./password-reset-steps/reset-password-step";
import { SuccessStep } from "./password-reset-steps/success-step";
import { ErrorStep } from "./password-reset-steps/error-step";
import type {
  ForgotPasswordFormData,
  OtpVerificationFormData,
  ResetPasswordFormData,
} from "@/schemas";

type PasswordResetStep =
  | "forgot-password"
  | "otp-verification"
  | "reset-password"
  | "success"
  | "error";

interface PasswordResetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginRedirect: () => void;
}

export function PasswordResetModal({
  isOpen,
  onClose,
  onLoginRedirect,
}: PasswordResetModalProps) {
  const [currentStep, setCurrentStep] =
    useState<PasswordResetStep>("forgot-password");
  const [isLoading, setIsLoading] = useState(false);
  const [resetData, setResetData] = useState<{
    email?: string;
    resetMethod?: "email" | "phone";
  }>({});

  const handleForgotPassword = async (
    data: ForgotPasswordFormData,
    method: "email" | "phone" = "email"
  ) => {
    setIsLoading(true);
    try {
      // Here you would integrate with your password reset API
      console.log("Forgot password data:", { ...data, method });

      setResetData({ email: data.email, resetMethod: method });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setCurrentStep("otp-verification");
    } catch (error) {
      console.error("Forgot password error:", error);
      setCurrentStep("error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpVerification = async (data: OtpVerificationFormData) => {
    setIsLoading(true);
    try {
      // Here you would verify the OTP with your API
      console.log("OTP verification data:", data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setCurrentStep("reset-password");
    } catch (error) {
      console.error("OTP verification error:", error);
      setCurrentStep("error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (data: ResetPasswordFormData) => {
    setIsLoading(true);
    try {
      // Here you would reset the password with your API
      console.log("Reset password data:", data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setCurrentStep("success");
    } catch (error) {
      console.error("Reset password error:", error);
      setCurrentStep("error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    try {
      // Here you would resend the OTP
      console.log("Resending OTP to:", resetData.email);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error("Resend code error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setCurrentStep("forgot-password");
    setResetData({});
    onClose();
  };

  const handleTryAgain = () => {
    setCurrentStep("forgot-password");
  };

  const handleLoginSuccess = () => {
    setCurrentStep("forgot-password");
    setResetData({});
    onClose();
    onLoginRedirect();
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case "forgot-password":
        return (
          <ForgotPasswordStep
            onSubmit={handleForgotPassword}
            onBackToLogin={handleBackToLogin}
            isLoading={isLoading}
          />
        );
      case "otp-verification":
        return (
          <OtpVerificationStep
            onSubmit={handleOtpVerification}
            onResendCode={handleResendCode}
            onBackToLogin={handleBackToLogin}
            isLoading={isLoading}
          />
        );
      case "reset-password":
        return (
          <ResetPasswordStep
            onSubmit={handleResetPassword}
            isLoading={isLoading}
          />
        );
      case "success":
        return <SuccessStep onLogin={handleLoginSuccess} />;
      case "error":
        return <ErrorStep onTryAgain={handleTryAgain} />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-black border border-gray-800 p-0 overflow-hidden">
        {renderCurrentStep()}
      </DialogContent>
    </Dialog>
  );
}

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
import { AuthService } from "@/lib/auth-service";
import { toast } from "sonner";

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
    errorMessage?: string;
  }>({});

  const handleForgotPassword = async (
    data: ForgotPasswordFormData,
    method: "email" | "phone" = "email"
  ) => {
    setIsLoading(true);
    try {
      console.log("Requesting password reset:", { ...data, method });

      // Validate email format
      if (!AuthService.validateEmail(data.email)) {
        toast.error("Please enter a valid email address");
        setIsLoading(false);
        return;
      }

      // Call the password reset API
      const response = await AuthService.requestPasswordReset(data);

      if (response.success) {
        setResetData({
          email: data.email,
          resetMethod: method,
        });
        toast.success(
          response.message || "Password reset code sent to your email"
        );
        setCurrentStep("otp-verification");
      } else {
        toast.error(response.message);
        setResetData({
          email: data.email,
          resetMethod: method,
          errorMessage: response.message,
        });
        setCurrentStep("error");
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      toast.error("An unexpected error occurred. Please try again.");
      setResetData({
        email: data.email,
        resetMethod: method,
        errorMessage: "An unexpected error occurred. Please try again.",
      });
      setCurrentStep("error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpVerification = async (data: OtpVerificationFormData) => {
    if (!resetData.email) {
      toast.error("Email not found. Please start over.");
      setCurrentStep("forgot-password");
      return;
    }

    setIsLoading(true);
    try {
      console.log("Verifying password reset OTP:", data);

      // Call the OTP verification API
      const response = await AuthService.verifyPasswordResetOtp({
        ...data,
        email: resetData.email,
      });

      if (response.success) {
        toast.success(response.message || "OTP verified successfully");
        setCurrentStep("reset-password");
      } else {
        toast.error(response.message);
        // Don't go to error step for OTP failures, let user try again
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (data: ResetPasswordFormData) => {
    if (!resetData.email) {
      toast.error("Email not found. Please start over.");
      setCurrentStep("forgot-password");
      return;
    }

    setIsLoading(true);
    try {
      console.log("Resetting password");

      // Call the reset password API
      const response = await AuthService.resetPassword({
        ...data,
        email: resetData.email,
      });

      if (response.success) {
        toast.success(response.message || "Password reset successfully");
        setCurrentStep("success");
      } else {
        toast.error(response.message);
        setResetData({
          ...resetData,
          errorMessage: response.message,
        });
        setCurrentStep("error");
      }
    } catch (error) {
      console.error("Reset password error:", error);
      toast.error("An unexpected error occurred. Please try again.");
      setResetData({
        ...resetData,
        errorMessage: "An unexpected error occurred. Please try again.",
      });
      setCurrentStep("error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!resetData.email) {
      toast.error("Email not found. Please start over.");
      setCurrentStep("forgot-password");
      return;
    }

    setIsLoading(true);
    try {
      console.log("Resending password reset code to:", resetData.email);

      // Call the password reset API again
      const response = await AuthService.requestPasswordReset({
        email: resetData.email,
      });

      if (response.success) {
        toast.success("Password reset code sent again");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Resend code error:", error);
      toast.error("Failed to resend code. Please try again.");
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
            email={resetData.email}
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
        return (
          <ErrorStep
            onTryAgain={handleTryAgain}
            errorMessage={resetData.errorMessage}
          />
        );
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

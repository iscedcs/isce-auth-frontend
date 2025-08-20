"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthLayout } from "@/components/auth/auth-layout";
import { AccountTypeForm } from "@/components/auth/forms/account-type-form";
import { UserDetailsForm } from "@/components/auth/forms/user-details-form";
import { OtpVerificationForm } from "@/components/auth/forms/otp-verification-form";
import { PasswordCreationForm } from "@/components/auth/forms/password-creation-form";
import type {
  AccountTypeFormData,
  UserDetailsFormData,
  OtpVerificationFormData,
  PasswordCreationFormData,
} from "@/schemas";
import { toast } from "sonner";
import { PasswordResetModal } from "@/components/auth/password-reset-modal";
import { AuthService } from "@/lib/auth-service";
import { signIn } from "@/auth";

type SignupData = {
  accountType?: AccountTypeFormData;
  userDetails?: UserDetailsFormData;
  otpVerification?: OtpVerificationFormData;
  passwordCreation?: PasswordCreationFormData;
};

export default function SignUpPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [signupData, setSignupData] = useState<SignupData>({});
  const [isPasswordResetModalOpen, setIsPasswordResetModalOpen] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const cardImages = [
    "/images/_Wallet-card.png",
    "/images/_Wallet-card.png",
    "/images/_Wallet-card.png",
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % cardImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);
  const handleAccountTypeSubmit = (data: AccountTypeFormData) => {
    setSignupData((prev) => ({ ...prev, accountType: data }));
    setCurrentStep(2);
  };

  const handleUserDetailsSubmit = async (data: UserDetailsFormData) => {
    // Just store the data and move to next step - no API call yet
    setSignupData((prev) => ({ ...prev, userDetails: data }));

    // Optionally, you can request OTP here if your backend supports it
    // For now, we'll just move to the next step
    toast.success(
      "Details saved! Please check your email for verification code."
    );
    setCurrentStep(3);
  };

  const handleOtpVerificationSubmit = async (data: OtpVerificationFormData) => {
    if (!signupData.userDetails?.email) {
      toast.error("Email not found. Please start over.");
      setCurrentStep(1);
      return;
    }

    setIsLoading(true);

    try {
      // If your backend supports separate OTP verification, uncomment this:
      const response = await AuthService.verifyOtp({
        ...data,
        email: signupData.userDetails.email,
      });

      if (!response.success) {
        toast.error(response.message);
        setIsLoading(false);
        return;
      }

      // For now, just store the OTP data and move to next step
      setSignupData((prev) => ({ ...prev, otpVerification: data }));
      toast.success("Email verified successfully!");
      setCurrentStep(4);
    } catch (error) {
      console.error("OTP verification error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordCreationSubmit = async (
    data: PasswordCreationFormData
  ) => {
    if (!signupData.userDetails) {
      toast.error("User details not found. Please start over.");
      setCurrentStep(1);
      return;
    }

    setIsLoading(true);

    try {
      const response = await AuthService.completeSignup(
        signupData.userDetails,
        data
      );

      if (response.success) {
        setSignupData((prev) => ({ ...prev, passwordCreation: data }));
        toast.success("Account created successfully!");

        const signInResult = await signIn("credentials", {
          email: signupData.userDetails.email,
          password: data.password,
          redirect: false,
        });

        if (signInResult?.ok) {
          toast.success("Welcome! Redirecting to dashboard...");
          router.push("https://isce.tech/store");
        } else {
          toast.success("Account created! Please sign in.");
          router.push("/sign-in");
        }
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Complete signup error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!signupData.userDetails?.email) {
      toast.error("Email not found. Please start over.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await AuthService.requestOtp(
        signupData.userDetails.email
      );

      if (response.success) {
        toast.success("Verification code sent!");
      } else {
        toast.error(response.message);
      }

      toast.success("Verification code sent!");
    } catch (error) {
      console.error("Resend OTP error:", error);
      toast.error("Failed to resend code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Please Select your account type";
      case 2:
        return "Enter your details";
      case 3:
        return "Enter the OTP code sent to your mail";
      case 4:
        return "Set your password to your account";
      default:
        return "";
    }
  };

  const selectedAccountType = signupData.accountType?.accountType;

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <AccountTypeForm
            onSubmit={handleAccountTypeSubmit}
            defaultValues={signupData.accountType}
          />
        );
      case 2:
        if (!selectedAccountType) {
          setCurrentStep(1);
          return null;
        }
        return (
          <UserDetailsForm
            onSubmit={handleUserDetailsSubmit}
            defaultValues={signupData.userDetails}
            accountType={selectedAccountType || "USER"}
            isLoading={isLoading}
          />
        );
      case 3:
        return (
          <OtpVerificationForm
            onSubmit={handleOtpVerificationSubmit}
            onResendCode={handleResendCode}
            defaultValues={signupData.otpVerification}
            isLoading={isLoading}
          />
        );
      case 4:
        return (
          <PasswordCreationForm
            onSubmit={handlePasswordCreationSubmit}
            defaultValues={signupData.passwordCreation}
            isLoading={isLoading}
          />
        );
      default:
        return null;
    }
  };

  return (
    <AuthLayout
      currentStep={currentStep}
      totalSteps={4}
      cardImages={cardImages}
      currentSlide={currentSlide}
      setCurrentSlide={setCurrentSlide}>
      {renderCurrentStep()}
      <PasswordResetModal
        isOpen={isPasswordResetModalOpen}
        onClose={() => setIsPasswordResetModalOpen(false)}
        onLoginRedirect={() => {
          setIsPasswordResetModalOpen(false);
          router.push("/sign-in");
        }}
      />
    </AuthLayout>
  );
}

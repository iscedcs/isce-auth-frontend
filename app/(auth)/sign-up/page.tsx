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
import { PasswordResetModal } from "@/components/auth/password-reset-modal";

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

  const handleUserDetailsSubmit = (data: UserDetailsFormData) => {
    setSignupData((prev) => ({ ...prev, userDetails: data }));
    setCurrentStep(3);
  };

  const handleOtpVerificationSubmit = (data: OtpVerificationFormData) => {
    setSignupData((prev) => ({ ...prev, otpVerification: data }));
    setCurrentStep(4);
  };

  const handlePasswordCreationSubmit = (data: PasswordCreationFormData) => {
    setSignupData((prev) => ({ ...prev, passwordCreation: data }));

    // Here you would submit all the signup data to your API
    console.log("Complete signup data:", {
      ...signupData,
      passwordCreation: data,
    });

    // Redirect to success page or dashboard
    router.push("/dashboard");
  };

  const handleResendCode = () => {
    // Implement resend OTP logic
    console.log("Resending OTP code...");
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
            accountType={selectedAccountType || "individual"}
          />
        );
      case 3:
        return (
          <OtpVerificationForm
            onSubmit={handleOtpVerificationSubmit}
            onResendCode={handleResendCode}
            defaultValues={signupData.otpVerification}
          />
        );
      case 4:
        return (
          <PasswordCreationForm
            onSubmit={handlePasswordCreationSubmit}
            defaultValues={signupData.passwordCreation}
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

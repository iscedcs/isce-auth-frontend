"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SignInForm } from "@/components/auth/forms/sign-in-form";
import type { SignInFormData } from "@/schemas";
import { PasswordResetModal } from "@/components/auth/password-reset-modal";
import Image from "next/image";
import { toast } from "sonner";
import { getSession, signIn } from "next-auth/react";

export default function SignInPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordResetModalOpen, setIsPasswordResetModalOpen] =
    useState(false);

  // Carousel State
  const cardImages = [
    "/images/_Wallet-card.png",
    "/images/_Wallet-card.png",
    "/images/_Wallet-card.png",
  ];
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-slide every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % cardImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleSignIn = async (data: SignInFormData) => {
    setIsLoading(true);
    try {
      console.log("Attempting sign in with:", { email: data.email });

      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      console.log("Sign in result:", result);

      if (result?.error) {
        // Handle different types of errors
        switch (result.error) {
          case "CredentialsSignin":
            toast.error("Invalid email or password. Please try again.");
            break;
          case "CallbackRouteError":
            toast.error(
              "Authentication failed. Please check your credentials."
            );
            break;
          default:
            toast.error("Sign in failed. Please try again.");
        }
        return;
      }

      if (result?.ok) {
        const session = await getSession();
        console.log("Session after sign in:", session);

        toast.success("Welcome back!");

        if (session?.user?.userType === "business") {
          router.push("/business-dashboard");
        } else {
          router.push("/dashboard");
        }
      } else {
        toast.error("Sign in failed. Please try again.");
      }
    } catch (error) {
      console.error("Sign in error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => setIsPasswordResetModalOpen(true);
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      // Future implementation for Google OAuth
      console.log("Google sign in - to be implemented");
      toast.info("Google sign-in will be available soon!");
    } catch (error) {
      console.error("Google sign in error:", error);
      toast.error("Google sign-in failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  const handleAppleSignIn = async () => {
    setIsLoading(true);
    try {
      // Future implementation for Apple OAuth
      console.log("Apple sign in - to be implemented");
      toast.info("Apple sign-in will be available soon!");
    } catch (error) {
      console.error("Apple sign in error:", error);
      toast.error("Apple sign-in failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen border-8 border-white bg-black flex rounded-[20px] overflow-hidden">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-[40%] flex-col justify-center items-center p-8 relative bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a] rounded-l-[12px] border-r-8 border-white">
        <div className="absolute top-6 right-6">
          <button className="bg-gray-900  border-white rounded-full px-3 py-1 text-white text-xs flex items-center space-x-1 border">
            <Image
              src="/images/flag-uk.png"
              alt="Language"
              width={16}
              height={16}
              className="rounded-full"
            />
            <span>EN</span>
          </button>
        </div>

        {/* Card Stack Carousel */}
        <div className="relative mb-8 h-[250px] w-[200px]">
          {cardImages.map((src, idx) => {
            // Calculate position and style
            const offset =
              (idx - currentSlide + cardImages.length) % cardImages.length;
            return (
              <Image
                key={idx}
                src={src}
                alt={`Card ${idx + 1}`}
                width={220}
                height={320}
                className={`absolute top-0  bottom-2 left-1/2 -translate-x-1/2 rounded-xl shadow-lg transition-all duration-700 ease-in-out
                  ${offset === 0 ? "z-20 rotate-0 scale-100 opacity-100" : ""}
                  ${
                    offset === 1
                      ? "z-10 left-3 -rotate-12 scale-95  -translate-x-[50px]"
                      : ""
                  }
                  ${
                    offset === cardImages.length - 1
                      ? "z-10 right-3 rotate-12 scale-95  -translate-x-[50px]"
                      : ""
                  }
                  ${
                    offset !== 0 &&
                    offset !== 1 &&
                    offset !== cardImages.length - 1
                      ? "opacity-0"
                      : ""
                  }
                `}
              />
            );
          })}
        </div>

        <h1 className="text-4xl font-bold mb-4 py-5 text-center text-white">
          Elevate your digital <br /> lifestyle with one tap.
        </h1>
        <p className="text-gray-400 text-sm text-center">
          ISCE Ecosystem Compromises of Smart ISCE Product to make your daily
          life smooth and stress free
        </p>

        {/* Progress Dots */}
        <div className="absolute bottom-8 flex space-x-2">
          {cardImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${
                currentSlide === idx ? "bg-white" : "bg-gray-500"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-[60%] justify-center flex flex-col bg-black rounded-r-[12px] text-white">
        <div className="flex justify-between p-6 items-center mb-8">
          <button className="text-2xl font-bold">||</button>
          <p className="text-sm">
            Don’t Have an Account?{" "}
            <Link href="/sign-up" className="text-white font-semibold">
              Sign Up
            </Link>
          </p>
        </div>

        <div className="flex-1 flex flex-col justify-center px-6 lg:px-12">
          <div className="max-w-md mx-auto w-full space-y-6">
            <SignInForm
              onSubmit={handleSignIn}
              onForgotPassword={handleForgotPassword}
              onGoogleSignIn={handleGoogleSignIn}
              onAppleSignIn={handleAppleSignIn}
              isLoading={isLoading}
            />
          </div>
        </div>

        <div className="p-6 flex justify-end space-x-6 font-medium text-xs text-white">
          <Link
            href="/privacy-policy"
            className="hover:text-white transition-colors">
            Privacy Policy
          </Link>
          <Link href="/services" className="hover:text-white transition-colors">
            Services
          </Link>
        </div>
      </div>

      <PasswordResetModal
        isOpen={isPasswordResetModalOpen}
        onClose={() => setIsPasswordResetModalOpen(false)}
        onLoginRedirect={() => setIsPasswordResetModalOpen(false)}
      />
    </div>
  );
}

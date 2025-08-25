import { AUTH_API, URLS } from "@/lib/const";
import {
  ForgotPasswordFormData,
  OtpVerificationFormData,
  PasswordCreationFormData,
  ResetPasswordFormData,
  ResetPasswordWithCodeFormData,
  UserDetailsFormData,
} from "@/schemas";
import axios from "axios";

interface SignupResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    userType: string;
    requiresEmailVerification?: boolean;
  };
}

interface OtpResponse {
  success: boolean;
  message: string;
  data?: {
    verified: boolean;
  };
}

interface ForgotPasswordResponse {
  success: boolean;
  message: string;
  data?: {
    resetToken?: string;
    expiresAt?: string;
  };
}

interface ResetPasswordResponse {
  success: boolean;
  message: string;
  data?: {
    success: boolean;
  };
}

interface PasswordSetupResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    userType: string;
    accessToken?: string;
  };
}

// Complete signup data type that matches backend expectations
interface CompleteSignupData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string; // Note: backend expects 'phone', not 'phoneNumber'
  accountType: string;
  address: string;
  dob: string;
  password: string;
  confirmpassword: string; // Note: backend expects 'confirmpassword', not 'confirmPassword'
}

export class AuthService {
  private static baseUrl = AUTH_API;

  // Step 1: Create account (after user details form)
  static async completeSignup(
    userDetails: UserDetailsFormData,
    passwordData: PasswordCreationFormData
  ): Promise<SignupResponse> {
    const url = `${this.baseUrl}${URLS.auth.sign_up}`;

    try {
      // Prepare payload based on account type
      const payload: CompleteSignupData = {
        firstName: userDetails.firstName,
        lastName: userDetails.lastName,
        email: userDetails.email,
        phone: userDetails.phoneNumber,
        accountType: userDetails.accountType,
        address:
          userDetails.accountType === "BUSINESS_USER"
            ? userDetails.address!
            : "N/A",
        dob:
          userDetails.accountType === "BUSINESS_USER"
            ? userDetails.dob!
            : "1990-01-01", // Default DOB for individual
        password: passwordData.password,
        confirmpassword: passwordData.password,
      };

      console.log("Sending complete signup payload:", payload);

      const response = await axios.post(url, payload, {
        timeout: 15000,
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Signup response:", response.data);

      return {
        success: true,
        message: response.data.message || "Account created successfully",
        data: response.data.data || response.data.user,
      };
    } catch (error: any) {
      console.error("Signup error:", error.response?.data || error.message);

      return {
        success: false,
        message:
          error.response?.data?.message ||
          Array.isArray(error.response?.data?.message)
            ? error.response.data.message.join(", ")
            : "Failed to create account",
      };
    }
  }

  // Step 2: Request OTP for email verification
  static async requestOtp(email: string): Promise<OtpResponse> {
    const url = `${this.baseUrl}${URLS.auth.request_otp}`;

    try {
      const response = await axios.post(
        url,
        { email },
        {
          timeout: 10000,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Request OTP response:", response.data);

      return {
        success: true,
        message: response.data.message || "OTP sent successfully",
      };
    } catch (error: any) {
      console.error(
        "Request OTP error:",
        error.response?.data || error.message
      );

      return {
        success: false,
        message: error.response?.data?.message || "Failed to send OTP",
      };
    }
  }

  // Step 3: Verify OTP
  static async verifyOtp(
    otpData: OtpVerificationFormData & { email: string }
  ): Promise<OtpResponse> {
    const url = `${this.baseUrl}${URLS.auth.verify_otp}`;

    try {
      const response = await axios.post(
        url,
        {
          email: otpData.email,
          code: otpData.code,
        },
        {
          timeout: 10000,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Verify OTP response:", response.data);

      return {
        success: true,
        message: response.data.message || "Email verified successfully",
        data: {
          verified: true,
        },
      };
    } catch (error: any) {
      console.error("Verify OTP error:", error.response?.data || error.message);

      return {
        success: false,
        message: error.response?.data?.message || "Invalid or expired OTP",
      };
    }
  }

  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Step 4: Set password and complete registration
  static async setPassword(
    passwordData: PasswordCreationFormData & { email: string }
  ): Promise<PasswordSetupResponse> {
    const url = `${this.baseUrl}${URLS.auth.sign_up}`; // Adjust endpoint as needed

    try {
      const response = await axios.post(
        url,
        {
          email: passwordData.email,
          password: passwordData.password,
        },
        {
          timeout: 10000,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Set password response:", response.data);

      return {
        success: true,
        message:
          response.data.message || "Account setup completed successfully",
        data: response.data.data || response.data.user,
      };
    } catch (error: any) {
      console.error(
        "Set password error:",
        error.response?.data || error.message
      );

      return {
        success: false,
        message: error.response?.data?.message || "Failed to set password",
      };
    }
  }

  // Step 1: Request password reset token
  static async requestPasswordReset(
    data: ForgotPasswordFormData
  ): Promise<ForgotPasswordResponse> {
    const url = `${this.baseUrl}${URLS.auth.reset_token}`;

    try {
      console.log("Requesting password reset for:", data.email);

      const response = await axios.post(
        url,
        { email: data.email },
        {
          timeout: 10000,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Password reset request response:", response.data);

      return {
        success: true,
        message:
          response.data.message || "Password reset code sent successfully",
        data: response.data.data,
      };
    } catch (error: any) {
      console.error(
        "Password reset request error:",
        error.response?.data || error.message
      );

      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to send password reset code",
      };
    }
  }

  static async resetPasswordWithCode(
    resetCode: string,
    newPassword: string
  ): Promise<ResetPasswordResponse> {
    const url = `${this.baseUrl}${URLS.auth.reset_password}`;

    try {
      console.log("Resetting password with resetCode");
      console.log("ResetCode length:", resetCode.length);
      console.log("ResetCode type:", typeof resetCode);

      // Prepare payload according to backend specification
      const payload: ResetPasswordWithCodeFormData = {
        resetCode: resetCode.trim(),
        newPassword: newPassword,
        confirmPassword: newPassword,
      };

      console.log("Reset password payload:", payload);

      const response = await axios.post(url, payload, {
        timeout: 10000,
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Password reset response:", response.data);

      return {
        success: true,
        message: response.data.message || "Password reset successfully",
        data: {
          success: true,
        },
      };
    } catch (error: any) {
      console.error(
        "Password reset error:",
        error.response?.data || error.message
      );

      return {
        success: false,
        message: error.response?.data?.message || "Failed to reset password",
      };
    }
  }

  // Step 2: Verify password reset OTP
  // DEPRECATED: No longer needed for password reset flow
  // (Keep for signup flow if still needed)
  static async verifyPasswordResetOtp(
    otpData: OtpVerificationFormData & { email: string }
  ): Promise<OtpResponse> {
    console.warn(
      "⚠️ verifyPasswordResetOtp is deprecated for password reset flow"
    );
    console.warn("⚠️ Use resetPasswordWithCode instead");

    // This method is no longer needed for password reset
    // The resetCode is verified directly in the resetPasswordWithCode method
    return {
      success: false,
      message: "This method is deprecated. Use resetPasswordWithCode instead.",
    };
  }

  // DEPRECATED: No longer needed for password reset flow
  static async resetPassword(
    resetData: ResetPasswordFormData & { email: string }
  ): Promise<ResetPasswordResponse> {
    console.warn("⚠️ resetPassword is deprecated for password reset flow");
    console.warn("⚠️ Use resetPasswordWithCode instead");

    // This method is no longer needed for password reset
    // Use resetPasswordWithCode instead
    return {
      success: false,
      message: "This method is deprecated. Use resetPasswordWithCode instead.",
    };
  }

  // Helper method to validate reset code format
  static validateResetCode(code: string): {
    isValid: boolean;
    issues: string[];
  } {
    const issues: string[] = [];

    if (!code) {
      issues.push("Code is empty");
    }

    if (typeof code !== "string") {
      issues.push(`Code is not a string (type: ${typeof code})`);
    }

    const cleanCode = String(code).trim();

    // Reset codes are typically longer than OTP codes
    if (cleanCode.length < 6) {
      issues.push(
        `Code length is ${cleanCode.length}, expected at least 6 characters`
      );
    }

    if (cleanCode.length > 100) {
      issues.push(`Code length is ${cleanCode.length}, seems too long`);
    }

    return {
      isValid: issues.length === 0,
      issues,
    };
  }

  // Helper method to get user profile after successful authentication
  static async getUserProfile(accessToken: string): Promise<any> {
    try {
      const response = await axios.get(`${this.baseUrl}/user/profile`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        timeout: 10000,
      });

      return response.data.data || response.data.user;
    } catch (error: any) {
      console.error(
        "Get user profile error:",
        error.response?.data || error.message
      );
      return null;
    }
  }
}

// Export individual functions for easier use
export const {
  completeSignup,
  validateEmail,
  requestOtp,
  verifyOtp,
  setPassword,
  requestPasswordReset,
  resetPasswordWithCode,
  validateResetCode,
  getUserProfile,
} = AuthService;

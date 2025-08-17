export const AUTH_API = process.env.NEXT_PUBLIC_LIVE_ISCEAUTH_BACKEND_URL;
export const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export const URLS = {
  auth: {
    sign_up: "/auth/signup",
    sign_in: "/auth/signin",
    sign_out: "/auth/signout",
    request_otp: "/auth/request-verify-email-code",
    verify_otp: "/auth/verify-email-code",
    reset_token: "/auth/send-reset-token",
    reset_password: "/auth/reset-password",
  },
  user: {
    one: "/user/one/{id}",
  },
};

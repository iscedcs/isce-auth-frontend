import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    accessToken?: string;
    refreshToken?: string;
    accessToken?: string;
    userType: string;
  }

  interface Session {
    error?: string;
    user: User;
  }
}

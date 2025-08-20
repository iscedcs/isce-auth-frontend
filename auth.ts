import NextAuth from "next-auth";
import authConfig from "./auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/sign-in",
    error: "/auth/error",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      console.log(
        "JWT Callback - Token:",
        token,
        "User:",
        user,
        "Account:",
        account
      );

      if (user) {
        // First time JWT callback is invoked, user object is available
        token.id = user.id;
        token.email = user.email;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.userType = user.userType;
        token.accessToken = user.accessToken;
      }

      return token;
    },

    async session({ token, session }) {
      console.log("Session Callback - Token:", token, "Session:", session);

      if (token && session.user) {
        // Send properties to the client
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.firstName = token.firstName as string;
        session.user.lastName = token.lastName as string;
        session.user.userType = token.userType as string;
        session.user.accessToken = token.accessToken as string;
      }

      return session;
    },

    async redirect({ url, baseUrl }) {
      console.log("Redirect Callback - URL:", url, "BaseURL:", baseUrl);

      // Handle sign-in redirects
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      } else if (new URL(url).origin === baseUrl) {
        return url;
      }

      // Default redirect to dashboard after successful sign-in
      return `${baseUrl}/dashboard`;
    },

    async signIn({ user, account, profile, email, credentials }) {
      console.log("SignIn Callback - User:", user, "Account:", account);

      // Allow sign in
      return true;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: process.env.NODE_ENV === "development",
  ...authConfig,
});

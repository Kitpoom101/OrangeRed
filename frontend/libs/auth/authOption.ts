import CredentialsProvider from "next-auth/providers/credentials";
import userLogin from "./userLogin";
import { NextAuthOptions } from "next-auth";
import getUser from "./getUser";
import Google from "next-auth/providers/google";

const loginWithGoogle = async (idToken: string) => {
  const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL;

  if (!backendUrl) {
    throw new Error("BACKEND_URL or NEXT_PUBLIC_BACKEND_URL is required for Google OAuth");
  }

  const response = await fetch(`${backendUrl}/api/v1/auth/google`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ idToken }),
  });

  if (!response.ok) {
    throw new Error("Google OAuth login failed");
  }

  return response.json();
};

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: '/signin',
    signOut: '/signout',
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied
        if(!credentials) return null;
        let user = null;
        try {
          user = await userLogin(credentials.email, credentials.password);
        } catch {
          return null;
        }

        if (user) {
          // Any object returned will be saved in `user` property of the JWT
          const userData = await getUser(user.token);
          return {
            ...userData.data,
            token: user.token,
          }
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          return null

          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user, account }) {
      if (account?.provider === "google" && account.id_token) {
        const googleLogin = await loginWithGoogle(account.id_token);

        return {
          ...token,
          ...googleLogin.data,
          token: googleLogin.token,
        };
      }

      return {...token, ...user}
    },
    async session({ session, token, user }) {
      session.user = token as any
      return session
    },
  },
}

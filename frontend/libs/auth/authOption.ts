import CredentialsProvider from "next-auth/providers/credentials";
import userLogin from "./userLogin";
import { NextAuthOptions } from "next-auth";
import getUser from "./getUser";
import Google from "next-auth/providers/google";
import { cookies } from "next/headers";

const loginWithGoogle = async (idToken: string, role?: "user" | "shopowner") => {
  const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL;

  if (!backendUrl) {
    throw new Error("BACKEND_URL or NEXT_PUBLIC_BACKEND_URL is required for Google OAuth");
  }

  const response = await fetch(`${backendUrl}/api/v1/auth/google`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ idToken, role }),
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
        } catch (err: any) {
          const message =
            err?.response?.data?.msg ||
            err?.msg ||
            "Something went wrong";

          throw new Error(message); // 🔥 this is the key
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
    async jwt({ token, user, account, trigger, session }: any) {
      // When update() is called from the client, merge the new data into the token
      if (trigger === 'update' && session) {
        return { ...token, ...session };
      }

      if (account?.provider === "google" && account.id_token) {
        const cookieStore = await cookies();
        const selectedRole = cookieStore.get("register_role")?.value;
        const normalizedRole = selectedRole === "shopowner" ? "shopowner" : "user";
        const googleLogin = await loginWithGoogle(account.id_token, normalizedRole);

        return {
          ...token,
          ...googleLogin.data,
          token: googleLogin.token,
        };
      }

      if (trigger === "update" && session) {
        return { ...token, ...session };
      }

      if (user) {
        return { ...token, ...user };
      }

      return token;
    },
    async session({ session, token, user }) {
      session.user = token as any
      return session
    },
  },
}

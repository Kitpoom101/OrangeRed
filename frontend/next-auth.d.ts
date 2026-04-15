import NextAuth from "next-auth";

declare module "next-auth"{
  export interface Session{
    user: {
      _id: string,
      name: string,
      email?: string,
      profilePicture?: string,
      role: string,
      tel?: string,
      token: string,
      profilePicture?: string | null
    }
  }

  interface User {
    _id?: string;
    name?: string;
    email?: string;
    role?: string;
    tel?: string;
    token?: string;
    profilePicture?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    _id?: string;
    name?: string;
    email?: string;
    role?: string;
    tel?: string;
    token?: string;
    profilePicture?: string | null;
  }
}

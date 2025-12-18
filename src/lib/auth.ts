// @ts-nocheck
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { User as PrismaUser } from "@prisma/client";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";

// Define a type for the user that omits the password field.
type UserWithoutPassword = Omit<PrismaUser, "password">;

export const NEXT_AUTH_CONFIG: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "you@example.com" },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Your password",
        },
      },
      async authorize(
        credentials: Record<"email" | "password", string> | undefined
      ) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        // Look up the user in your database by email
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new Error("No user found with that email");
        }

        // Compare the provided password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Invalid password");
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _password, ...userWithoutPassword } = user;

        return userWithoutPassword as UserWithoutPassword;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      // When user is available (during sign in), attach the user info to the token.
      if (user) {
        token.user = user as UserWithoutPassword;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      // Attach the user info from token to session.
      session.user = token.user as UserWithoutPassword;
      return session;
    },
  },
};

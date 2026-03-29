import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user || !user.password) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role;
        session.user.id = token.id;
      }
      return session;
    },
  },
};

// Role-based access control helpers
export function requireAuth(role?: string) {
  return async function authenticate() {
    // This will be used in server components
    // Implementation depends on Next.js auth patterns
  };
}

export function hasRole(userRole: string, allowedRoles: string[]) {
  return allowedRoles.includes(userRole);
}

export const ROLE_HIERARCHY = {
  ADMIN: 4,
  PARTNER: 3,
  ANALYST: 2,
  FOUNDER: 1,
  LP: 1,
  VISITOR: 0,
};

export function hasMinRole(userRole: string, minRole: string) {
  return ROLE_HIERARCHY[userRole as keyof typeof ROLE_HIERARCHY] >= 
         ROLE_HIERARCHY[minRole as keyof typeof ROLE_HIERARCHY];
}

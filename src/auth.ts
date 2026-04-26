import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import db from "@/lib/db";

const API_SERVER_URL = process.env.INTERNAL_API_URL || 'http://localhost:8000';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        identifier: { label: "Email or Phone", type: "text" },
        otp: { label: "OTP", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.identifier) return null;

        const isOtpFlow = !!credentials.otp;
        const isEmail = (credentials.identifier as string).includes('@');
        
        try {
          const loginData = isOtpFlow 
            ? { phone: credentials.identifier, code: credentials.otp }
            : { [isEmail ? 'email' : 'phone']: credentials.identifier, password: credentials.password };
            
          const endpoint = isOtpFlow ? '/auth/otp/login' : '/auth/login';

          // Instead of DB, call FastAPI auth
          const response = await fetch(`${API_SERVER_URL}${endpoint}`, {
            method: 'POST',
            body: JSON.stringify(loginData),
            headers: { 'Content-Type': 'application/json' }
          });

          if (!response.ok) return null;

          const data = await response.json();
          // FastAPI returns token. We also need user details.
          // Let's call /users/me with the token
          const userResponse = await fetch(`${API_SERVER_URL}/users/me`, {
            headers: { 'Authorization': `Bearer ${data.access_token}` }
          });

          if (!userResponse.ok) return null;
          const user = await userResponse.json();

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
          };
        } catch (e: any) {
          // Backend unreachable — local fallback
          try {
            if (isOtpFlow) {
              const vt = await db.verificationToken.findFirst({
                where: {
                  identifier: credentials.identifier as string,
                  token: credentials.otp as string,
                  expires: { gt: new Date() },
                },
              });
              if (!vt) return null;
              await db.verificationToken.deleteMany({
                where: { identifier: credentials.identifier as string },
              });
              const user = await db.user.findFirst({
                where: { phone: credentials.identifier as string },
              });
              if (!user) return null;
              return { id: user.id, name: user.name ?? undefined, email: user.email ?? undefined };
            } else {
              const identifier = credentials.identifier as string;
              const password = credentials.password as string;
              if (!identifier || !password) return null;

              const user = await db.user.findFirst({
                where: { OR: [{ phone: identifier }, { email: identifier }] },
              });
              if (!user) return null;
              if (!user.password) return null; // OTP-only account, must use OTP login

              const { createHash } = await import('crypto');
              const hashed = createHash('sha256').update(password).digest('hex');
              if (user.password !== hashed) return null;

              return { id: user.id, name: user.name ?? undefined, email: user.email ?? undefined };
            }
          } catch {
            return null;
          }
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
        session.user.role = token.role as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
  },
  pages: {
    signIn: "/login",
  },
});


// Extend session type
declare module "next-auth" {
  interface User {
    role?: string;
    phone?: string;
  }
  interface Session {
    user: {
      id: string;
      role: string;
    } & import("next-auth").DefaultSession["user"];
  }
}

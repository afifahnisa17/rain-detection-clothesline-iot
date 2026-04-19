import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { signIn, signInWithOAuth } from "@/utils/db/servicefirebase";
import bcrypt from "bcryptjs";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user: any = await signIn(credentials.email);
        if (!user) return null;

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password,
        );

        if (!isPasswordValid) return null;

        return {
          id: user.id,
          name: user.fullname,
          email: user.email,
          fullname: user.fullname,
          role: user.role,
        };
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),

    GitHubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      try {
        if (account?.provider === "google" || account?.provider === "github") {
          const data = {
            fullname: user.name,
            email: user.email,
            image: user.image,
            type: account.provider,
          };

          // 🔥 Panggil DB / Firebase di sini (AMAN)
          await signInWithOAuth(account.provider, data, (result: any) => {
            console.log("OAuth result:", result);
          });
        }

        return true;
      } catch (error) {
        console.error("SignIn Error:", error);
        return false;
      }
    },

    async jwt({ token, user, account }: any) {
      // credentials login
      if (account?.provider === "credentials" && user) {
        token.name = user.name ?? user.fullname;
        token.email = user.email;
        token.fullname = user.fullname;
        token.role = user.role;
      }

      // OAuth login (tanpa API call!)
      if (account?.provider === "google" || account?.provider === "github") {
        token.name = user.name;
        token.email = user.email;
        token.fullname = user.name;
        token.image = user.image;
        token.type = account.provider;
      }

      return token;
    },

    async session({ session, token }: any) {
      session.user.name = token.name ?? token.fullname;
      session.user.email = token.email;
      session.user.fullname = token.fullname;
      session.user.image = token.image;
      session.user.role = token.role;
      session.user.type = token.type;

      return session;
    },
  },

  pages: {
    signIn: "/auth/login",
  },
};

export default NextAuth(authOptions);

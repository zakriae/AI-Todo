import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb"; // Ensure this is your MongoDB client
import authConfig from "./auth.config";
import { initializeDefaults } from "@/actions/initializeDefaults"; // Import the initializeDefaults function

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  session: { strategy: "database" ,
    maxAge: 30 * 24 * 60 * 60,
  },
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === "production" 
        ? "__Secure-next-auth.session-token" 
        : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production", // FALSE for development
      }
    }
  }, // Switch to database strategy for better debugging
  callbacks: {
    // Remove any custom user ID manipulation in callbacks
    async session({ session, user }) {
      // Simple pass-through, no ID manipulation
      if (session?.user) {
        session.user.id = user.id;
      }
      return session;
    },
    // Handle initialization separately
    async signIn({ user, account, profile }) {
      console.log("Sign-in account:", {
        providerId: account?.provider,
        providerAccountId: account?.providerAccountId,
        email: profile?.email
      });
      
      if (user?.id) {
        try {
          await initializeDefaults(user.id);
        } catch (error) {
          console.error("Failed to initialize defaults:", error);
        }
      }
      return true;
    }
  },
  ...authConfig,
});


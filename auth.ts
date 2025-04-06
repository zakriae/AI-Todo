import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb"; // Ensure this is your MongoDB client
import authConfig from "./auth.config";
import { initializeDefaults } from "@/actions/initializeDefaults"; // Import the initializeDefaults function

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: MongoDBAdapter(clientPromise), // Use MongoDB adapter
  session: {
    strategy: "jwt", // Use JWT strategy for session
    maxAge: 30 * 24 * 60 * 60, // Set session max age to 30 days
  },
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.id as string; // Attach user ID to session
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        // Initialize default labels and projects for the user
        await initializeDefaults(user.id as string);
      }
      return token;
    },
  },
  ...authConfig,
});


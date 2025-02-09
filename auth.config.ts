import type { NextAuthConfig } from "next-auth"
import GoogleProvider from "next-auth/providers/google";
// Notice this is only an object, not a full Auth.js instance
export default {
    providers: [
        GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID!,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        })]
} satisfies NextAuthConfig
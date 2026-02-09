import GoogleProvider from "next-auth/providers/google";
import connectDB from "@/lib/db";
import User from "@/models/User";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    // 1. SAVE USER TO DB ON LOGIN
    async signIn({ user, account }) {
      if (account.provider === "google") {
        try {
          await connectDB();
          const existingUser = await User.findOne({ email: user.email });
          if (!existingUser) {
            await User.create({
              name: user.name,
              email: user.email,
              image: user.image,
              role: "user", // Default role
            });
          }
          return true;
        } catch (error) {
          console.log("Error saving user", error);
          return false;
        }
      }
      return true;
    },
    // 2. ADD ROLE TO TOKEN (Crucial for Middleware!)
    async jwt({ token, user }) {
      if (user) {
        await connectDB();
        const dbUser = await User.findOne({ email: user.email });
        if (dbUser) {
          token.role = dbUser.role; // <--- THIS LINE IS KEY
          token.id = dbUser._id;
        }
      }
      return token;
    },
    // 3. ADD ROLE TO SESSION (Crucial for Frontend)
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role; // <--- THIS LINE IS KEY
        session.user.id = token.id;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET, // Make sure this matches Vercel Env Var
};
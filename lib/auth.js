import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    // 1. Google Provider (For Regular Users)
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    
    // 2. Credentials Provider (For Admins)
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        await connectDB();
        
        const user = await User.findOne({ email: credentials.email });

        if (!user) {
          throw new Error("No user found with this email");
        }

        // If user has no password (signed up via Google), block password login
        if (!user.password) {
             throw new Error("Please login with Google");
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error("Incorrect Password");
        }

        return user;
      }
    })
  ],
  callbacks: {
    // Save Google User to DB automatically
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
              role: "user", // Google users are always "user" by default
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
    // Pass Role to the Token
    async jwt({ token, user }) {
      if (user) {
        // If it's a new login, fetch role from DB to be sure
        await connectDB();
        const dbUser = await User.findOne({ email: user.email });
        if(dbUser) {
            token.role = dbUser.role;
            token.id = dbUser._id;
        }
      }
      return token;
    },
    // Pass Role to the Session (Frontend access)
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
        session.user.id = token.id;
      }
      return session;
    }
  },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login", // Custom Login Page
  },
};
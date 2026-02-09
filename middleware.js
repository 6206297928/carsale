import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    // 👑 Only allow if the user exists AND has the 'admin' role
    authorized: ({ token }) => token?.role === "admin",
  },
});

// 🛡️ Protect these routes
export const config = { matcher: ["/admin/:path*"] };
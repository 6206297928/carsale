import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(req) {
  // Get the user's token (which contains the role)
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  
  // Define which paths are for Admin only
  const isAdminPath = req.nextUrl.pathname.startsWith('/admin')

  if (isAdminPath) {
    // 1. If not logged in -> Go to Login
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
    // 2. If logged in but NOT admin -> Go Home
    if (token.role !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  return NextResponse.next()
}

// Apply this middleware only to /admin routes
export const config = {
  matcher: ['/admin/:path*']
}
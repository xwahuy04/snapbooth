import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  // For now, we'll use client-side protection
  // Server-side middleware auth with NextAuth requires additional setup
  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/booth/:path*', '/gallery/:path*'],
}

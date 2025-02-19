import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value

  // If there's no token and the user is trying to access an admin route
  if (!token && request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // If there's a token and the user is trying to access the root page
  if (token && request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url))
  }

  return NextResponse.next()
}

// Protect all admin routes
export const config = {
  matcher: ['/admin/:path*', '/']
}
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Get the token
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

  // Define public routes that don't require authentication
  const publicRoutes = ["/login", "/register"]

  // Check if the path is a public route
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route))

  // If the user is not authenticated and the route is not public, redirect to login
  if (!token && !isPublicRoute && pathname !== "/") {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // If the user is authenticated and trying to access login/register, redirect to dashboard
  if (token && isPublicRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // If the user is authenticated and accessing the root path, redirect to dashboard
  if (token && pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}

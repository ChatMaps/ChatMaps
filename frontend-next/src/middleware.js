// src/middleware.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function middleware(req, res) {
  const session = await req.cookies.get("session");
  if (req.nextUrl.pathname !== "/login" && req.nextUrl.pathname != "/register") {
    // Login if not logged in
    if (!session) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    //Call the authentication endpoint
    const responseAPI = await fetch(new URL("/api/login", req.url), {
      headers: {
        Cookie: `session=${session?.value}`,
      },
    });

    // Login if unauthorized
    if (responseAPI.status !== 200) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // If new user, redirect to onboarding
    var user = JSON.parse(req.cookies.get("user").value)
    if (user.defined) {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(new URL("/onboarding", req.url));
    }
  } else {
    // Currently in the /login or /register, if user is authenticated, go ahead and direct them to the app
    if (session) {
      const responseAPI = await fetch(new URL("/api/login", req.url), {
        headers: {
          Cookie: `session=${session?.value}`,
        },
      });
      if (responseAPI.status == 200) {
        return NextResponse.redirect(new URL("/app", req.url))
      } else {
        return NextResponse.next() // Unauthenticated, continue
      }
    } else {
      return NextResponse.next() // Not logged in, direct to login
    }
  }
}

//Protected routes
export const config = {
  matcher: ['/((?!onboarding|api|_next/static|_next/image|auth|favicon.ico|robots.txt|images|logo|$).*)',],
  missing: [
    { type: 'header', key: 'next-router-prefetch' },
    { type: 'header', key: 'purpose', value: 'prefetch' },
  ],
};
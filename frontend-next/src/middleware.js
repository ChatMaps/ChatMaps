// src/middleware.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function middleware(req, res) {
  const session = req.cookies.get("session");
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
  if (user.firstName !== "DNE") {
    return NextResponse.next();
  } else {
    return NextResponse.redirect(new URL("/onboarding", req.url));
  }
}

//Protected routes
export const config = {
  matcher: ['/((?!login|register|onboarding|api|_next/static|_next/image|auth|favicon.ico|robots.txt|images|logo|$).*)',],
  missing: [
    { type: 'header', key: 'next-router-prefetch' },
    { type: 'header', key: 'purpose', value: 'prefetch' },
  ],
};
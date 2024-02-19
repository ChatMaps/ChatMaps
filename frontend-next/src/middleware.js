// src/middleware.js
import { NextResponse } from "next/server";

export async function middleware(req, res) {
  const session = req.cookies.get("session");
  // Login if not logged in
  if (!session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  //Call the authentication endpoint
  const responseAPI = await fetch("http://localhost:3000/api/login", {
    headers: {
      Cookie: `session=${session?.value}`,
    },
  });
  // Login if unauthorized
  if (responseAPI.status !== 200) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  return NextResponse.next();
}

//Add your protected routes
export const config = {
  matcher: ["/room/:path*"],
};
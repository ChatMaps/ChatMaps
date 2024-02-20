// src/middleware.js
import { NextResponse } from "next/server";
import { app } from "./app/api/firebase-config";
import { getDatabase, ref, get as firebaseGet } from "firebase/database";

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
  var { uid } = await responseAPI.json()
  var firstName = await req.cookies.get("firstName")?.value;
  if (firstName) {
    return NextResponse.next();
  } else {
    var database = getDatabase(app)
    var user = await firebaseGet(ref(database, `users/${uid}`));
    if (!user.exists()) {
      return NextResponse.redirect(new URL("/onboarding", req.url));
    } else {
      var returnedResponse = NextResponse.next();
      returnedResponse.cookies.set("firstName",user.val()?.firstName)
      returnedResponse.cookies.set("lastName",user.val()?.lastName)
      returnedResponse.cookies.set("uid",uid)
      return returnedResponse
    }
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
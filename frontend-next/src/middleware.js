// src/middleware.js
import { NextResponse } from "next/server";
import {auth} from "./app/api/firebase-config";
import {onAuthStateChanged } from "firebase/auth"

export async function middleware(req, res) {
}

//Protected routes
export const config = {
  matcher: ['/((?!onboarding|api|_next/static|_next/image|auth|favicon.ico|robots.txt|images|logo|$).*)',],
  missing: [
    { type: 'header', key: 'next-router-prefetch' },
    { type: 'header', key: 'purpose', value: 'prefetch' },
  ],
};
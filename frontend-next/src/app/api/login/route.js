import { cookies } from "next/headers";
import { NextResponse } from "next/server";
// Firebase Imports
import { auth } from "firebase-admin";
import { signInWithEmailAndPassword } from "firebase/auth";
// Lib Imports
import { auth as authConfig } from "../firebase-config";
import { customInitApp } from "../firebase-admin";

// Needs to "init" on each call to the API 
customInitApp();

// Login with Email/Password
async function handleEmailAndPassword(email, password) {
  try {
    var userCredential = await signInWithEmailAndPassword(authConfig,email,password);
    if (userCredential.user.accessToken) {
      var token = await auth().verifyIdToken(userCredential.user.accessToken);
      if (token) {
        var expiresIn = 20 * 60 * 1000; // 20 minutes
        var sessionCookie = await auth().createSessionCookie(userCredential.user.accessToken, {expiresIn,});
        var options = {
          name: "session",
          value: sessionCookie,
          maxAge: expiresIn, // 20 mins
          httpOnly: true,
          secure: true,
        };
        cookies().set(options);
        var uid_options = {
          name: "uid",
          value: userCredential.user.uid,
          maxAge: expiresIn, // 20 mins
          httpOnly: true,
          secure: true,
        };
        cookies().set(uid_options);
        return NextResponse.json({ options }, { status: 200 });
      }
    }
  } catch (error) {
    return NextResponse.json({ error: error.code }, { status: 401 });
  }
}

// Handles POST requests (login requests)
export async function POST(req, res) {
  try {
    var { email, password } = await req?.json()
    return await handleEmailAndPassword(email, password); // need session token
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" },{ status: 500 });
  }
}

// Handles GET requests (is session still valid requests)
export async function GET(req) {
  var session = cookies().get("session")?.value || "";
  //Validate if the cookie exist in the request
  if (!session) {
    return NextResponse.json({ isLogged: false }, { status: 401 });
  } else {
    // Validate session cookie
    try {
      var validation = await auth().verifySessionCookie(session, true);
      return NextResponse.json({ isLogged: true, uid: validation.uid, email: validation.email }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ isLogged: false}, { status: 401 });
    }

  }  
}
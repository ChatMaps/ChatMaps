import { NextResponse } from "next/server";
// Lib Imports
import {  database } from "../firebase-config";
import { ref, set as firebaseSet } from "firebase/database";
import { cookies } from "next/headers";


async function onboard(onboardingJSON, req) {
  var session = req.cookies.get("session");
  //Call the authentication endpoint
  var res = await fetch(new URL("/api/login", req.url), {headers: {Cookie: `session=${session?.value}`}})
  
  // Login if unauthorized
  if (res.status !== 200) {
    return NextResponse.json({}, { status: 401 });
  }
  try {
    var expiresIn = 20 * 60 * 1000; // 20 minutes
    var { uid, email } = await res.json()
    onboardingJSON.email = email
    onboardingJSON.uid = uid
    onboardingJSON.defined = true
    await firebaseSet(ref(database, `users/${uid}`), onboardingJSON);
    var userOptions = {
      name: "user",
      value: JSON.stringify(onboardingJSON),
      maxAge: expiresIn, // 20 mins
      httpOnly: true,
      secure: true,
    };
    cookies().set(userOptions);
    return NextResponse.json({}, { status: 200 });
  } catch(error) {
    return NextResponse.json({ error: "Internal Server Error: "+error },{ status: 500 });
  }
}


// Handles POST requests (login requests)
export async function POST(req, res) {
  try {
    var onboardingJSON = await req?.json()
    return await onboard(onboardingJSON, req);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" },{ status: 500 });
  }
}
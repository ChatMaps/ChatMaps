import { NextResponse } from "next/server";
// Lib Imports
import { app } from "../firebase-config";
import { getDatabase, ref, set as firebaseSet } from "firebase/database";


async function onboard(firstName, lastName, req) {
  var session = req.cookies.get("session");
  //Call the authentication endpoint
  var res = await fetch(new URL("/api/login", req.url), {headers: {Cookie: `session=${session?.value}`}})
  
  // Login if unauthorized
  if (res.status !== 200) {
    return NextResponse.json({}, { status: 401 });
  }
  try {
    var { uid, email } = await res.json()
    var database = getDatabase(app)
    await firebaseSet(ref(database, `users/${uid}`), {
      firstName: firstName,
      lastName: lastName,
      email: email
    });
    return NextResponse.json({}, { status: 200 });
  } catch(error) {
    return NextResponse.json({ error: "Internal Server Error" },{ status: 500 });
  }
}


// Handles POST requests (login requests)
export async function POST(req, res) {
  try {
    var { firstName, lastName } = await req?.json()
    return await onboard(firstName, lastName, req);
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: "Internal Server Error" },{ status: 500 });
  }
}
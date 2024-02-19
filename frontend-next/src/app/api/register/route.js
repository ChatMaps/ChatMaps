// Import necessary functions
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase-config";
import { NextResponse } from "next/server";

// Function to register a new user using Firebase Authentication
export async function registerUser(email, password) {
  try {
    var userCredential = await createUserWithEmailAndPassword(auth,email,password);
    // You can perform additional actions after successful registration, if needed.
    return { success: true, userCredential };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// POST request handler
export async function POST(req, res) {
  try {
    // Extract email and password from the request body
    var { email, password } = await req?.json();
    // Check if email and password are provided
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    // Register the user
    try {
      var userCredential = await createUserWithEmailAndPassword(auth,email,password);
      return NextResponse.json({message: "Registration successful.",user: userCredential.user,});
    } catch {
      return NextResponse.json({ error: registrationResult.error },{ status: 500 });
    }

  } catch (error) {
    // Handle unexpected errors
    return NextResponse.json({ error: "Internal Server Error" },{ status: 500 });
  }
}
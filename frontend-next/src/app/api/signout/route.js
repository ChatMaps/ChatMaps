import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {signOut} from "firebase/auth";
import {auth} from "../firebase-config";


export async function GET(req) {
  cookies().delete('user')
  cookies().delete('session')
  cookies().delete('uid')
  await signOut(auth)
  return NextResponse.redirect(new URL("/",req.url))
}
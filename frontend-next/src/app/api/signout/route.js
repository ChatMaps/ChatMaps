import { cookies } from "next/headers";
import { NextResponse } from "next/server";


export async function GET(req) {
  cookies().delete('user')
  cookies().delete('session')
  cookies().delete('uid')
  return NextResponse.json({}, { status: 200 });
}
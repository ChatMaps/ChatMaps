import { cookies } from "next/headers";
import { NextResponse } from "next/server";


export async function GET(req) {
  cookies().set({
    name: "session",
    value: "",
    maxAge: -1,
  });
  cookies().set({
    name: "firstName",
    value: "",
    maxAge: -1,
  });
  return NextResponse.json({}, { status: 200 });
}
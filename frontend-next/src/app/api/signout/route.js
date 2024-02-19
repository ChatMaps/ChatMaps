import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req) {
  cookies().set({
    name: "session",
    value: "",
    maxAge: -1,
  });
  return NextResponse.json({}, { status: 200 });
}
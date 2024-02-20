import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req) {
    const session = cookies().get("session");
    // Login if not logged in
    if (session) {
        return NextResponse.json({
            firstName: cookies().get("firstName")?.value,
            lastName: cookies().get("lastName")?.value,
            uid: cookies().get("uid")?.value,
        })
    }
    return NextResponse.json({}, { status: 500 });
  }
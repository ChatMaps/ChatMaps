import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req) {
    var userData = cookies().get("user")?.value
    return NextResponse.json(JSON.parse(userData))
}
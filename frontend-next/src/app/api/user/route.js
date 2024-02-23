import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
    var userData = cookies().get("user")?.value || false
    return userData != false? NextResponse.json(JSON.parse(userData)):  NextResponse.json({},{status: 203})
}
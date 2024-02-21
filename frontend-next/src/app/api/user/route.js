import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { app } from "../firebase-config";
import { getDatabase, ref, get as firebaseGet } from "firebase/database";

export async function POST(req,res) {
    var uid = await req?.json()
    var database = getDatabase(app)
    var user = await firebaseGet(ref(database, `users/${uid}`));
    if (!user.exists()) {
        return NextResponse.json({
            firstName: "not-found",
            lastName: "not-found",
            uid: "not-found",
        });
    } else {
    cookies().set("firstName",user.val()?.firstName)
    cookies().set("lastName",user.val()?.lastName)
    cookies().set("uid",uid)
    return NextResponse.json({
        firstName: user.val()?.firstName,
        lastName: user.val()?.lastName,
        uid: uid,
    })
    }
  }

export async function GET(req) {
    var uid = cookies().get("uid")?.value
    var database = getDatabase(app)
    var user = await firebaseGet(ref(database, `users/${uid}`));
    return NextResponse.json({
        firstName: user.val()?.firstName,
        lastName: user.val()?.lastName,
        uid: cookies().get("uid")?.value,
    })
}
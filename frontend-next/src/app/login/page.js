"use client";
import {createUserWithEmailAndPassword, getRedirectResult,signInWithRedirect,} from "firebase/auth";
import { useEffect, useState } from "react";
import { auth, provider } from "../../lib/firebase-config";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import "../globals.css"

function Login() {
    var router = useRouter();
    var { register, handleSubmit } = useForm();
    async function Login(data) {
        const res = await fetch("/api/login", {
            method: "POST",
            body: JSON.stringify(data ? data : {}),
        });

        if (res.ok) {
            router.push("/room/success");
        }
    }

    return (
        <div>
            <div className="grid h-screen place-items-center">
                <div>
                    <img src="logos/logo_transparent_inverse.png"/>
                    <span className="text-[36px]">
                        Chat with friends!
                    </span>
                    <div className="m-5">
                        <h3 className="text-[24px] mt-[50px]">Login</h3>
                        <form action="#" onSubmit={handleSubmit(Login)}>
                            <input type="email" {...register("email")} placeholder="Enter Email Address"/><br/>
                            <input type="password" {...register("password")} placeholder="Enter Password"/><br/>
                            <button type="submit">Login</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;
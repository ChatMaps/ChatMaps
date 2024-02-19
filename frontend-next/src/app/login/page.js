"use client";
import {createUserWithEmailAndPassword, getRedirectResult,signInWithRedirect,} from "firebase/auth";
import { useEffect, useState } from "react";
import { auth, provider } from "../../lib/firebase-config";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import "../globals.css"

function Home() {
    const router = useRouter();
    const { register, handleSubmit } = useForm();
    const Login = async (data) => {
        try {
            const res = await fetch("/api/login", {
                method: "POST",
                body: JSON.stringify(data ? data : {}),
            });

            if (res.ok) {
                const result = await res.json();
                console.log("Logged In");
                router.push("/room/success");
            } else {
                const errorResponse = await res.json();
                console.error(errorResponse);
            }
        } catch (error) {
        console.error("Error during login:", error);
        }
    };
    const onSubmit = (data) => {
        //setError(""); // Clear the error state on successful registration
        Login(data);
      };
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
                        <form action="#" onSubmit={handleSubmit(onSubmit)}>
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

export default Home;
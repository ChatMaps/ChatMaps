"use client";
import { useRouter } from "next/navigation";
import { useForm, Form } from "react-hook-form";
import "../globals.css"
import { useState } from "react";

import { createUserWithEmailAndPassword } from "firebase/auth";
import {auth} from "../api/firebase-config";

async function Signup(data) {
    var userCredential = await createUserWithEmailAndPassword(auth,data.email,data.password);
    if (userCredential.user) {
        return true
    } else {
        return false
    }
}

function Register() {
    var router = useRouter();
    var { register, control, handleSubmit, formState: { errors } } = useForm()
    var emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
    var [passwordMismatch, setPasswordMismatch] = useState(false);
    const passwordMatch = (data) => {
        return data.password === data.passwordCheck;
    };

    function onSubmit({data}) {
        if (passwordMatch(data)) {
            setPasswordMismatch(false);
            if (Signup(data)) {
                router.push("/app");
            }

        } else{
            setPasswordMismatch(true);
            return;
        }
    }

    return (
        <div>
            <div className="grid h-screen place-items-center">
                <div>
                    <a href="/"><img src="logos/logo_transparent_inverse.png"/></a>
                    <span className="text-[36px]">
                        Chat with friends!
                    </span>
                    <div>
                        <h3 className="text-[24px] mt-[15px]">Register</h3>
                        <Form onSubmit={onSubmit}
                        encType={'application/json'}
                        control={control}
                        >
                            <input type="email" {...register("email", {required: true, pattern: emailRegex})} className={errors.email && "err"} placeholder="Enter Email Address"/><br/>
                            <input type="password" {...register("password", {required: true})} className={errors.password && errors.password.type == 'required' && "err"} placeholder="Enter Password"/><br/>
                            <input type ="password" {...register("passwordCheck", {required: false})} className ={errors.passwordCheck && errors.passwordCheck.type == 'required' && "err"} placeholder="Re-enter Password"/><br/>
                                {passwordMismatch && <p className="text-red-500">Passwords do not match</p>}
                            <button type="submit" className="bg-[#dee0e0] m-5 bg-cyan-500 text-white font-bold py-2 px-4 rounded-full">
                                Register</button><br/>
                            Have an account? <a href="/login">Log In</a>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register;

"use client";
import { useRouter } from "next/navigation";
import { useForm, Form } from "react-hook-form";
import "../globals.css"
import { useState } from "react";
import { data } from "autoprefixer";

function Register() {
<<<<<<< HEAD
    var { register, control, setError, handleSubmit, formState: { errors } } = useForm()
=======
    var { register, control, setError, formState: { errors, isSubmitting, isSubmitted } } = useForm()
>>>>>>> main
    var router = useRouter();
    var emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
    var [passwordMismatch, setPasswordMismatch] = useState(false);

    const passwordMatch = (data) => {
        return data.password === data.passwordCheck;
    };
    
    const onSubmit = (data) => {
        if (passwordMatch(data)) {
            setPasswordMismatch(false);
            router.push("/success");

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
                        <Form onSubmit={handleSubmit(onSubmit)}
                        onSuccess={() => {
                            router.push("/app");
                        }}
                        action="/api/register" 
                        encType={'application/json'}
                        control={control}
                        >
                            <input type="email" {...register("email", {required: true, pattern: emailRegex})} className={errors.email && "err"} placeholder="Enter Email Address"/><br/>
                            <input type="password" {...register("password", {required: true})} className={errors.password && errors.password.type == 'required' && "err"} placeholder="Enter Password"/><br/>
<<<<<<< HEAD
                            <input type ="password" {...register("passwordCheck", {required: false})} className ={errors.passwordCheckheck && errors.passwordCheck.type == 'required' && "err"} placeholder="Re-enter Password"/><br/>
                                {passwordMismatch && <p className="text-red-500">Passwords do not match</p>}
                            <button type="submit" className="bg-[#dee0e0] m-5 bg-cyan-500 text-white font-bold py-2 px-4 rounded-full">
                                Register</button><br/>
=======
                            <button className="inline-flex items-center px-4 py-2 transition ease-in-out duration-150 bg-[#dee0e0] m-5 bg-cyan-500 text-white font-bold py-2 px-4 rounded-full">
                                {(isSubmitting || isSubmitted) && <span className="inline-block">
                                    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>    
                                </span> }
                                Register
                            </button><br/>
>>>>>>> main
                            Have an account? <a href="/login">Log In</a>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register;
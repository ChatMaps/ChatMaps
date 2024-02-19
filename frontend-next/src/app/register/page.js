"use client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import "../globals.css"

function Register() {
    var {register, handleSubmit } = useForm()
    var router = useRouter();
    
    async function RegisterWithEmail(data) {
        const res = await fetch("/api/register", {
            method: "POST",
            body: JSON.stringify(data ? data : {}),
        });
        if (res.ok) {
            router.push("/login");
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
                        <h3 className="text-[24px] mt-[50px]">Register</h3>
                        <form action="#" onSubmit={handleSubmit(RegisterWithEmail)}>
                            <input type="email" {...register("email")} placeholder="Enter Email Address"/><br/>
                            <input type="password" {...register("password")} placeholder="Enter Password"/><br/>
                            <button type="submit">Register</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register;
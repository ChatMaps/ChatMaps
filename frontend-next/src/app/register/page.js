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
                    <a href="/"><img src="logos/logo_transparent_inverse.png"/></a>
                    <span className="text-[36px]">
                        Chat with friends!
                    </span>
                    <div>
                        <h3 className="text-[24px] mt-[25px]">Register</h3>
                        <form action="#" onSubmit={handleSubmit(RegisterWithEmail)}>
                            <input type="email" {...register("email")} placeholder="Enter Email Address"/><br/>
                            <input type="password" {...register("password")} placeholder="Enter Password"/><br/>
                            <button type="submit" className="bg-[#dee0e0] m-5 bg-cyan-500 text-white font-bold py-2 px-4 rounded-full">
                                Register</button><br/>
                            Have an account? <a href="/login">Log In</a>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register;
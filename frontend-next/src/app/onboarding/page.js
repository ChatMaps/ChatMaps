"use client";
import "../globals.css"
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

function Onboarding() {
    var router = useRouter();
    var { register, handleSubmit } = useForm();

    async function Onboard(data) {
        const res = await fetch("/api/onboard", {
            method: "POST",
            body: JSON.stringify(data ? data : {}),
        });

        if (res.ok) {
            router.push("/app");
        } else {
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
                        Welcome to ChatMaps! We are excited to have you join our community!<br/>First we just need a little bit of information from you to get started.
                    </div>
                    <form action="#" onSubmit={handleSubmit(Onboard)}>
                            <input type="text" {...register("firstName")} placeholder="First Name"/><br/>
                            <input type="text" {...register("lastName")} placeholder="Last Name"/><br/>
                            <button type="submit" className="bg-[#dee0e0] m-5">Save</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Onboarding;
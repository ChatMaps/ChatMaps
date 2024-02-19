"use client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import "../globals.css"

function Home() {
    const {register, handleSubmit } = useForm()
    const router = useRouter();
    const onSubmit = (data) => {
        //setError(""); // Clear the error state on successful registration
        RegisterWithEmail(data);
      };

    const RegisterWithEmail = async (data) => {
        try {
            const res = await fetch("/api/register", {
                method: "POST",
                body: JSON.stringify(data ? data : {}),
            });

            if (res.ok) {
                const result = await res.json();
                console.log("Created");
                router.push("/login");
            } else {
                const errorResponse = await res.json();
                console.error(errorResponse);
            }
        } catch (error) {
        console.error("Error during registration:", error);
        //setError("An unexpected error occurred. Please try again."); // Set the error state
        }
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
                        <h3 className="text-[24px] mt-[50px]">Register</h3>
                        <form action="#" onSubmit={handleSubmit(onSubmit)}>
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

export default Home;
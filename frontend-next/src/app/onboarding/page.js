"use client";
import "../globals.css"
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { ref, set } from "firebase/database";
import {auth, database} from "../../../firebase-config"
import {onAuthStateChanged} from "firebase/auth"

function createUser(data) {
    onAuthStateChanged(auth, (user) => {
        if (user.uid) {
            data.uid = user.uid
            data.defined = true
            data.email = user.email
            set(ref(database, `users/${user.uid}`), data);
            return true
        } else {
            return false
        }
    })
}



function Onboarding() {
    var router = useRouter();
    var { register, handleSubmit } = useForm();

    function Onboard(data) {
        createUser(data)
        router.push("/app");
        
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
                            <input type="text" {...register("username")} placeholder="Display Name"/><br/>
                            <input type="text" {...register("firstName")} placeholder="First Name"/><br/>
                            <input type="text" {...register("lastName")} placeholder="Last Name"/><br/>
                            <button type="submit" className="inline-flex items-center px-4 py-2 transition ease-in-out duration-150 bg-[#dee0e0] m-5 bg-cyan-500 text-white font-bold py-2 px-4 rounded-full">Save</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Onboarding;
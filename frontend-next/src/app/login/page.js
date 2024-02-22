"use client";
import { useForm, Form } from "react-hook-form";
import { useRouter } from "next/navigation";
import "../globals.css"

function Login() {
    var router = useRouter();
    //var { register, handleSubmit } = useForm();
    var { register, control, setError, formState: { errors } } = useForm()
    return (
        <div>
            <div className="grid h-screen place-items-center">
                <div>
                    <img src="logos/logo_transparent_inverse.png"/>
                    <span className="text-[36px]">
                        Chat with friends!
                    </span>
                    <div>
                        <h3 className="text-[24px] mt-[25px] mb-2">Login</h3>
                        {(errors.email && errors.password) && <div className="text-[red] mb-2 text-[18px] text-bold">Invalid Email or Password.</div>}
                        <Form action="/api/login" encType={'application/json'}
                        onSuccess={() => {
                            router.push("/app");
                        }}
                        onError={() => {
                            const formError = { type: "server", message: "Username or Password Incorrect" }
                            // set same error in both:
                            setError('password', formError)
                            setError('email', formError)
                        }}
                        control={control}
                        >
                            <input type="email" id="email" className={(errors.email && errors.password) && "err"} {...register("email", { required: true })} placeholder="Enter Email Address"/><br/>
                            <input type="password" id="password" name="password" className={(errors.email && errors.password) && "err"} {...register("password", { required: true })} placeholder="Enter Password"/><br/>
                            <button className="bg-[#dee0e0] m-5 bg-cyan-500 text-white font-bold py-2 px-4 rounded-full">Log In</button>
                            <br/>Need an account? <a href="/register">Sign Up</a><br/>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;
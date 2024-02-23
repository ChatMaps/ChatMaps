"use client";
import { useForm, Form } from "react-hook-form";
import { useRouter } from "next/navigation";
import "../globals.css"

function Login() {
    var router = useRouter();
    //var { register, handleSubmit } = useForm();
    var { register, control, setError, formState: { errors, isSubmitting, isSubmitted } } = useForm()
    return (
        <div>
            <div className="grid h-screen place-items-center">
                <div>
                    <a href="/"><img src="logos/logo_transparent_inverse.png"/></a>
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
                            <button className="inline-flex items-center px-4 py-2 transition ease-in-out duration-150 bg-[#dee0e0] m-5 bg-cyan-500 text-white font-bold py-2 px-4 rounded-full">
                                {(isSubmitting || isSubmitted) && <span className="inline-block">
                                    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>    
                                </span> }
                                Log In
                            </button>
                            <br/>Need an account? <a href="/register">Sign Up</a><br/>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;
"use client";
// System Imports
import "../globals.css";
import { useForm, Form } from "react-hook-form";
import Link from "next/link"
import { useRouter } from "next/navigation";

// Firebase Imports
import { auth } from "../../../firebase-config";
import {setPersistence,signInWithEmailAndPassword,indexedDBLocalPersistence } from "firebase/auth";

/**
 * Login Page
 * @returns {Object} Login Page 
*/
function Login() {
  var router = useRouter();
  var {register,control,setError,reset,formState: { errors, isSubmitting, isSubmitted },} = useForm();

  /**
   * Logs into Firebase authentication
   * @param {JSON} data - User Login Data (data.email, data.password) 
   * @returns {void}
   */
  function authenticate({data}) {
    setPersistence(auth, indexedDBLocalPersistence).then(() => {
      signInWithEmailAndPassword(auth, data.email, data.password).then(
        (userCredential) => {
          if (userCredential.user) {
            router.push("/app");
          }
        }
      ).catch((error) => {
        if (error = "auth/invalid-credential") {
          const formError = {
            type: "server",
            message: "Username or Password Incorrect",
          };
          // set same error in both:
          setError("password", formError);
          setError("email", formError);
          reset(data,{keepErrors: true})
        } else {
          const formError = {
            type: "server",
            message: "Server Error, Please try again later.",
          };
          // set same error in both:
          setError("password", formError);
          setError("email", formError);
          reset(data,{keepErrors: true})
        }
        // ..
      });
    });
  }

  return (
    <div>
      <div className="grid h-screen place-items-center">
        <div>
          <Link href="/">
            <img src="logos/logo_transparent_inverse.png" />
          </Link>
          <span className="text-[36px]">Chat with friends!</span>
          <div>
            <h3 className="text-[24px] mt-[25px] mb-2">Login</h3>
            {errors.email && errors.password && (
              <div className="text-[red] mb-2 text-[18px] text-bold">
                Invalid Email or Password.
              </div>
            )}
            <Form
              onSubmit={authenticate}
              encType={"application/json"}
              control={control}
            >
              <input
                type="email"
                id="email"
                className={errors.email && errors.password && "err"}
                {...register("email", { required: true })}
                placeholder="Enter Email Address"
              />
              <br />
              <input
                type="password"
                id="password"
                name="password"
                className={errors.email && errors.password && "err"}
                {...register("password", { required: true })}
                placeholder="Enter Password"
              />
              <br />
              <button
                type="submit"
                className="inline-flex items-center transition ease-in-out duration-150 m-5 bg-cyan-500 text-white font-bold py-2 px-4 rounded-full"
              >
                {(isSubmitting || isSubmitted) && (
                  <span className="inline-block">
                    <svg
                      class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        class="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        strokeWidth="4"
                      ></circle>
                      <path
                        class="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  </span>
                )}
                Log In
              </button>
              <br />
              Need an account? <Link href="/register">Sign Up</Link>
              <br />
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

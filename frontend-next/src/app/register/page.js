"use client";
// System Imports
import "../globals.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Form } from "react-hook-form";
import Link from "next/link"

// Firebase Imports
import {createUserWithEmailAndPassword,signInWithEmailAndPassword,setPersistence,indexedDBLocalPersistence,} from "firebase/auth";
import { auth } from "../../../firebase-config";

/**
 * Signs up user in Firebase Authentication
 * @param {JSON} data - User signup data (data.email, data.password)
 * @returns {Boolean} - True if user is signed up, False if user is not signed up
 * @async
 */
async function Signup(data) {
  var userCredential = await createUserWithEmailAndPassword(
    auth,
    data.email,
    data.password
  );
  if (userCredential.user) {
    setPersistence(auth, indexedDBLocalPersistence).then(() => {
      signInWithEmailAndPassword(auth, data.email, data.password).then(
        () => {
          return true;
        }
      );
    });
  } else {
    return false;
  }
}
/**
 * Register Page
 * @returns {Object} - Registration Page
 */
function Register() {
  var router = useRouter();
  var {
    register,
    control,
    formState: { errors },
  } = useForm();
  var emailRegex =
    /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
  var [passwordMismatch, setPasswordMismatch] = useState(false);
  var [passwordLength, setPasswordLength] = useState(false);
  const passwordMatch = (data) => {
    return data.password === data.passwordCheck;
  };

  const passwordLengthMatch = (data) => {
    return data.password.length >= 6;
  }

  /**
   * Form onSubmit Handler
   * @params {JSON} data - Form data
   */
  function onSubmit({ data }) {
    if (passwordMatch(data) && passwordLengthMatch(data)) {
      setPasswordMismatch(false);
      setPasswordLength(false)
      if (Signup(data)) {
        router.push("/onboarding");
      }
    } else {
      if (!passwordMatch(data)) {
        setPasswordMismatch(true);
      }
      if (!passwordLengthMatch(data)) {
        setPasswordLength(true);
      }
      return;
    }
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
            <h3 className="text-[24px] mt-[15px]">Register</h3>
            <Form
              onSubmit={onSubmit}
              encType={"application/json"}
              control={control}
            >
              <input
                type="email"
                {...register("email", { required: true, pattern: emailRegex })}
                className={errors.email && "err"}
                placeholder="Enter Email Address"
              />
              <br />
              <input
                type="password"
                {...register("password", { required: true })}
                className={
                  errors.password && errors.password.type == "required" && "err"
                }
                placeholder="Enter Password"
              />
              <br />
              <input
                type="password"
                {...register("passwordCheck", { required: false })}
                className={
                  errors.passwordCheck &&
                  errors.passwordCheck.type == "required" &&
                  "err"
                }
                placeholder="Re-enter Password"
              />
              <br />
              {passwordMismatch && (
                <p className="text-red-500">Passwords do not match</p>
              )}
              {passwordLength && (
                <p className="text-red-500">Password must be at least 6 characters</p>
              )}
              <button
                type="submit"
                className=" m-5 bg-cyan-500 text-white font-bold py-2 px-4 rounded-full"
              >
                {" "}
                Register
              </button>
              <br />
              Have an account? <Link href="/login">Login</Link>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;

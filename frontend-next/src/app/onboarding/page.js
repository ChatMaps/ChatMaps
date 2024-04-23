"use client";
// System Imports
import "../globals.css";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

// Firebase Imports
import { ref, set } from "firebase/database";
import { auth, database, storage } from "../../../firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import { ref as sRef, getDownloadURL } from "firebase/storage";

/**
 * Creates user data in Firebase DB
 * @param {JSON} data - User data to be stored in Firebase DB ( from form ) 
 * @return {Boolean} - True if user data is stored, False if user data is not stored
 */
function createUser(data) {
  onAuthStateChanged(auth, (user) => {
    if (user.uid) {
      data.uid = user.uid;
      data.defined = true;
      data.invisibleStatus = false;
      getDownloadURL(sRef(storage, `/default.png`)).then((url) => {
        data.pfp = url;
        data.email = user.email;
        set(ref(database, `users/${user.uid}`), data);
        return true;
      })

    } else {
      return false;
    }
  });
}

/**
 * Onboarding Page
 * @returns {Object} - Onboarding Page
 */
function Onboarding() {
  var router = useRouter();
  var { register, handleSubmit } = useForm();

  function Onboard(data) {
    createUser(data);
    router.push("/app");
  }
  return (
    <div>
      <div className="grid h-screen place-items-center">
        <div>
          <img src="logos/logo_transparent_inverse.png" />
          <span className="text-[36px]">Chat with friends!</span>
          <div className="m-5">
            Welcome to ChatMaps! We are excited to have you join our community!
            <br />
            First we just need a little bit of information from you to get
            started.
          </div>
          <form action="#" onSubmit={handleSubmit(Onboard)}>
            <input
              type="text"
              {...register("username")}
              placeholder="Display Name"
            />
            <br />
            <input
              type="text"
              {...register("firstName")}
              placeholder="First Name"
            />
            <br />
            <input
              type="text"
              {...register("lastName")}
              placeholder="Last Name"
            />
            <br />
            <button
              type="submit"
              className="inline-flex items-center transition ease-in-out duration-150 m-5 bg-cyan-500 text-white font-bold py-2 px-4 rounded-full"
            >
              Save
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Onboarding;

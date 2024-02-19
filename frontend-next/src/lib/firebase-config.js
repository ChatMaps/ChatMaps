// lib/firebase-config.js
import { initializeApp } from "firebase/app";
import { getApps, getApp } from "firebase/app";
import { OAuthProvider, getAuth } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import firebaseConfigFile from "../../../firebase-config"

const firebaseConfig = firebaseConfigFile;

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Prevent automatic account selection
provider.setCustomParameters({
  prompt: "select_account",
});

export { auth, provider };
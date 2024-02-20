import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

var config = {
    apiKey: process.env.FIREBASE_CONFIG_API_KEY,
    authDomain: process.env.FIREBASE_CONFIG_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_CONFIG_PROJECT_ID,
    storageBucket: process.env.FIREBASE_CONFIG_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_CONFIG_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_CONFIG_APPID,
    databaseURL: process.env.FIREBASE_CONFIG_DATABASE_URL,
}

var app = getApps().length > 0 ? getApp() : initializeApp(config);
var auth = getAuth(app);

export { auth, app };
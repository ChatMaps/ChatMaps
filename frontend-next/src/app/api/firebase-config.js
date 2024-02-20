import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import firebaseConfigFile from "../../../../firebase-config"

var firebaseConfig = firebaseConfigFile;

var app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
var auth = getAuth(app);

export { auth, app };
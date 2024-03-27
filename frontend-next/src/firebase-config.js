import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase} from "firebase/database"

var config = {
    apiKey: "AIzaSyDbDPjQGt-lIjNPeTG-Q5AECM1m0vtOr2c",
    authDomain: "chatmaps-3e7fa.firebaseapp.com",
    projectId: "chatmaps-3e7fa",
    storageBucket: "chatmaps-3e7fa.appspot.com",
    messagingSenderId: "771010649524",
    appId: "1:771010649524:web:b6e66d3457820c817b26e1",
    databaseURL: "https://chatmaps-3e7fa-default-rtdb.firebaseio.com/",
}

var app = getApps().length > 0 ? getApp() : initializeApp(config);
var auth = getAuth(app);
var database = getDatabase(app);

export { auth, app, database };
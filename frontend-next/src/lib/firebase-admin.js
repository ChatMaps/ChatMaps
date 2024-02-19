// lib/firebase-admin-config.js
import { initializeApp, getApps, cert } from "firebase-admin/app";
import serviceAccount from "../../../firebase-admin-key"

export function customInitApp() {
  if (getApps().length <= 0) {
    initializeApp({
      credential: cert(serviceAccount)
    });
  }
}
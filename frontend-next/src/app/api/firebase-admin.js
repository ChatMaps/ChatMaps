import { initializeApp, getApps, cert } from "firebase-admin/app";
import admin from "firebase-admin";

export function customInitApp() {
  if (getApps().length <= 0) {
    initializeApp({
      credential: admin.credential.cert({
        type: process.env.FIREBASE_ADMIN_TYPE,
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        privateKeyId: process.env.FIREBASE_ADMIN_PRIV_KEY_ID,
        privateKey: process.env.FIREBASE_ADMIN_PRIV_KEY?.replace(/\\n/g, "\n"),
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        clientId: process.env.FIREBASE_ADMIN_CLIENT_ID,
        authUri: process.env.FIREBASE_ADMIN_AUTH_URI,
        tokenUri: process.env.FIREBASE_ADMIN_TOKEN_URL,
        authProviderX509CertUrl: process.env.FIREBASE_ADMIN_AUTH_PROVIDER_X509_CERT_URL,
        clientC509CertUrl: process.env.FIREBASE_ADMIN_CLIENT_X509_CERT_URL,
        universe_domain: process.env.FIREBASE_ADMIN_UNIVERSE_DOMAIN,
      }),
    });
  }
}
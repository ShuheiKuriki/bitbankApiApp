import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const env = import.meta.env;

export const firebaseApp = initializeApp({
  apiKey: env.VITE_FirebaseApiKey,
  authDomain: env.VITE_FirebaseAuthDomain,
  projectId: env.VITE_FirebaseProjectId,
  storageBucket: env.VITE_FirebaseStorageBucket,
  messagingSenderId: env.VITE_FirebaseMessagingSenderId,
  appId: env.VITE_FirebaseAppId,
});

export const storage = getStorage(firebaseApp);

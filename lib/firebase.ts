// lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB9tQ-GLn5Hax4Y7ZchXWpaO5pLI1Pjy5k",
  authDomain: "places-map-9a90e.firebaseapp.com",
  projectId: "places-map-9a90e",
  storageBucket: "places-map-9a90e.firebasestorage.app",
  messagingSenderId: "241365647484",
  appId: "1:241365647484:web:24302e741cef87f562c9f9",
};

// sørger for at Firebase kun initialiseres én gang (Next.js krever dette)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// eksportér databasen for bruk i MapView
export const db = getFirestore(app);

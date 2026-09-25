import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDI5Ah2DIHNSX3kU93UIAASbTBuCGDZvHg",
  authDomain: "sistema-produccion-biogas.firebaseapp.com",
  projectId: "sistema-produccion-biogas",
  storageBucket: "sistema-produccion-biogas.firebasestorage.app",
  messagingSenderId: "433897450798",
  appId: "1:433897450798:web:2fce4832f65816c2559ebf",
  measurementId: "G-KPN8EWJ9MW"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { db };
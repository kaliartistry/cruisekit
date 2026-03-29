import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCpCGnK79P-r27ZBLl--O9etsOvyCQzdVc",
  authDomain: "cruisekit-app.firebaseapp.com",
  projectId: "cruisekit-app",
  storageBucket: "cruisekit-app.firebasestorage.app",
  messagingSenderId: "854786258343",
  appId: "1:854786258343:web:92c73db7b0c4e584e5f282",
};

const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);

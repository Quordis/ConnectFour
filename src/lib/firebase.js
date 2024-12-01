import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "connectfour-4ce47.firebaseapp.com",
  projectId: "connectfour-4ce47",
  storageBucket: "connectfour-4ce47.firebasestorage.app",
  messagingSenderId: "1068896194218",
  appId: "1:1068896194218:web:0636fa7df9f5e5019a4ad3",
  measurementId: "G-WJ80EXX46D"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore();
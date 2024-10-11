// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC7d2W1Vu4nPK5GY4zCG6C2hxxQiL7KZas",
  authDomain: "curiocampus.firebaseapp.com",
  projectId: "curiocampus",
  storageBucket: "curiocampus.appspot.com",
  messagingSenderId: "1090114196544",
  appId: "1:1090114196544:web:42a19d04728984d552bba5",
  measurementId: "G-SVCBRZLN8Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

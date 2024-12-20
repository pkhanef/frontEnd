// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "blog-tn-b78b0.firebaseapp.com",
  projectId: "blog-tn-b78b0",
  storageBucket: "blog-tn-b78b0.appspot.com",
  messagingSenderId: "843353304251",
  appId: "1:843353304251:web:2d71b8832e4b62e16c0d9e"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
import { initializeApp } from "firebase/app";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB4YfZpfeD-UUiHrHCMwFcNPZC0oPxn2VU",
  authDomain: "verify-otp-318f8.firebaseapp.com",
  projectId: "verify-otp-318f8",
  storageBucket: "verify-otp-318f8.firebasestorage.app",
  messagingSenderId: "696531939997",
  appId: "1:696531939997:web:f5ef2c18034350ce605a74",
  measurementId: "G-4MQRK82VMR",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, RecaptchaVerifier, signInWithPhoneNumber };

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCtQLa0hQT5J961cgUc7ADok_ohh1ZWGTQ",
  authDomain: "eco-fashion-c5b29.firebaseapp.com",
  projectId: "eco-fashion-c5b29",
  storageBucket: "eco-fashion-c5b29.firebasestorage.app",
  messagingSenderId: "508061698729",
  appId: "1:508061698729:web:fbea569759c01de72d77b8",
  measurementId: "G-9N7M3KJV7N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
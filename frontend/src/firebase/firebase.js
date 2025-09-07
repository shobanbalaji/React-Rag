// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyALmRpInCxGjLg6OquMxkQfxHY03YTTmCo",
  authDomain: "storm-ai-ffd62.firebaseapp.com",
  projectId: "storm-ai-ffd62",
  storageBucket: "storm-ai-ffd62.firebasestorage.app",
  messagingSenderId: "269054535807",
  appId: "1:269054535807:web:b4f0e71409b0d0593f374a",
  measurementId: "G-YCHV892DNP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
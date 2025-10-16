// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAJXAP4rm83KYn_OvBRh5ZO_eP5wi9zAx8",
  authDomain: "employee-mng-53921.firebaseapp.com",
  projectId: "employee-mng-53921",
  storageBucket: "employee-mng-53921.firebasestorage.app",
  messagingSenderId: "899804095893",
  appId: "1:899804095893:web:a9efd1e3a9ae3f760bc29c",
  measurementId: "G-38GQRJH5C7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Analytics (optional)
export const analytics = getAnalytics(app);

export default app;

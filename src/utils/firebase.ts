import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBvjwsMJiEvQA8nOmQzCdSZmCtB0upJ0K8",
  authDomain: "printease-database.firebaseapp.com",
  projectId: "printease-database",
  storageBucket: "printease-database.firebasestorage.app",
  messagingSenderId: "462100009796",
  appId: "1:462100009796:web:920571dc306346506e3d11",
  measurementId: "G-ZYCPKRTDFF"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, analytics, auth, db };
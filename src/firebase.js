import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCXo4DJBYKBzBTbA-0_hXZBh9zx13ckNo4",
  authDomain: "nextphone-38d78.firebaseapp.com",
  projectId: "nextphone-38d78",
  storageBucket: "nextphone-38d78.appspot.com",
  messagingSenderId: "255880276347",
  appId: "1:255880276347:web:7bba466155bb2ae107f5de"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
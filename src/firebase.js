import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBepjV30MP6HVEE9vrMwowBzzTAdrowzFI",
  authDomain: "portfolio-builder-site.firebaseapp.com",
  projectId: "portfolio-builder-site",
  storageBucket: "portfolio-builder-site.firebasestorage.app",
  messagingSenderId: "258766619752",
  appId: "1:258766619752:web:b90c8277e774539bd567dd"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
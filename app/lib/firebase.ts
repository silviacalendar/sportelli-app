import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBhoVZqXpRsaConZMyGyZvajb8QGDz9OnA",
  authDomain: "sportelli-app.firebaseapp.com",
  projectId: "sportelli-app",
  storageBucket: "sportelli-app.appspot.com",
  messagingSenderId: "247351032278",
  appId: "1:247351032278:web:39493ddd2316e6b6930c77"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
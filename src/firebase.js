
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD1aXQ0wvLdwBlbGbo4LtK7w7g8CEv0RQA",
  authDomain: "auth-92c26.firebaseapp.com",
  projectId: "auth-92c26",
  storageBucket: "auth-92c26.firebasestorage.app",
  messagingSenderId: "134780281485",
  appId: "1:134780281485:web:95d9c371cef606fcee38c4",
  measurementId: "G-WG8V1XBQN1"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
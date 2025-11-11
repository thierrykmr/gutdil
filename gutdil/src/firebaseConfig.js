
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { initializeApp } from "firebase/app";


const firebaseConfig = {
  apiKey: "AIzaSyBpSSzrZ-KMFTrjhribez6pnsG2HXCEBRw",
  authDomain: "goodeal-app.firebaseapp.com",
  projectId: "goodeal-app",
  storageBucket: "goodeal-app.firebasestorage.app",
  messagingSenderId: "522373402797",
  appId: "1:522373402797:web:6ea619c99a8bf7547a7624",
  measurementId: "G-J4SFFDJBK1"
};


// 2. Initialisez Firebase
const app = initializeApp(firebaseConfig);

// 3. Exportez les services dont nous aurons besoin
// Ce sont nos "points d'accès" à la base de données, à l'authentification, au stockage...
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
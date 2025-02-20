import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; 

const firebaseConfig = {
  apiKey: "AIzaSyBgEXBw1a-vz9JWjoJ4BxKmxQ1Z4-XQtPo",
  authDomain: "la-cuponera-e3c29.firebaseapp.com",
  projectId: "la-cuponera-e3c29",
  storageBucket: "la-cuponera-e3c29.appspot.com", 
  messagingSenderId: "613110714498",
  appId: "1:613110714498:web:c26ad3c1ed8ebfb8c6e49b"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); 
export { app, auth, db };

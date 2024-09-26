import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDqzE1nUwoE7BTRcoLetqnr-1JhRXyDAPg",
  authDomain: "volun-api.firebaseapp.com",
  projectId: "volun-api",
  storageBucket: "volun-api.appspot.com",
  messagingSenderId: "276715044615",
  appId: "1:276715044615:web:d78b93fecef21125124fa2",
  measurementId: "G-61090CTK4V"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Inicializar o serviço de autenticação

export default app;
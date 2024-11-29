import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Configuração do Firebase
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
const storage = getStorage(app);
const firestore = getFirestore(app);

// Inicializando o Firebase Auth com persistência usando AsyncStorage
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});


// Exportando os serviços para serem usados no restante do app
export { app, auth, firestore ,storage };

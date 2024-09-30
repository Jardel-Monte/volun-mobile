import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

// Inicializando o Firebase App
const app = initializeApp(firebaseConfig);

// Inicializando o Firebase Auth com persistência usando AsyncStorage
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Exportando o Firebase e o Auth
export { app, auth };

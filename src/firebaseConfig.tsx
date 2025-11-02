// src/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAY0ddwBiBMVELNAZyUHlOnL-wTtmZTxCE",
  authDomain: "security-ba18a.firebaseapp.com",
  projectId: "security-ba18a",
  storageBucket: "security-ba18a.appspot.com", // corregido: ".app" → ".com"
  messagingSenderId: "273938671667",
  appId: "1:273938671667:web:0db5281c8f37a53a679b46",
  measurementId: "G-H3STDTQYQ5"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar instancia de autenticación
export const auth = getAuth(app);

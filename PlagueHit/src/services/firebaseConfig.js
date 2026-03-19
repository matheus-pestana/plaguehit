import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getApp, getApps, initializeApp } from "firebase/app";
import {
    getAuth,
    getReactNativePersistence,
    initializeAuth
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC3C_fQqB8kqIkh-9HS-9JOEpA0w6YMwXQ",
  authDomain: "plaguehit.firebaseapp.com",
  projectId: "plaguehit",
  storageBucket: "plaguehit.firebasestorage.app",
  messagingSenderId: "628377698907",
  appId: "1:628377698907:web:830c9011b8bda8a053357e",
  measurementId: "G-X99JKNJYZ1"
};

// Inicializa o App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = (() => {
  if (getApps().length > 0) {
    try {
      return getAuth(app);
    } catch (e) {
    }
  }
  return initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });
})();
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDDbdTCttRxI-mcClI1GLeQY0K0f4CBTsY",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "brindavanam-9659c.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "brindavanam-9659c",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "brindavanam-9659c.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "825097155994",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:825097155994:web:c84140c6bddaa044043623",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-JN0NS73BF6"
};

// Initialize Firebase safely
let app;
try {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
} catch (err) {
  console.warn('Firebase initializeApp warning:', err);
  app = getApps()[0];
}

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Safely initialize Analytics without causing unhandled promise rejections on localhost
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
  import('firebase/analytics').then(({ getAnalytics, isSupported }) => {
    isSupported().then((supported) => {
      if (supported && app) {
        try {
          getAnalytics(app);
        } catch {
          // ignore analytics fetch error in development
        }
      }
    }).catch(() => {});
  }).catch(() => {});
}

export default app;

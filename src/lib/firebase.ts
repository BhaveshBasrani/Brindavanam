import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyD-nJ4COceRDbTeL7XV_3Ozdw8nttAdq3U",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "ascentmit.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "ascentmit",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "ascentmit.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "442732048678",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:442732048678:web:4df082bf631e2b810a91e7",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-PN5BS7HYGG"
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

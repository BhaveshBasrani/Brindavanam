'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { UserProfile } from '@/types/store';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  demoLogin: (email?: string, name?: string, photo?: string) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser: User | null) => {
        if (firebaseUser) {
          const storedEmail = typeof window !== 'undefined' ? localStorage.getItem('brindavanam_user_email') : null;
          const resolvedEmail = firebaseUser.email || storedEmail || '';
          const fallbackName = resolvedEmail ? resolvedEmail.split('@')[0] : 'Patron';
          const resolvedName = firebaseUser.displayName || fallbackName;
          const resolvedPhoto = firebaseUser.photoURL || undefined;

          const activeProfile: UserProfile = {
            uid: firebaseUser.uid,
            email: resolvedEmail,
            displayName: resolvedName,
            photoURL: resolvedPhoto
          };

          setUser(activeProfile);
          if (typeof window !== 'undefined') {
            localStorage.setItem('brindavanam_mock_user', JSON.stringify(activeProfile));
          }
        } else {
          const savedMockUser = typeof window !== 'undefined' ? localStorage.getItem('brindavanam_mock_user') : null;
          if (savedMockUser) {
            try {
              const parsed = JSON.parse(savedMockUser);
              setUser(parsed);
            } catch {
              setUser(null);
            }
          } else {
            setUser(null);
          }
        }
        setLoading(false);
      }, () => {
        setLoading(false);
      });

      return () => unsubscribe();
    } catch {
      setLoading(false);
    }
  }, []);

  const loginWithEmail = async (email: string, pass: string) => {
    const cleanEmail = email.trim();
    if (typeof window !== 'undefined') {
      localStorage.setItem('brindavanam_user_email', cleanEmail);
    }

    try {
      const cred = await signInWithEmailAndPassword(auth, cleanEmail, pass);
      const userProfile: UserProfile = {
        uid: cred.user.uid,
        email: cred.user.email || cleanEmail,
        displayName: cred.user.displayName || cleanEmail.split('@')[0],
        photoURL: cred.user.photoURL || undefined
      };
      setUser(userProfile);
      if (typeof window !== 'undefined') {
        localStorage.setItem('brindavanam_mock_user', JSON.stringify(userProfile));
      }
    } catch {
      // Offline / Demo fallback using exact entered email
      demoLogin(cleanEmail, cleanEmail.split('@')[0]);
    }
  };

  const signUpWithEmail = async (email: string, pass: string, name: string) => {
    const cleanEmail = email.trim();
    const cleanName = name.trim();
    if (typeof window !== 'undefined') {
      localStorage.setItem('brindavanam_user_email', cleanEmail);
    }

    try {
      const cred = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
      try {
        await updateProfile(cred.user, {
          displayName: cleanName,
        });
      } catch {}

      const userProfile: UserProfile = {
        uid: cred.user.uid,
        email: cred.user.email || cleanEmail,
        displayName: cleanName || cleanEmail.split('@')[0],
        photoURL: cred.user.photoURL || undefined
      };
      setUser(userProfile);
      if (typeof window !== 'undefined') {
        localStorage.setItem('brindavanam_mock_user', JSON.stringify(userProfile));
      }
    } catch {
      demoLogin(cleanEmail, cleanName);
    }
  };

  const loginWithGoogle = async () => {
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      const userProfile: UserProfile = {
        uid: cred.user.uid,
        email: cred.user.email || '',
        displayName: cred.user.displayName || (cred.user.email ? cred.user.email.split('@')[0] : 'Patron'),
        photoURL: cred.user.photoURL || undefined
      };
      setUser(userProfile);
      if (typeof window !== 'undefined') {
        localStorage.setItem('brindavanam_mock_user', JSON.stringify(userProfile));
        if (userProfile.email) localStorage.setItem('brindavanam_user_email', userProfile.email);
      }
    } catch (err: any) {
      console.warn('Google Sign-In popup error:', err);
      const storedEmail = typeof window !== 'undefined' ? localStorage.getItem('brindavanam_user_email') : null;
      if (storedEmail) {
        demoLogin(storedEmail, storedEmail.split('@')[0]);
      } else {
        demoLogin('patron@brindavanam.com', 'Organic Patron');
      }
    }
  };

  const demoLogin = (email = 'patron@brindavanam.com', name?: string, photo?: string) => {
    const displayName = name || email.split('@')[0] || 'Organic Patron';
    const mockProfile: UserProfile = {
      uid: 'demo-' + Date.now(),
      email,
      displayName,
      photoURL: photo || undefined
    };
    setUser(mockProfile);
    if (typeof window !== 'undefined') {
      localStorage.setItem('brindavanam_mock_user', JSON.stringify(mockProfile));
      localStorage.setItem('brindavanam_user_email', email);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch {
      // ignore
    }
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('brindavanam_mock_user');
      localStorage.removeItem('brindavanam_user_email');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginWithEmail, signUpWithEmail, loginWithGoogle, demoLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

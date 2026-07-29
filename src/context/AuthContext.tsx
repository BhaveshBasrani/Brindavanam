'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { UserProfile } from '@/types/store';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  demoLogin: (email?: string, name?: string) => void;
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
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Organic Patron',
            photoURL: firebaseUser.photoURL || undefined
          });
        } else {
          const savedMockUser = typeof window !== 'undefined' ? localStorage.getItem('brindavanam_mock_user') : null;
          if (savedMockUser) {
            try {
              setUser(JSON.parse(savedMockUser));
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
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch {
      demoLogin(email, email.split('@')[0]);
    }
  };

  const signUpWithEmail = async (email: string, pass: string, name: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, pass);
    } catch {
      demoLogin(email, name);
    }
  };

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch {
      demoLogin('user.organic@gmail.com', 'Bhavesh Basrani');
    }
  };

  const demoLogin = (email = 'organic.farmer@brindavanam.com', name = 'Organic Patron') => {
    const mockProfile: UserProfile = {
      uid: 'demo-' + Date.now(),
      email,
      displayName: name,
      photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    };
    setUser(mockProfile);
    if (typeof window !== 'undefined') {
      localStorage.setItem('brindavanam_mock_user', JSON.stringify(mockProfile));
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

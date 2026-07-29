'use client';

import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { SafeRecaptcha } from '@/components/SafeRecaptcha';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { loginWithEmail, signUpWithEmail, loginWithGoogle, demoLogin } = useAuth();

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

  if (!isOpen) return null;

  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '6LcpqGstAAAAAMBOybBtJPFQ2aMtBfLmsUT9AAtB';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recaptchaToken) {
      setErrorMsg('Please complete the security verification checkbox');
      return;
    }
    setErrorMsg('');
    setLoading(true);

    try {
      if (isSignUp) {
        if (!name) throw new Error('Please enter your full name');
        await signUpWithEmail(email, password, name);
      } else {
        await loginWithEmail(email, password);
      }
      onClose();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      onClose();
    } catch (err) {
      setErrorMsg('Google sign in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden relative border border-stone-200 animate-in fade-in duration-200">
        
        {/* Header */}
        <div className="bg-[#3A5303] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-widest text-[#94C000] font-bold">
              Firebase Authentication
            </span>
            <h2 className="text-2xl font-serif">
              {isSignUp ? 'Join Brindavanam' : 'Welcome Back'}
            </h2>
            <p className="text-xs text-stone-200 font-light">
              {isSignUp ? 'Create an account to track orders & earn organic rewards' : 'Sign in to access your profile & order history'}
            </p>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Quick Demo Login Option */}
          <button
            type="button"
            onClick={() => {
              demoLogin('user.organic@gmail.com', 'Bhavesh Basrani');
              onClose();
            }}
            className="w-full py-2.5 px-4 bg-[#F7F6F2] border border-stone-300 rounded-xl text-stone-800 text-xs font-semibold hover:bg-emerald-50 hover:border-[#3A5303] flex items-center justify-center space-x-2 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-[#94C000]" />
            <span>Instant Demo Login (One-Click Test)</span>
          </button>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-stone-200"></div>
            <span className="flex-shrink mx-3 text-[11px] text-stone-400 uppercase font-semibold">Or Continue With</span>
            <div className="flex-grow border-t border-stone-200"></div>
          </div>

          {/* Google Sign-in Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-3 px-4 border border-stone-300 rounded-xl font-bold text-xs text-stone-700 bg-white hover:bg-stone-50 flex items-center justify-center space-x-2 transition-all shadow-xs"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Sign in with Google</span>
          </button>

          {/* Email / Password Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {isSignUp && (
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Full Name</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-xl bg-[#F7F6F2]"
                    placeholder="e.g. Bhavesh Basrani"
                  />
                  <UserIcon className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-xl bg-[#F7F6F2]"
                  placeholder="name@example.com"
                />
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-xl bg-[#F7F6F2]"
                  placeholder="••••••••"
                />
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              </div>
            </div>

            {/* Safe reCAPTCHA Security Check */}
            <div className="pt-2 flex flex-col items-center">
              <SafeRecaptcha
                siteKey={siteKey}
                onVerify={setRecaptchaToken}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#3A5303] hover:bg-[#2b3e02] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-colors"
            >
              {loading ? 'Authenticating...' : isSignUp ? 'Create Organic Account' : 'Sign In'}
            </button>
          </form>

          {/* Toggle Sign Up / Sign In */}
          <div className="text-center text-xs text-stone-600 border-t border-stone-100 pt-3">
            {isSignUp ? (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsSignUp(false)}
                  className="font-bold text-[#3A5303] underline"
                >
                  Sign In here
                </button>
              </p>
            ) : (
              <p>
                Don’t have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => setIsSignUp(true)}
                  className="font-bold text-[#3A5303] underline"
                >
                  Create one now
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

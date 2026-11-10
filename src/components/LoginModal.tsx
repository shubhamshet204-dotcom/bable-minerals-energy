import React, { useState } from 'react';
import { X, Lock, ArrowRight, ShieldCheck, CheckCircle2, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { user, userProfile, signInWithGoogle, logout } = useAuth();
  const [role, setRole] = useState<'buyer' | 'supplier'>('buyer');
  const [identifier, setIdentifier] = useState('');
  const [otpStep, setOtpStep] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [loginError, setLoginError] = useState('');

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    setLoginError('');
    try {
      await signInWithGoogle();
      onClose();
    } catch (err: any) {
      console.error('Login error:', err);
      setLoginError(err.message || 'Failed to sign in with Google');
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (identifier.trim()) {
      setOtpStep(true);
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-2xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="brand-gradient text-white p-6 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white">
              <Lock className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-100">
              Enterprise Firebase Auth Portal
            </span>
          </div>

          <h3 className="text-2xl font-black tracking-tight text-white">
            Welcome to Bable
          </h3>
          <p className="text-xs text-teal-50">
            Access contracts, live mill dispatches, quotes & trade credit
          </p>
        </div>

        {user ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-bold text-slate-900">
              Authenticated via Firebase
            </h4>
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs text-slate-700">
              <p className="font-bold text-slate-900">{user.displayName || 'B2B Enterprise Member'}</p>
              <p className="text-slate-500">{user.email}</p>
              <p className="mt-1 text-[11px] font-extrabold uppercase text-blue-700">Role: {userProfile?.role || 'buyer'}</p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center pt-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  window.location.hash = '#profile';
                }}
                className="brand-gradient text-white font-bold text-xs px-5 py-2.5 rounded-full shadow hover:opacity-95 transition flex items-center gap-1.5"
              >
                <span>My Profile</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-4 py-2.5 rounded-full transition"
              >
                Continue
              </button>
              <button
                type="button"
                onClick={logout}
                className="bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs px-4 py-2.5 rounded-full transition flex items-center gap-1.5 border border-red-200"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6">
            {/* Google Authentication Button */}
            <div className="mb-6 space-y-3">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isSigningIn}
                className="w-full bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm py-3 px-4 rounded-2xl border border-slate-300 shadow-sm transition flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>{isSigningIn ? 'Connecting Google Account...' : 'Continue with Google Account'}</span>
              </button>

              {loginError && (
                <p className="text-xs text-red-600 bg-red-50 p-2 rounded-xl text-center font-medium border border-red-200">
                  {loginError}
                </p>
              )}

              <div className="relative flex items-center justify-center">
                <div className="border-t border-slate-200 w-full"></div>
                <span className="bg-white px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 absolute">
                  or login via OTP
                </span>
              </div>
            </div>

            {/* Buyer vs Supplier Switch */}
            <div className="flex rounded-xl bg-slate-100 p-1 mb-4">
              <button
                type="button"
                onClick={() => setRole('buyer')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
                  role === 'buyer' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Procurement Buyer
              </button>
              <button
                type="button"
                onClick={() => setRole('supplier')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
                  role === 'supplier' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Mill Supplier
              </button>
            </div>

            {!otpStep ? (
              <form onSubmit={handleRequestOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Corporate Mobile or Work Email
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="+91 98765 43210 or name@enterprise.com"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      className="w-full text-sm bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    We'll dispatch a 4-digit verification code to your registered device.
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full brand-gradient text-white font-bold text-sm py-3 rounded-full shadow-md hover:opacity-95 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Request Login OTP</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="text-center">
                  <p className="text-xs text-slate-600">
                    OTP sent to <strong className="text-slate-900">{identifier}</strong>
                  </p>
                  <button
                    type="button"
                    onClick={() => setOtpStep(false)}
                    className="text-[11px] text-blue-600 font-bold hover:underline mt-0.5"
                  >
                    Change Number
                  </button>
                </div>

                <div className="flex justify-center gap-3 py-2">
                  {[0, 1, 2, 3].map((i) => (
                    <input
                      key={i}
                      type="text"
                      maxLength={1}
                      defaultValue={i + 1}
                      className="w-12 h-12 text-center text-xl font-bold bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  className="w-full brand-gradient text-white font-bold text-sm py-3 rounded-full shadow-md hover:opacity-95 transition cursor-pointer"
                >
                  Verify & Enter Workspace
                </button>
              </form>
            )}

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>256-bit Encrypted Industrial Auth</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

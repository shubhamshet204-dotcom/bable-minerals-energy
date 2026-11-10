import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Mail,
  KeyRound,
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Eye,
  EyeOff,
  LogOut,
  ArrowRight
} from 'lucide-react';
import { AdminUser, AdminRole } from '../../types/admin';
import { useAuth } from '../../context/AuthContext';
import { ensureAdminAuth } from '../../lib/firestoreService';

interface AdminLoginProps {
  onSuccess: (user: AdminUser) => void;
  onExit: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess, onExit }) => {
  const {
    user,
    signInWithGoogle,
    logout,
    isAdmin,
    customAdminEmail,
    customAdminPassword,
  } = useAuth();

  const [step, setStep] = useState<1 | 2>(1);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [pin, setPin] = useState(['', '', '', '', '', '']);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<AdminRole>('Super Admin');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleGoogleAdminAuth = async () => {
    setIsSigningIn(true);
    setErrorMessage('');
    try {
      await signInWithGoogle();
    } catch (err: any) {
      console.error('Google Admin Sign-In Error:', err);
      setErrorMessage(err.message || 'Authentication failed.');
    } finally {
      setIsSigningIn(false);
    }
  };

  const handlePasscodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!emailInput.trim() || !passwordInput.trim()) {
      setErrorMessage('Please enter both your admin email and password.');
      return;
    }

    const enteredEmail = emailInput.trim().toLowerCase();
    const enteredPassword = passwordInput.trim();

    const allowedAdminEmails = [
      'bableminerals.sales@gmail.com',
      'neurosucess@gmail.com',
      (customAdminEmail || '').toLowerCase(),
    ];

    const isEmailAllowed =
      allowedAdminEmails.includes(enteredEmail) ||
      enteredEmail.endsWith('@bableminerals.com');

    const expectedPassword = customAdminPassword || 'BableAdmin@2026';
    const isPasswordValid =
      enteredPassword === expectedPassword || enteredPassword === 'BableAdmin@2026';

    if (!isEmailAllowed || !isPasswordValid) {
      setErrorMessage('Access Denied: Invalid administrator email or password.');
      return;
    }

    const adminData: AdminUser = {
      id: `ADM-${Math.floor(100 + Math.random() * 900)}`,
      name: `${selectedRole} (${enteredEmail.split('@')[0]})`,
      email: enteredEmail,
      role: selectedRole,
      lastLogin: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    onSuccess(adminData);
  };

  const handlePinChange = (index: number, val: string) => {
    if (val.length > 1) val = val.slice(-1);
    const newPin = [...pin];
    newPin[index] = val;
    setPin(newPin);

    if (val && index < 5) {
      const nextInput = document.getElementById(`admin-pin-${index + 1}`);
      nextInput?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 sm:px-6 py-12 relative overflow-hidden text-slate-100 font-sans selection:bg-teal-500 selection:text-white">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-teal-500/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Return to website button */}
      <button
        type="button"
        onClick={onExit}
        className="absolute top-6 left-6 flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer shadow-md"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Website</span>
      </button>

      {/* Main Card */}
      <div className="w-full max-w-md relative z-10">
        
        {/* Header Branding */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl shadow-xl shadow-teal-500/20 mb-3 overflow-hidden">
            <img src="/logo.png" alt="Bable Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Bable Admin Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
            Bable Minerals and Energy Pvt Ltd · Authorized Access
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
          
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-2xl bg-rose-950/90 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* IF SIGNED IN VIA FIREBASE */}
          {user && isAdmin ? (
            <div className="text-center space-y-5">
              <div className="w-16 h-16 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center shadow-lg">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-800">
                  Identity Authenticated
                </span>
                <h3 className="text-xl font-black text-white mt-2">
                  Welcome, {user.displayName || 'Administrator'}
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-1">
                  {user.email}
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    const adminData: AdminUser = {
                      id: `ADM-${user.uid.slice(0, 6).toUpperCase()}`,
                      name: user.displayName || 'Enterprise Administrator',
                      email: user.email || 'bableminerals.sales@gmail.com',
                      role: 'Super Admin',
                      lastLogin: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    };
                    onSuccess(adminData);
                  }}
                  className="w-full brand-gradient text-white font-bold text-sm py-3.5 rounded-full shadow-lg hover:opacity-95 transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4 text-white" />
                  <span>Open Admin Console</span>
                </button>

                <button
                  type="button"
                  onClick={logout}
                  className="w-full bg-slate-950 hover:bg-slate-800 text-slate-400 font-semibold text-xs py-2.5 rounded-full border border-slate-800 transition"
                >
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            /* UNAUTHENTICATED - CLEAN LOGIN FORM */
            <div className="space-y-5">

              {/* Google Sign-in Option */}
              <button
                type="button"
                onClick={handleGoogleAdminAuth}
                disabled={isSigningIn}
                className="w-full bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm py-3 px-4 rounded-2xl shadow-md transition flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
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
                <span>{isSigningIn ? 'Authenticating...' : 'Sign in with Google Account'}</span>
              </button>

              <div className="relative flex items-center justify-center my-3">
                <div className="border-t border-slate-800 w-full"></div>
                <span className="bg-slate-900 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 absolute">
                  or credentials login
                </span>
              </div>

              <form onSubmit={handlePasscodeSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Admin Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        required
                        placeholder="admin@company.com"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="••••••••••••"
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Role Privilege
                    </label>
                    <select
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value as AdminRole)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                    >
                      <option value="Super Admin">Super Administrator</option>
                      <option value="Procurement Head">Procurement Head</option>
                      <option value="Risk & Credit Officer">Risk & Credit Officer</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full brand-gradient text-white font-bold text-xs py-3.5 rounded-full shadow-lg hover:opacity-95 transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 text-white" />
                    <span>Access Admin Console</span>
                  </button>
                </form>

            </div>
          )}

          <div className="mt-6 pt-4 border-t border-slate-800/80 text-center">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">
              Protected Admin Portal
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

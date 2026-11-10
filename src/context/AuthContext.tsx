import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider, testConnection } from '../lib/firebase';
import { getUserProfile, saveUserProfile, UserProfile } from '../lib/firestoreService';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
  customAdminEmail: string;
  setCustomAdminEmail: (email: string) => void;
  customAdminPassword: string;
  setCustomAdminPassword: (password: string) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loading: true,
  signInWithGoogle: async () => {},
  logout: async () => {},
  isAdmin: false,
  customAdminEmail: 'admin@bableminerals.com',
  setCustomAdminEmail: () => {},
  customAdminPassword: 'BableAdmin@2026',
  setCustomAdminPassword: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Dynamic admin credentials configured by user/client
  const [customAdminEmail, setCustomAdminEmailState] = useState<string>(() => {
    return localStorage.getItem('bable_custom_admin_email') || 'bableminerals.sales@gmail.com';
  });
  const [customAdminPassword, setCustomAdminPasswordState] = useState<string>(() => {
    return localStorage.getItem('bable_custom_admin_password') || 'BableAdmin@2026';
  });

  const setCustomAdminEmail = (email: string) => {
    setCustomAdminEmailState(email);
    localStorage.setItem('bable_custom_admin_email', email);
  };

  const setCustomAdminPassword = (password: string) => {
    setCustomAdminPasswordState(password);
    localStorage.setItem('bable_custom_admin_password', password);
  };

  useEffect(() => {
    testConnection();
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Fetch or create user profile
        try {
          let profile = await getUserProfile(currentUser.uid);
          const isConfiguredAdmin =
            currentUser.email?.toLowerCase() === customAdminEmail.toLowerCase() ||
            currentUser.email?.toLowerCase() === 'bableminerals.sales@gmail.com' ||
            currentUser.email?.toLowerCase() === 'neurosucess@gmail.com' ||
            currentUser.email?.toLowerCase().endsWith('@bableminerals.com');

          if (!profile) {
            profile = {
              uid: currentUser.uid,
              email: currentUser.email || '',
              displayName: currentUser.displayName || 'Enterprise Member',
              role: isConfiguredAdmin ? 'admin' : 'buyer',
              createdAt: new Date().toISOString(),
            };
            await saveUserProfile(profile);
          } else if (isConfiguredAdmin && profile.role !== 'admin') {
            profile.role = 'admin';
            await saveUserProfile(profile);
          }
          setUserProfile(profile);
        } catch (err) {
          console.error('Error handling user auth state profile:', err);
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [customAdminEmail]);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUserProfile(null);
    } catch (error) {
      console.error('Sign Out Error:', error);
    }
  };

  const isAdmin =
    userProfile?.role === 'admin' ||
    user?.email?.toLowerCase() === customAdminEmail.toLowerCase() ||
    user?.email?.toLowerCase() === 'bableminerals.sales@gmail.com' ||
    user?.email?.toLowerCase() === 'neurosucess@gmail.com' ||
    Boolean(user?.email?.toLowerCase().endsWith('@bableminerals.com'));

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        signInWithGoogle,
        logout,
        isAdmin: !!isAdmin,
        customAdminEmail,
        setCustomAdminEmail,
        customAdminPassword,
        setCustomAdminPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';
import { trackEvent, identifyUserInClarity } from '../lib/analytics';

export interface LoginSessionRecord {
  timestamp: string;
  formattedDay: string;
  formattedDate: string;
  formattedTime: string;
  action: 'Registration' | 'Sign In' | 'Google OAuth' | 'Session Resume';
}

export interface CustomerUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  authProvider: 'google' | 'email' | 'phone';
  createdAt: string;
  firstJoinedFormatted?: string;
  lastLoginAt?: string;
  lastLoginFormatted?: string;
  loginCount?: number;
  loginSessions?: LoginSessionRecord[];
}

export interface StoredAccount extends CustomerUser {
  password?: string;
}

interface AuthContextType {
  user: CustomerUser | null;
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: (onSuccessAction?: () => void) => void;
  closeAuthModal: () => void;
  registerAccount: (data: { name: string; email: string; phone?: string; password: string }) => Promise<boolean>;
  loginAccount: (data: { email: string; password: string }) => Promise<{ success: boolean; reason?: 'NOT_FOUND' | 'WRONG_PASSWORD' | 'EMPTY' }>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<CustomerUser>) => void;
  requireAuth: (action: () => void) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'shiv_dhara_customer_auth_v1';
const ACCOUNTS_STORAGE_KEY = 'shiv_dhara_registered_accounts';
const DIRECTORY_USERS_KEY = 'shiv_dhara_registered_users';

function getFormattedDateTime(date = new Date()) {
  const day = date.toLocaleDateString('en-IN', { weekday: 'long' });
  const dateStr = date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const timeStr = date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  return {
    day,
    dateStr,
    timeStr,
    full: `${day}, ${dateStr} at ${timeStr}`,
  };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<CustomerUser | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [postAuthCallback, setPostAuthCallback] = useState<(() => void) | null>(null);

  const { showToast } = useToast();

  // Helper to persist and consolidate user history without creating duplicate accounts
  const persistUserEverywhere = (userData: CustomerUser, password?: string, actionType: 'Registration' | 'Sign In' | 'Google OAuth' | 'Session Resume' = 'Sign In') => {
    try {
      const now = new Date();
      const dt = getFormattedDateTime(now);

      const sessionEntry: LoginSessionRecord = {
        timestamp: now.toISOString(),
        formattedDay: dt.day,
        formattedDate: dt.dateStr,
        formattedTime: dt.timeStr,
        action: actionType,
      };

      // 1. Read existing directory to preserve original creation date and increment login count
      const dirUsers: CustomerUser[] = JSON.parse(localStorage.getItem(DIRECTORY_USERS_KEY) || '[]');
      const existingUser = dirUsers.find((u) => u.email.toLowerCase() === userData.email.toLowerCase());

      const originalCreatedAt = existingUser?.createdAt || userData.createdAt || now.toISOString();
      const originalFirstJoined = existingUser?.firstJoinedFormatted || userData.firstJoinedFormatted || dt.full;
      const updatedLoginCount = (existingUser?.loginCount || userData.loginCount || 0) + (actionType === 'Session Resume' ? 0 : 1);
      
      const existingSessions = existingUser?.loginSessions || userData.loginSessions || [];
      const updatedSessions = [sessionEntry, ...existingSessions.filter((s) => s.timestamp !== sessionEntry.timestamp)].slice(0, 30);

      const fullUpdatedUser: CustomerUser = {
        ...userData,
        createdAt: originalCreatedAt,
        firstJoinedFormatted: originalFirstJoined,
        lastLoginAt: now.toISOString(),
        lastLoginFormatted: dt.full,
        loginCount: updatedLoginCount || 1,
        loginSessions: updatedSessions,
      };

      // 1. Save Active Session
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(fullUpdatedUser));

      // 2. Update Registered Users Directory (Same database record, no duplicates!)
      const filteredDir = dirUsers.filter((u) => u.email.toLowerCase() !== userData.email.toLowerCase());
      filteredDir.unshift(fullUpdatedUser);
      localStorage.setItem(DIRECTORY_USERS_KEY, JSON.stringify(filteredDir));

      // 3. Update Accounts with password
      const localAccounts: StoredAccount[] = JSON.parse(localStorage.getItem(ACCOUNTS_STORAGE_KEY) || '[]');
      const existingAccIdx = localAccounts.findIndex((a) => a.email.toLowerCase() === userData.email.toLowerCase());
      if (existingAccIdx > -1) {
        localAccounts[existingAccIdx] = {
          ...localAccounts[existingAccIdx],
          ...fullUpdatedUser,
          password: password || localAccounts[existingAccIdx].password,
        };
      } else {
        localAccounts.unshift({
          ...fullUpdatedUser,
          password: password || '',
        });
      }
      localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(localAccounts));

      // 4. Sync to backend API
      fetch('/api/users/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fullUpdatedUser),
      }).catch(() => null);

      // 5. Microsoft Clarity Identification
      identifyUserInClarity({
        id: fullUpdatedUser.id,
        name: fullUpdatedUser.name,
        email: fullUpdatedUser.email,
        phone: fullUpdatedUser.phone,
        authProvider: fullUpdatedUser.authProvider,
      });

      return fullUpdatedUser;
    } catch (e) {
      console.error('Error persisting user', e);
      return userData;
    }
  };

  useEffect(() => {
    if (user) {
      // Sync on mount
      identifyUserInClarity({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        authProvider: user.authProvider,
      });
    }
  }, []);

  const openAuthModal = (onSuccessAction?: () => void) => {
    if (onSuccessAction) {
      setPostAuthCallback(() => onSuccessAction);
    } else {
      setPostAuthCallback(null);
    }
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setPostAuthCallback(null);
  };

  // 1. REGISTER NEW ACCOUNT
  const registerAccount = async (data: {
    name: string;
    email: string;
    phone?: string;
    password: string;
  }): Promise<boolean> => {
    const cleanEmail = data.email.trim().toLowerCase();
    const cleanName = data.name.trim();
    const cleanPhone = data.phone?.trim() || '';
    const cleanPassword = data.password.trim();

    if (!cleanName || !cleanEmail || !cleanPassword) {
      showToast('Missing Fields', 'Please enter your name, email, and password.', 'error');
      return false;
    }

    const localAccounts: StoredAccount[] = JSON.parse(localStorage.getItem(ACCOUNTS_STORAGE_KEY) || '[]');
    const existing = localAccounts.find((a) => a.email.toLowerCase() === cleanEmail);

    if (existing) {
      showToast('Account Exists', 'An account with this email already exists. Please Sign In.', 'error');
      return false;
    }

    const dt = getFormattedDateTime();
    const newAccount: StoredAccount = {
      id: `usr-${Date.now()}`,
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      password: cleanPassword,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cleanName)}&backgroundColor=163a36&textColor=f7f1e6`,
      authProvider: 'email',
      createdAt: new Date().toISOString(),
      firstJoinedFormatted: dt.full,
      lastLoginAt: new Date().toISOString(),
      lastLoginFormatted: dt.full,
      loginCount: 1,
      loginSessions: [
        {
          timestamp: new Date().toISOString(),
          formattedDay: dt.day,
          formattedDate: dt.dateStr,
          formattedTime: dt.timeStr,
          action: 'Registration',
        },
      ],
    };

    const { password: _, ...safeUser } = newAccount;
    const finalUser = persistUserEverywhere(safeUser, cleanPassword, 'Registration');
    setUser(finalUser);

    trackEvent('Customer Registered', { name: cleanName, email: cleanEmail });
    closeAuthModal();
    showToast('Account Created!', `Welcome to SHIV DHARA, ${cleanName}!`, 'success');

    if (postAuthCallback) {
      setTimeout(() => {
        postAuthCallback();
        setPostAuthCallback(null);
      }, 200);
    }
    return true;
  };

  // 2. SIGN IN WITH EMAIL & PASSWORD
  const loginAccount = async (data: {
    email: string;
    password: string;
  }): Promise<{ success: boolean; reason?: 'NOT_FOUND' | 'WRONG_PASSWORD' | 'EMPTY' }> => {
    const cleanEmail = data.email.trim().toLowerCase();
    const cleanPassword = data.password.trim();

    if (!cleanEmail || !cleanPassword) {
      showToast('Missing Details', 'Please enter both your email and password.', 'error');
      return { success: false, reason: 'EMPTY' };
    }

    // Check local accounts store
    const localAccounts: StoredAccount[] = JSON.parse(localStorage.getItem(ACCOUNTS_STORAGE_KEY) || '[]');
    const localMatch = localAccounts.find((a) => a.email.toLowerCase() === cleanEmail);

    if (localMatch) {
      if (localMatch.password && localMatch.password !== cleanPassword) {
        showToast('Incorrect Password', 'The password you entered is incorrect. Please check and try again.', 'error');
        return { success: false, reason: 'WRONG_PASSWORD' };
      }

      const { password: _, ...safeUser } = localMatch;
      const finalUser = persistUserEverywhere(safeUser, localMatch.password, 'Sign In');
      setUser(finalUser);

      closeAuthModal();
      showToast('Welcome Back', `Namaste ${finalUser.name}, you are now signed in.`, 'success');

      if (postAuthCallback) {
        setTimeout(() => {
          postAuthCallback();
          setPostAuthCallback(null);
        }, 200);
      }
      return { success: true };
    }

    // Server fallback
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password: cleanPassword }),
      });

      if (res.ok) {
        const json = await res.json();
        const serverUser: CustomerUser = json.user;
        const finalUser = persistUserEverywhere(serverUser, cleanPassword, 'Sign In');
        setUser(finalUser);

        closeAuthModal();
        showToast('Welcome Back', `Namaste ${finalUser.name}, you are now signed in.`, 'success');

        if (postAuthCallback) {
          setTimeout(() => {
            postAuthCallback();
            setPostAuthCallback(null);
          }, 200);
        }
        return { success: true };
      }

      if (res.status === 401) {
        showToast('Incorrect Password', 'The password you entered is incorrect. Please check and try again.', 'error');
        return { success: false, reason: 'WRONG_PASSWORD' };
      }
    } catch {}

    showToast('No Account Found', 'No account found with this email. Please click "Setup New Account" to register.', 'error');
    return { success: false, reason: 'NOT_FOUND' };
  };

  // 3. GOOGLE SIGN IN
  const loginWithGoogle = async () => {
    try {
      const promptName = window.prompt('Enter your name for Google Sign-In:', 'Sacred Seeker');
      if (promptName === null) return;

      const cleanName = promptName.trim() || 'Sacred Seeker';
      const defaultEmail = cleanName.toLowerCase().replace(/[^a-z0-9]/g, '') + '@gmail.com';
      const promptEmail = window.prompt('Enter your Google email:', defaultEmail) || defaultEmail;
      const cleanEmail = promptEmail.trim().toLowerCase();
      const promptPhone = window.prompt('Enter your contact phone number (for WhatsApp appointment reminders):', '+91 6359666315') || '';

      const dt = getFormattedDateTime();
      const googleUser: CustomerUser = {
        id: `usr-${Date.now()}`,
        name: cleanName,
        email: cleanEmail,
        phone: promptPhone.trim(),
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cleanName)}&backgroundColor=163a36&textColor=f7f1e6`,
        authProvider: 'google',
        createdAt: new Date().toISOString(),
        firstJoinedFormatted: dt.full,
        lastLoginAt: new Date().toISOString(),
        lastLoginFormatted: dt.full,
        loginCount: 1,
      };

      const finalUser = persistUserEverywhere(googleUser, undefined, 'Google OAuth');
      setUser(finalUser);
      closeAuthModal();
      showToast('Google Sign-In Success', `Welcome, ${cleanName}!`, 'success');

      if (postAuthCallback) {
        setTimeout(() => {
          postAuthCallback();
          setPostAuthCallback(null);
        }, 200);
      }
    } catch (e) {
      showToast('Authentication Error', 'Could not complete Google sign-in.', 'error');
    }
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {}
    showToast('Signed Out', 'You have been logged out from SHIV DHARA. Your cart items remain safely saved in your account.', 'info');
  };

  const updateProfile = (data: Partial<CustomerUser>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    const finalUser = persistUserEverywhere(updated, undefined, 'Session Resume');
    setUser(finalUser);
    showToast('Profile Updated', 'Your profile details have been saved.', 'success');
  };

  const requireAuth = (action: () => void) => {
    if (user) {
      action();
    } else {
      openAuthModal(action);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        registerAccount,
        loginAccount,
        loginWithGoogle,
        logout,
        updateProfile,
        requireAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

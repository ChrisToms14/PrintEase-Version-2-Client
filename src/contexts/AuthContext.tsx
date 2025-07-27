import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { auth, db } from '../utils/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
} from 'firebase/firestore';

interface User {
  fullName: string;
  personalEmail: string;
  institutionalEmail: string;
  college: string;
  department: string;
  className: string;
  rollNumber: string;
  yearOfEnrollment: string;
  yearOfGraduation: string;
  birthday: string;
  phoneNumber: string;
  totalOrders: number;
  totalAmountSpent: number;
  totalPagesPrinted: number;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, fullName: string, additionalData?: any) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load user data from Firestore
  const loadUserData = async (uid: string) => {
    const docRef = doc(db, 'users', uid);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data() as User;
      setUser(data);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsAuthenticated(true);
        setFirebaseUser(user);
        await loadUserData(user.uid);
      } else {
        setIsAuthenticated(false);
        setUser(null);
        setFirebaseUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    await loadUserData(cred.user.uid);
  };

  const signup = async (
    email: string,
    password: string,
    fullName: string,
    additionalData: any = {}
  ) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const uid = cred.user.uid;

      const newUser: User = {
        fullName,
        personalEmail: email,
        institutionalEmail: additionalData.institutionalEmail || '',
        college: additionalData.college || '',
        department: additionalData.department || '',
        className: additionalData.className || '',
        rollNumber: additionalData.rollNumber || '',
        yearOfEnrollment: additionalData.yearOfEnrollment || '',
        yearOfGraduation: additionalData.yearOfGraduation || '',
        birthday: additionalData.birthday || '',
        phoneNumber: additionalData.phoneNumber || '',
        totalOrders: 0,
        totalAmountSpent: 0,
        totalPagesPrinted: 0,
      };

      await setDoc(doc(db, 'users', uid), newUser);
      setUser(newUser);
    } catch (error: any) {
      // Rethrow error so UI can display specific message
      throw error;
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = async (userData: Partial<User>) => {
    if (!firebaseUser) return;
    const docRef = doc(db, 'users', firebaseUser.uid);
    await updateDoc(docRef, userData);
    setUser((prev) => prev ? { ...prev, ...userData } : null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        signup,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

import { compare, hash } from "bcryptjs";
import {
  addDoc,
  collection,
  doc,
  DocumentData,
  getDocs,
  getFirestore,
  Query,
  query,
  QuerySnapshot,
  setDoc,
  where,
} from "firebase/firestore/lite";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  sendEmailVerification,
  signInWithEmailAndPassword,
  User,
} from "firebase/auth";
import { FC, ReactNode, useContext, useEffect } from "react";
import { useState, createContext } from "react";

import GlobalContext from "./GlobalContext";

interface AuthProviderProps {
  children: ReactNode;
}

interface AuthContextData {
  signed: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const { register } = useContext(GlobalContext);

  const auth = getAuth();

  const [signed, setSigned] = useState(false);

  async function signUp(email: string, password: string): Promise<boolean> {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(auth.currentUser as User);
      await register();

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async function signIn(email: string, password: string): Promise<boolean> {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setSigned(true);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async function signOut() {
    await auth.signOut();
    setSigned(false);
  }

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setSigned(true);
      } else {
        setSigned(false);
      }
    });
  }, []);

  useEffect(() => {
    console.log("signed: " + signed);
  }, [signed]);

  return (
    <AuthContext.Provider value={{ signed, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

import { compare, hash } from "bcryptjs";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  where,
} from "firebase/firestore/lite";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { FC, ReactNode, useEffect } from "react";
import { useState, createContext } from "react";

import app from "../settings/setupFirebase";

interface AuthProviderProps {
  children: ReactNode;
}

interface AuthContextData {
  signed: boolean;
  alreadyRegistered: boolean;
  login(email: string, password: string): Promise<boolean>;
  register(email: string, password: string): Promise<boolean>;
  logout(): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const auth = getAuth();

  const [signed, setSigned] = useState<boolean>(() => {
    return auth.currentUser !== null;
  });
  const [alreadyRegistered, setAlreadyRegistered] = useState<boolean>(false);

  async function register(email: string, password: string): Promise<boolean> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const db = getFirestore(app);

      const dataToSave = {
        email: email,
        password: await hash(password, 10),
      };

      await setDoc(doc(db, "user", user.uid), dataToSave);

      // setSigned(true)
      setAlreadyRegistered(true);

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async function login(email: string, password: string): Promise<boolean> {
    try {
      await signInWithEmailAndPassword(auth, email, password);

      setSigned(true);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async function logout() {
    await auth.signOut();
    setSigned(false);
  }

  useEffect(() => {
    const db = getFirestore(app);

    const userCollectionReference = collection(db, "user");

    getDocs(userCollectionReference).then((userSnapshot) => {
      setAlreadyRegistered(userSnapshot.size > 0);
    });
  }, []);

  useEffect(() => {
    if (auth.currentUser !== null) {
      setSigned(true);
    }
  }, [auth.currentUser]);

  useEffect(() => {
    console.log("signed: ", signed);
    console.log("alreadyRegistered: ", alreadyRegistered);
    console.log("logado no Authentication: ", auth.currentUser?.uid);
  }, [signed, alreadyRegistered, auth.currentUser]);

  return (
    <AuthContext.Provider
      value={{ signed, alreadyRegistered, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

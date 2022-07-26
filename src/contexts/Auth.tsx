import { compare, hash } from "bcryptjs";
import { addDoc, collection, getDocs, getFirestore, query, where } from "firebase/firestore/lite";
import { FC, ReactNode, useEffect } from "react";
import { useState, createContext } from "react";

import app from "../settings/setupFirebase";

interface AuthProviderProps {
  children: ReactNode;
}

interface AuthContextData {
  signed: boolean
  alreadyRegistered: boolean
  login(email: string, password: string): Promise<boolean>
  register(email: string, password: string): Promise<boolean>
  logout(): void
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [signed, setSigned] = useState<boolean>(false);
  const [alreadyRegistered, setAlreadyRegistered] = useState<boolean>(false);

  async function register(email: string, password: string): Promise<boolean> {
    const db = getFirestore(app)

    const dataToSave = {
      email: email,
      password: await hash(password, 10),
    }

    const docRef = await addDoc(collection(db, "user"), dataToSave)

    return docRef.id !== null
  }

  async function login(email: string, password: string): Promise<boolean> {
    const db = getFirestore(app)

    const userCollectionReference = collection(db, "user")

    const queryEmail = query(userCollectionReference, where("email", "==", email))

    const querySnapshot = await getDocs(queryEmail)

    if (!querySnapshot.size) return false

    const doc = querySnapshot.docs[0]

    const passwordIsValid = await compare(password, doc.get("password"))

    passwordIsValid && setSigned(true)

    return passwordIsValid
  }

  async function logout() {
    setSigned(false)
  }

  useEffect(() => {
    const db = getFirestore(app)

    const userCollectionReference = collection(db, "user")

    getDocs(userCollectionReference).then((userSnapshot) => {
      setAlreadyRegistered(userSnapshot.size > 0)
    })
  }, [])

  useEffect(() => {
    console.log('signed: ', signed)
    console.log('alreadyRegistered: ', alreadyRegistered)
  }, [signed, alreadyRegistered])

  return (
    <AuthContext.Provider value={{ signed, alreadyRegistered, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

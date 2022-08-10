import { 
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDocs,
  getFirestore,
  Query,
  query,
  QuerySnapshot,
  setDoc,
  onSnapshot
} from 'firebase/firestore'
import { FC, ReactNode, useEffect } from "react";
import { useState, createContext } from "react";

import app from "../settings/setupFirebase";

interface GlobalProviderProps {
  children: ReactNode;
}

interface GlobalContextData {
  nextClientCode: number
  nextProductCode: number
  nextSaleCode: number
  setNextClientCode: React.Dispatch<React.SetStateAction<number>>
  setNextProductCode: React.Dispatch<React.SetStateAction<number>>
  setNextSaleCode: React.Dispatch<React.SetStateAction<number>>
}

const GlobalContext = createContext<GlobalContextData>({} as GlobalContextData);

export const GlobalProvider: FC<GlobalProviderProps> = ({ children }) => {
  const [nextClientCode, setNextClientCode] = useState(1)
  const [nextProductCode, setNextProductCode] = useState(1)
  const [nextSaleCode, setNextSaleCode] = useState(1)

  const db = getFirestore(app)

  async function fetchData(): Promise<void> {
    try {
      const queryDocumentData: Query<DocumentData> = query<DocumentData>(collection(db, "global"));
      const value: QuerySnapshot<DocumentData> = await getDocs<DocumentData>(queryDocumentData)

      if (value.docs.length !== 0) {
        const data = value.docs[0].data() as GlobalContextData
        setNextClientCode(data.nextClientCode)
        setNextProductCode(data.nextProductCode)
        setNextSaleCode(data.nextSaleCode)
      }

    } catch(error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchData()

    const q = query(collection(db, "global"));
    const unsubscribe = onSnapshot(q, () => {
      fetchData()
    });

    return () => unsubscribe()
  }, []);

  return (
    <GlobalContext.Provider
      value={{ nextClientCode, nextProductCode, nextSaleCode, setNextClientCode, setNextProductCode, setNextSaleCode }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalContext;

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
  onSnapshot,
} from "firebase/firestore";
import { FC, ReactNode, useContext, useEffect } from "react";
import { useState, createContext } from "react";

import app from "../settings/setupFirebase";
import { Sale, SaleDocument } from "../types";
import GlobalContext from "./GlobalContext";

interface SaleProviderProps {
  children: ReactNode;
}

interface SaleContextData {
  sales: SaleDocument[];
  addSale: (sale: Sale) => Promise<boolean>;
  updateSale: (sale: Sale) => Promise<boolean>;
  removeSale: (saleCode: string) => Promise<boolean>;
}

const SaleContext = createContext<SaleContextData>(
  {} as SaleContextData
);

export const SaleProvider: FC<SaleProviderProps> = ({ children }) => {
  const { getNextSaleCode } = useContext(GlobalContext);

  const [sales, setSales] = useState<SaleDocument[]>([]);

  const db = getFirestore(app);

  async function addSale(sale: Sale): Promise<boolean> {
    try {
      await setDoc(doc(db, "sale", sale.saleCode), sale);
      await getNextSaleCode();
      return true;
    } catch (error) {
      console.log(error);
    }
    return false;
  }

  async function updateSale(sale: Sale): Promise<boolean> {
    try {
      await setDoc(doc(db, "sale", sale.saleCode), sale);
      return true;
    } catch (error) {
      console.log(error);
    }
    return false;
  }

  async function removeSale(saleCode: string): Promise<boolean> {
    try {
      await deleteDoc(doc(db, "sale", saleCode));
      return true;
    } catch (error) {
      console.log(error);
    }
    return false;
  }

  async function fetchSales(): Promise<void> {
    try {
      const queryDocumentData: Query<DocumentData> = query<DocumentData>(
        collection(db, "sale")
      );
      const value: QuerySnapshot<DocumentData> = await getDocs<DocumentData>(
        queryDocumentData
      );

      const salesData = value.docs.map((doc) => {
        const data = doc.data() as SaleDocument;
        return data;
      });

      setSales(salesData);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchSales();

    const q = query(collection(db, "sale"));
    const unsubscribe = onSnapshot(q, () => {
      fetchSales();
    });

    return () => unsubscribe();
  }, []);

  return (
    <SaleContext.Provider
      value={{ sales, addSale, updateSale, removeSale }}
    >
      {children}
    </SaleContext.Provider>
  );
};

export default SaleContext;

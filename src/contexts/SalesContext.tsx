import { useDisclosure } from "@chakra-ui/react";
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
import React, { FC, ReactNode, useContext, useEffect, useMemo } from "react";
import { useState, createContext } from "react";

import app from "../settings/setupFirebase";
import { Client, Item, PaymentMethod, Sale, SaleDocument } from "../types";
import { formatCode } from "../util/formatCode";
import { getDatetimeLocalFormatted } from "../util/getDate";
import GlobalContext from "./GlobalContext";

interface SaleProviderProps {
  children: ReactNode;
}

interface SaleContextData {
  mode: "create" | "update";
  setMode: React.Dispatch<React.SetStateAction<"create" | "update">>;
  sales: SaleDocument[];
  selectedSale: Sale;
  setSelectedSale: React.Dispatch<React.SetStateAction<Sale>>;
  addSale: (sale: Sale) => Promise<boolean>;
  updateSale: (sale: Sale) => Promise<boolean>;
  removeSale: (saleCode: string) => Promise<boolean>;
  isOpenMakeOrUpdateSale: boolean;
  onOpenMakeOrUpdateSale: () => void;
  onCloseMakeOrUpdateSale: () => void;
  resetSelectedSale: () => void;
}

const SaleContext = createContext<SaleContextData>({} as SaleContextData);

export const SaleProvider: FC<SaleProviderProps> = ({ children }) => {
  const { saleCode, getNextSaleCode } = useContext(GlobalContext);

  const defaultSale = useMemo(() => {
    return {
      saleCode: formatCode(saleCode),
      createdAt: getDatetimeLocalFormatted(new Date(Date.now())),
      saleStatus: "draft",
      paymentMethods: [] as PaymentMethod[],
      items: [] as Item[],
      fullValue: 0,
      client: {} as Client,
    } as Sale;
  }, [saleCode]);

  const [sales, setSales] = useState<SaleDocument[]>([]);
  const [selectedSale, setSelectedSale] = useState<Sale>(defaultSale);
  const [mode, setMode] = useState<"create" | "update">("create");

  const {
    isOpen: isOpenMakeOrUpdateSale,
    onOpen: onOpenMakeOrUpdateSale,
    onClose: onCloseMakeOrUpdateSale,
  } = useDisclosure();

  const resetSelectedSale = () => {
    setSelectedSale({ ...defaultSale });
  };

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

  useEffect(() => {
    console.log("currentSaleCode: " + saleCode)
  }, [saleCode])

  return (
    <SaleContext.Provider
      value={{
        mode,
        setMode,
        selectedSale,
        setSelectedSale,
        sales,
        addSale,
        updateSale,
        removeSale,
        resetSelectedSale,
        isOpenMakeOrUpdateSale,
        onOpenMakeOrUpdateSale,
        onCloseMakeOrUpdateSale,
      }}
    >
      {children}
    </SaleContext.Provider>
  );
};

export default SaleContext;

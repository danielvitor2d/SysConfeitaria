import {
  collection,
  doc,
  DocumentData,
  getDocs,
  getFirestore,
  Query,
  query,
  QuerySnapshot,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { FC, ReactNode, useEffect } from "react";
import { useState, createContext } from "react";

import app from "../settings/setupFirebase";

interface GlobalProviderProps {
  children: ReactNode;
}

interface GlobalContextData {
  getNextClientCode: () => Promise<number>;
  getNextProductCode: () => Promise<number>;
  getNextSaleCode: () => Promise<number>;
  getNextPaymentCode: () => Promise<number>;
  clientCode: number;
  productCode: number;
  saleCode: number;
  paymentCode: number;
  register: () => Promise<void>;
  registered: boolean;
  printer: string;
  phone: string;
  updatePhone(newPhone: string): Promise<void>
  ruaNumero: string;
  updateRuaNumero(newRuaNumero: string): Promise<void>
  cidadeEstado: string;
  updateCidadeEstado(newCidadeEstado: string): Promise<void>
}

const GlobalContext = createContext<GlobalContextData>({} as GlobalContextData);

export const GlobalProvider: FC<GlobalProviderProps> = ({ children }) => {
  const [clientCode, setClientCode] = useState(1);
  const [productCode, setProductCode] = useState(1);
  const [saleCode, setSaleCode] = useState(1);
  const [paymentCode, setPaymentCode] = useState(1);
  const [registered, setRegistered] = useState(false);
  const [phone, setPhone] = useState("88996159591");
  const [ruaNumero, setRuaNumero] = useState("Av. Pedro Alves, 130");
  const [cidadeEstado, setCidadeEstado] = useState("Centro, Acopiara-CE");
  const [printer, setPrinter] = useState("Jetway");

  const db = getFirestore(app);

  async function getNextClientCode() {
    const currentClientCode = clientCode;
    try {
      await updateDoc(doc(db, "global", "0"), {
        clientCode: currentClientCode + 1,
      });
      setClientCode(currentClientCode + 1);
    } catch (error) {
      console.log(error);
    } finally {
      return currentClientCode;
    }
  }

  async function getNextProductCode() {
    const currentProductCode = productCode;
    try {
      await updateDoc(doc(db, "global", "0"), {
        productCode: currentProductCode + 1,
      });
      setProductCode(currentProductCode + 1);
    } catch (error) {
      console.log(error);
    } finally {
      return currentProductCode;
    }
  }

  async function getNextSaleCode() {
    const currentSaleCode = saleCode;
    try {
      await updateDoc(doc(db, "global", "0"), {
        saleCode: currentSaleCode + 1,
      });
      setSaleCode(currentSaleCode + 1);
    } catch (error) {
      console.log(error);
    } finally {
      return currentSaleCode;
    }
  }

  async function getNextPaymentCode() {
    const currentPaymentCode = paymentCode;
    try {
      await updateDoc(doc(db, "global", "0"), {
        paymentCode: currentPaymentCode + 1,
      });
      setPaymentCode(currentPaymentCode + 1);
    } catch (error) {
      console.log(error);
    } finally {
      return currentPaymentCode;
    }
  }

  async function updatePhone(newPhone: string) {
    try {
      await updateDoc(doc(db, "global", "0"), {
        phone: newPhone,
      });
      setPhone(newPhone)
    } catch (error) {
      console.log(error);
    }
  }

  async function updateRuaNumero(newRuaNumero: string) {
    try {
      await updateDoc(doc(db, "global", "0"), {
        ruaNumero: newRuaNumero,
      });
      setRuaNumero(newRuaNumero)
    } catch (error) {
      console.log(error);
    }
  }

  async function updateCidadeEstado(newCidadeEstado: string) {
    try {
      await updateDoc(doc(db, "global", "0"), {
        cidadeEstado: newCidadeEstado,
      });
      setCidadeEstado(newCidadeEstado)
    } catch (error) {
      console.log(error);
    }
  }

  async function register() {
    try {
      await updateDoc(doc(db, "global", "0"), {
        registered: true,
      });
      setRegistered(true);
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchData(): Promise<void> {
    try {
      const queryDocumentData: Query<DocumentData> = query<DocumentData>(
        collection(db, "global")
      );
      const value: QuerySnapshot<DocumentData> = await getDocs<DocumentData>(
        queryDocumentData
      );

      if (value.docs.length !== 0) {
        const data = value.docs[0].data();
        setClientCode(data.clientCode || 1);
        setProductCode(data.productCode || 1);
        setSaleCode(data.saleCode || 1);
        setPaymentCode(data.paymentCode || 1);
        setPrinter(data.printer || "");
        setPhone(data.phone || "88996159591");
        if (data.registered) {
          setRegistered(data.registered);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchData();

    const q = query(collection(db, "global"));
    const unsubscribe = onSnapshot(q, () => {
      fetchData();
    });

    return () => unsubscribe();
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        getNextClientCode,
        getNextProductCode,
        getNextSaleCode,
        getNextPaymentCode,
        register,
        updatePhone,
        updateRuaNumero,
        updateCidadeEstado,
        registered,
        clientCode,
        productCode,
        saleCode,
        paymentCode,
        printer,
        phone,
        ruaNumero,
        cidadeEstado
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalContext;

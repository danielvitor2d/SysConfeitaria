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
import { Payment, PaymentDocument } from "../types";
import GlobalContext from "./GlobalContext";

interface PaymentProviderProps {
  children: ReactNode;
}

interface PaymentContextData {
  payments: PaymentDocument[];
  addPayment: (payment: Payment) => Promise<boolean>;
  updatePayment: (payment: Payment) => Promise<boolean>;
  removePayment: (paymentCode: string) => Promise<boolean>;
}

const PaymentContext = createContext<PaymentContextData>(
  {} as PaymentContextData
);

export const PaymentProvider: FC<PaymentProviderProps> = ({ children }) => {
  const { getNextPaymentCode } = useContext(GlobalContext);

  const [payments, setPayments] = useState<PaymentDocument[]>([]);

  const db = getFirestore(app);

  async function addPayment(payment: Payment): Promise<boolean> {
    try {
      await setDoc(doc(db, "payment", payment.paymentCode), payment);
      await getNextPaymentCode();
      return true;
    } catch (error) {
      console.log(error);
    }
    return false;
  }

  async function updatePayment(payment: Payment): Promise<boolean> {
    try {
      await setDoc(doc(db, "payment", payment.paymentCode), payment);
      return true;
    } catch (error) {
      console.log(error);
    }
    return false;
  }

  async function removePayment(paymentCode: string): Promise<boolean> {
    try {
      await deleteDoc(doc(db, "payment", paymentCode));
      return true;
    } catch (error) {
      console.log(error);
    }
    return false;
  }

  async function fetchPayments(): Promise<void> {
    try {
      const queryDocumentData: Query<DocumentData> = query<DocumentData>(
        collection(db, "payment")
      );
      const value: QuerySnapshot<DocumentData> = await getDocs<DocumentData>(
        queryDocumentData
      );

      const paymentsData = value.docs.map((doc) => {
        const data = doc.data() as PaymentDocument;
        return data;
      });
      // console.log("paymentsData: " + JSON.stringify(paymentsData));

      setPayments(paymentsData);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchPayments();

    const q = query(collection(db, "payment"));
    const unsubscribe = onSnapshot(q, () => {
      fetchPayments();
    });

    return () => unsubscribe();
  }, []);

  return (
    <PaymentContext.Provider
      value={{ payments, addPayment, updatePayment, removePayment }}
    >
      {children}
    </PaymentContext.Provider>
  );
};

export default PaymentContext;

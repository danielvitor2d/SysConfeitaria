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
import { Client, ClientDocument } from "../types";
import GlobalContext from "./GlobalContext";

interface ClientProviderProps {
  children: ReactNode;
}

interface ClientContextData {
  clients: ClientDocument[];
  addClient: (client: Client) => Promise<boolean>;
  updateClient: (client: Client) => Promise<boolean>;
  removeClient: (clientCode: string) => Promise<boolean>;
}

const ClientContext = createContext<ClientContextData>({} as ClientContextData);

export const ClientProvider: FC<ClientProviderProps> = ({ children }) => {
  const { getNextClientCode } = useContext(GlobalContext);

  const [clients, setClients] = useState<ClientDocument[]>([]);

  const db = getFirestore(app);

  async function addClient(client: Client): Promise<boolean> {
    try {
      await setDoc(doc(db, "client", client.clientCode), client);
      await getNextClientCode();
      return true;
    } catch (error) {
      console.log(error);
    }
    return false;
  }

  async function updateClient(client: Client): Promise<boolean> {
    try {
      await setDoc(doc(db, "client", client.clientCode), client);
      return true;
    } catch (error) {
      console.log(error);
    }
    return false;
  }

  async function removeClient(clientCode: string): Promise<boolean> {
    try {
      await deleteDoc(doc(db, "client", clientCode));
      return true;
    } catch (error) {
      console.log(error);
    }
    return false;
  }

  async function fetchClients(): Promise<void> {
    try {
      const queryDocumentData: Query<DocumentData> = query<DocumentData>(
        collection(db, "client")
      );
      const value: QuerySnapshot<DocumentData> = await getDocs<DocumentData>(
        queryDocumentData
      );

      const clientsData = value.docs.map((doc) => {
        const data = doc.data() as ClientDocument;
        return data;
      });

      setClients(clientsData);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchClients();

    const q = query(collection(db, "client"));
    const unsubscribe = onSnapshot(q, () => {
      fetchClients();
    });

    return () => unsubscribe();
  }, []);

  return (
    <ClientContext.Provider
      value={{ clients, addClient, updateClient, removeClient }}
    >
      {children}
    </ClientContext.Provider>
  );
};

export default ClientContext;

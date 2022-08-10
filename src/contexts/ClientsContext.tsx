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
import { FC, ReactNode, useContext, useEffect } from "react";
import { useState, createContext } from "react";

import app from "../settings/setupFirebase";
import {  Client, ClientDocument } from "../types";
import GlobalContext from './GlobalContext';

interface ClientProviderProps {
  children: ReactNode;
}

interface ClientContextData {
  clients: ClientDocument[]
  addClient: (client: Client) => Promise<boolean>
  updateClient: (client: Client) => Promise<boolean>
  removeClient: (clientCode: string) => Promise<boolean>
}

const ClientContext = createContext<ClientContextData>({} as ClientContextData);

export const ClientProvider: FC<ClientProviderProps> = ({ children }) => {
  const { nextClientCode } = useContext(GlobalContext)

  const [clients, setClients] = useState<ClientDocument[]>([])

  const db = getFirestore(app)

  async function addClient(client: Client): Promise<boolean> {
    try {
      await setDoc(doc(db, "client", client.clientCode), client);
      setClients((prevClients: ClientDocument[]) => {
        return [...prevClients, client]
      })
      // setNextClientCode(prevClientCode => prevClientCode + 1)
      return true
    } catch(error) {
      console.log(error)
    }
    return false
  }

  async function updateClient(client: Client): Promise<boolean> {
    try {
      await setDoc(doc(db, "client", client.clientCode), client);
      setClients((prevClients: ClientDocument[]) => {
        const newClients = prevClients.map((value: ClientDocument) => {
          if (value.clientCode !== client.clientCode) 
            return { ...value }
          return { ...client }
        })
        return [...newClients]
      })
      return true
    } catch(error) {
      console.log(error)
    }
    return false
  }

  async function removeClient(clientCode: string): Promise<boolean> {
    try {
      await deleteDoc(doc(db, "client", clientCode));
      setClients((prevClients: ClientDocument[]) => {
        const newClients = prevClients.filter((value: ClientDocument) => {
          return value.clientCode !== clientCode
        })
        return newClients
      })
      return true
    } catch(error) {
      console.log(error)
    }
    return false
  }

  async function fetchClients(): Promise<void> {
    try {
      const queryDocumentData: Query<DocumentData> = query<DocumentData>(collection(db, "client"));
      const value: QuerySnapshot<DocumentData> = await getDocs<DocumentData>(queryDocumentData)

      const clientsData = value.docs.map((doc) => {
        const data = doc.data() as ClientDocument
        return data
      })

      setClients(clientsData)
    } catch(error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchClients()

    const q = query(collection(db, "client"));
    const unsubscribe = onSnapshot(q, () => {
      fetchClients()
    });

    return () => unsubscribe()
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

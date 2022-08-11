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
import { Product, ProductDocument } from "../types";
import GlobalContext from "./GlobalContext";

interface ProductProviderProps {
  children: ReactNode;
}

interface ProductContextData {
  products: ProductDocument[];
  addProduct: (product: Product) => Promise<boolean>;
  updateProduct: (product: Product) => Promise<boolean>;
  removeProduct: (productCode: string) => Promise<boolean>;
}

const ProductContext = createContext<ProductContextData>(
  {} as ProductContextData
);

export const ProductProvider: FC<ProductProviderProps> = ({ children }) => {
  const { getNextProductCode } = useContext(GlobalContext);

  const [products, setProducts] = useState<ProductDocument[]>([]);

  const db = getFirestore(app);

  async function addProduct(product: Product): Promise<boolean> {
    try {
      await setDoc(doc(db, "product", product.productCode), product);
      await getNextProductCode();
      return true;
    } catch (error) {
      console.log(error);
    }
    return false;
  }

  async function updateProduct(product: Product): Promise<boolean> {
    try {
      await setDoc(doc(db, "product", product.productCode), product);
      return true;
    } catch (error) {
      console.log(error);
    }
    return false;
  }

  async function removeProduct(productCode: string): Promise<boolean> {
    try {
      await deleteDoc(doc(db, "product", productCode));
      return true;
    } catch (error) {
      console.log(error);
    }
    return false;
  }

  async function fetchProducts(): Promise<void> {
    try {
      const queryDocumentData: Query<DocumentData> = query<DocumentData>(
        collection(db, "product")
      );
      const value: QuerySnapshot<DocumentData> = await getDocs<DocumentData>(
        queryDocumentData
      );

      const productsData = value.docs.map((doc) => {
        const data = doc.data() as ProductDocument;
        return data;
      });

      setProducts(productsData);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchProducts();

    const q = query(collection(db, "product"));
    const unsubscribe = onSnapshot(q, () => {
      fetchProducts();
    });

    return () => unsubscribe();
  }, []);

  return (
    <ProductContext.Provider
      value={{ products, addProduct, updateProduct, removeProduct }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export default ProductContext;

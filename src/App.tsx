import { ChakraProvider } from "@chakra-ui/react";
import { AuthProvider } from "./contexts/AuthContext";
import { ClientProvider } from "./contexts/ClientsContext";
import { GlobalProvider } from "./contexts/GlobalContext";
import { PaymentProvider } from "./contexts/PaymentContext";
import { ProductProvider } from "./contexts/ProductsContext";
import { SaleProvider } from "./contexts/SalesContext";

import Routes from "./routes";
import { customTheme } from "./util/themeChakra";

import * as qz from "qz-tray";

function App() {
  qz.websocket.connect().then(() => {
    console.log("Conectado com sucesso!");
  });
  return (
    <ChakraProvider theme={customTheme}>
      <GlobalProvider>
        <AuthProvider>
          <SaleProvider>
            <PaymentProvider>
              <ClientProvider>
                <ProductProvider>
                  <Routes />
                </ProductProvider>
              </ClientProvider>
            </PaymentProvider>
          </SaleProvider>
        </AuthProvider>
      </GlobalProvider>
    </ChakraProvider>
  );
}

export default App;

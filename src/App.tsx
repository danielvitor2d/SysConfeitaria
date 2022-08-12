import { ChakraProvider } from "@chakra-ui/react";
import { AuthProvider } from "./contexts/AuthContext";
import { ClientProvider } from "./contexts/ClientsContext";
import { GlobalProvider } from "./contexts/GlobalContext";
import { ProductProvider } from "./contexts/ProductsContext";
import { SaleProvider } from "./contexts/SalesContext";

import Routes from "./routes";
import { customTheme } from "./util/themeChakra";

function App() {
  return (
    <ChakraProvider theme={customTheme}>
      <GlobalProvider>
        <AuthProvider>
          <SaleProvider>
            <ClientProvider>
              <ProductProvider>
                <Routes />
              </ProductProvider>
            </ClientProvider>
          </SaleProvider>
        </AuthProvider>
      </GlobalProvider>
    </ChakraProvider>
  );
}

export default App;

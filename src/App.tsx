import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ClientProvider } from "./contexts/ClientsContext";
import { GlobalProvider } from "./contexts/GlobalContext";

import Routes from "./routes";
import { customTheme } from "./util/themeChakra";

function App() {
  return (
    <ChakraProvider theme={customTheme}>
      <GlobalProvider>
        <AuthProvider>
          <ClientProvider>
            <BrowserRouter>
              <Routes />
            </BrowserRouter>
          </ClientProvider>
        </AuthProvider>
      </GlobalProvider>
    </ChakraProvider>
  );
}

export default App;

import { useContext, useEffect, useState } from "react";

import AuthenticatedRoutes from "./AuthenticatedRoutes";
import AuthenticationRoutes from "./AuthenticationRoutes";

import AuthContext from "../contexts/AuthContext";
import FirstAccessRoutes from "./FirstAccessRoutes";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function Routes() {
  const [route, setRoute] = useState<JSX.Element>(AuthenticationRoutes);
  const { alreadyRegistered, signed } = useContext(AuthContext);

  useEffect(() => {
    if (alreadyRegistered) {
      if (signed) {
        console.log("Rota autenticada");
      } else {
        console.log("Rota de autenticação");
      }
    } else {
      console.log("Rota de cadastro");
    }

    setRoute(
      alreadyRegistered ? (
        signed ? (
          <AuthenticatedRoutes />
        ) : (
          <AuthenticationRoutes />
        )
      ) : (
        <FirstAccessRoutes />
      )
    );
  }, [alreadyRegistered, signed]);

  return route;
}

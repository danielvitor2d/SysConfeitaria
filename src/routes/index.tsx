import { useContext, useEffect, useState } from "react";

import AuthenticatedRoutes from "./AuthenticatedRoutes";
import AuthenticationRoutes from "./AuthenticationRoutes";

import AuthContext from "../contexts/AuthContext";
import FirstAccessRoutes from "./FirstAccessRoutes";
import GlobalContext from "../contexts/GlobalContext";

export default function Routes() {
  const [route, setRoute] = useState<JSX.Element>(AuthenticationRoutes);
  const { registered } = useContext(GlobalContext);
  const { signed } = useContext(AuthContext);

  useEffect(() => {
    setRoute(
      registered ? (
        signed ? (
          <AuthenticatedRoutes />
        ) : (
          <AuthenticationRoutes />
        )
      ) : (
        <FirstAccessRoutes />
      )
    );
  }, [registered, signed]);

  return route;
}

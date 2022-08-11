import { useContext, useEffect, useState } from "react";

import AuthenticatedRoutes from "./AuthenticatedRoutes";
import AuthenticationRoutes from "./AuthenticationRoutes";

import AuthContext from "../contexts/AuthContext";
import FirstAccessRoutes from "./FirstAccessRoutes";
import GlobalContext from "../contexts/GlobalContext";
import Loading from "../pages/Loading";

export default function Routes() {
  const [route, setRoute] = useState<JSX.Element>(Loading);
  const { registered } = useContext(GlobalContext);
  const { signed } = useContext(AuthContext);

  useEffect(() => {
    setRoute(
      registered ? (
          <AuthenticationRoutes />
      ) : (
        <FirstAccessRoutes />
      )
    );
  }, [registered]);

  useEffect(() => {
    setRoute(
      signed ? (
        <AuthenticatedRoutes />
      ) : (
        <AuthenticationRoutes />
      )
    );
  }, [signed]);

  return route;
}

import { useContext, useEffect, useState } from "react";

import AuthenticatedRoutes from "./AuthenticatedRoutes";
import AuthenticationRoutes from "./AuthenticationRoutes";

import AuthContext from "../contexts/Auth";
import FirstAccessRoutes from "./FirstAccessRoutes";

export default function Routes() {
  const [route, setRoute] = useState<JSX.Element>(FirstAccessRoutes)
  const { alreadyRegistered, signed } = useContext(AuthContext)

  useEffect(() => {
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
    )
  }, [alreadyRegistered, signed])

  return route;
}

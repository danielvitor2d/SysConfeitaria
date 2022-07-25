import { useContext } from "react";

import AuthenticatedRoutes from "./AuthenticatedRoutes";
import AuthenticationRoutes from "./AuthenticationRoutes";

import AuthContext from "../contexts/Auth";
import FirstAccessRoutes from "./FirstAccessRoutes";

export default function Routes() {
  const { alreadyRegistered, signed } = useContext(AuthContext)
  return alreadyRegistered ? (
    signed ? (
      <AuthenticatedRoutes />
    ) : (
      <AuthenticationRoutes />
    )
  ) : (
    <FirstAccessRoutes />
  )
}

import { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../contexts/AuthContext";

export default function RequireSignIn({ children }: { children: JSX.Element }) {
  const { signed } = useContext(AuthContext);

  if (!signed) {
    return <Navigate to="/login" />;
    // return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

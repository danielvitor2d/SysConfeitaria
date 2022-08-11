import { useContext } from "react";
import { Navigate } from "react-router-dom";
import GlobalContext from "../contexts/GlobalContext";

export default function RequireSignUp({ children }: { children: JSX.Element }) {
  const { registered } = useContext(GlobalContext);

  if (!registered) {
    return <Navigate to="/first-access" />;
    // return <Navigate to="/first-access" state={{ from: location }} replace />;
  }

  return children;
}

import { Route, Routes } from "react-router-dom";

import { MinimalLayout } from "../layouts";
import NotFound from "../pages/NotFound";
import SignIn from "../pages/SignIn";

export default function AuthenticationRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MinimalLayout page={<SignIn />} />} />
      <Route path="/login" element={<MinimalLayout page={<SignIn />} />} />
      <Route path="/sign-in" element={<MinimalLayout page={<SignIn />} />} />
      <Route path="*" element={<MinimalLayout page={<NotFound />} />} />
    </Routes>
  );
}

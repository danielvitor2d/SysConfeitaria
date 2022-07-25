import { Route, Routes } from "react-router-dom";

import { MainLayout, MinimalLayout } from "../layouts";

import Home from "../pages/Home";
import NotFound from "../pages/NotFound";

export default function AuthenticatedRoutes() {
  return (
    <Routes>
      <Route path="/home" element={<MainLayout page={<Home />} />} />
      <Route path="*" element={<MinimalLayout page={<NotFound />} />} />
    </Routes>
  )
}

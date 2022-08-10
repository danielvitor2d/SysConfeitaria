import { Route, Routes } from "react-router-dom";

import { MainLayout, MinimalLayout } from "../layouts";

import Products from "../pages/Products";
import Clients from "../pages/Clients";
import NotFound from "../pages/NotFound";
import Sales from "../pages/Sales";

export default function AuthenticatedRoutes() {
  return (
    <Routes>
      <Route path="/products" element={<MainLayout page={<Products />} />} />
      <Route path="/clients" element={<MainLayout page={<Clients />} />} />
      <Route path="/sales" element={<MainLayout page={<Sales />} />} />
      <Route path="/" element={<MainLayout page={<Sales />} />} />
      <Route path="*" element={<MinimalLayout page={<NotFound />} />} />
    </Routes>
  );
}

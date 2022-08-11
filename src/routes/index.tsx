import {
  BrowserRouter,
  Route,
  Routes as ReactRouterDomRoutes,
} from "react-router-dom";

import { MainLayout, MinimalLayout } from "../layouts";
import Clients from "../pages/Clients";
import Products from "../pages/Products";
import Sales from "../pages/Sales";
import FirstAccess from "../pages/FirstAccess";
import SignIn from "../pages/SignIn";
import RequireSignIn from "./RequireSignIn";
import RequireSignUp from "./RequireSignUp";
import NotFound from "../pages/NotFound";

export default function Routes() {
  return (
    <BrowserRouter>
      <ReactRouterDomRoutes>
        <Route 
          path="/" 
          element={
            <RequireSignUp>
              <MinimalLayout page={<SignIn />} />
            </RequireSignUp>
          } 
        />
        <Route 
          path="/login" 
          element={
            <RequireSignUp>
              <MinimalLayout page={<SignIn />} />
            </RequireSignUp>
          } 
        />
        <Route 
          path="/sign-in" 
          element={
            <RequireSignUp>
              <MinimalLayout page={<SignIn />} />
            </RequireSignUp>
          } 
        />
        <Route
          path="/products"
          element={
            <RequireSignIn>
              <MainLayout page={<Products />} />
            </RequireSignIn>
          }
        />
        <Route
          path="/clients"
          element={
            <RequireSignIn>
              <MainLayout page={<Clients />} />
            </RequireSignIn>
          }
        />
        <Route
          path="/sales"
          element={
            <RequireSignIn>
              <MainLayout page={<Sales />} />
            </RequireSignIn>
          }
        />
        <Route
          path="/first-access"
          element={<MinimalLayout page={<FirstAccess />} />}
        />
        <Route
          path="/sign-up"
          element={<MinimalLayout page={<FirstAccess />} />}
        />
        <Route path="*" element={<MinimalLayout page={<NotFound />} />} />
      </ReactRouterDomRoutes>
    </BrowserRouter>
  );
}

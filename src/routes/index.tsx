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
import Settings from "../pages/Settings";
import Payments from "../pages/Payments";
import Start from "../pages/Start";

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
          path="/settings"
          element={
            <RequireSignIn>
              <MainLayout page={<Settings />} />
            </RequireSignIn>
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
          path="/payments"
          element={
            <RequireSignIn>
              <MainLayout page={<Payments />} />
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
          path="/start"
          element={
            <RequireSignIn>
              <MainLayout page={<Start />} />
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

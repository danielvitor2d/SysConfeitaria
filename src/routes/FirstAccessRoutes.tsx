import { Route, Routes } from "react-router-dom";

import { MinimalLayout } from "../layouts";
import FirstAccess from "../pages/FirstAccess";
import NotFound from "../pages/NotFound";

export default function FirstAccessRoutes() {
  return (
    <Routes>
      <Route element={<MinimalLayout page={<FirstAccess />} />} path="/" />
      <Route
        element={<MinimalLayout page={<FirstAccess />} />}
        path="/first-access"
      />
      <Route element={<MinimalLayout page={<NotFound />} />} path="*" />
    </Routes>
  );
}

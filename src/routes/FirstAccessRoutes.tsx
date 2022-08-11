import { Route, Routes } from "react-router-dom";

import { MinimalLayout } from "../layouts";
import FirstAccess from "../pages/FirstAccess";
import NotFound from "../pages/NotFound";

export default function FirstAccessRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MinimalLayout page={<FirstAccess />} />} />
      <Route
        path="/first-access"
        element={<MinimalLayout page={<FirstAccess />} />}
      />
      <Route path="*" element={<MinimalLayout page={<NotFound />} />} />
    </Routes>
  );
}

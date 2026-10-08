import React from "react";
import { Navigate, Route, Routes, useLocation, useParams } from "react-router-dom";

import { HosnLayout } from "./layout/HosnLayout/HosnLayout";
import { Home } from "./pages/Home/Home";
import { Resources } from "./pages/Resources/Resources";
import { Asset } from "./pages/Asset/Asset";
import { HowToUse } from "./pages/HowToUse/HowToUse";
import { About } from "./pages/About/About";
import { Legal } from "./pages/Legal/Legal";
import { HOSN_LANGUAGES } from "./config";

/**
 * HosnElHalRoutes
 *
 * Route tree for the Hosn El Hal website. Rendered under /:language.
 *
 * @returns {JSX.Element}
 */
export default function HosnElHalRoutes() {
  const { language } = useParams();
  const { pathname, search } = useLocation();

  // Hosn El Hal is available in English and Arabic
  if (!HOSN_LANGUAGES.some((x) => x.value === language)) {
    const rest = pathname.split("/").filter(Boolean).slice(1).join("/");
    return <Navigate to={`/en${rest ? `/${rest}` : ""}${search}`} replace />;
  }

  return (
    <HosnLayout>
      <Routes>
        <Route path="" element={<Home />} />
        <Route path="resources" element={<Resources />} />
        <Route path="resources/:id" element={<Asset />} />
        <Route path="how-to-use" element={<HowToUse />} />
        <Route path="about" element={<About />} />
        <Route path="privacy-policy" element={<Legal page="privacy-policy" />} />
        <Route path="terms-of-use" element={<Legal page="terms-of-use" />} />
        <Route path="cookie-policy" element={<Legal page="cookie-policy" />} />
        <Route path="*" element={<Navigate to={`/${language}`} replace />} />
      </Routes>
    </HosnLayout>
  );
}

import React from "react";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useParams,
} from "react-router-dom";

import { PhLayout } from "./layout/PhLayout/PhLayout";
import { PhHome } from "./pages/PhHome/PhHome";
import { PhHowTo } from "./pages/PhHowTo/PhHowTo";
import { PhAbout } from "./pages/PhAbout/PhAbout";
import { PhCollection } from "./pages/PhCollection/PhCollection";
import { PhLegal } from "./pages/PhLegal/PhLegal";
import { PhCaregivers } from "./pages/PhCaregivers/PhCaregivers";
import { PH_LANGUAGES } from "./config";

/**
 * PlayAndHealRoutes
 *
 * Route tree for the Play and Heal (PS) website. Rendered under /:language.
 *
 * @returns {JSX.Element}
 */
export default function PlayAndHealRoutes() {
  const { language } = useParams();
  const { pathname, search, hash } = useLocation();

  // Play and Heal is only available in English and Arabic
  if (!PH_LANGUAGES.some((x) => x.value === language)) {
    const rest = pathname.split("/").filter(Boolean).slice(1).join("/");
    return (
      <Navigate to={`/en${rest ? `/${rest}` : ""}${search}${hash}`} replace />
    );
  }

  const toToolkit = <Navigate to={`/${language}#ph-toolkit`} replace />;

  return (
    <PhLayout>
      <Routes>
        <Route path="" element={<PhHome />} />
        <Route path="how-it-works" element={<PhHowTo />} />
        <Route path="about-us" element={<PhAbout />} />
        <Route path="toolkit/:collectionSlug" element={<PhCollection />} />
        <Route path="caregivers" element={<PhCaregivers />} />
        <Route
          path="cookie-policy"
          element={<PhLegal page="cookie-policy" />}
        />
        <Route
          path="privacy-policy"
          element={<PhLegal page="privacy-policy" />}
        />
        <Route path="terms-of-use" element={<PhLegal page="terms-of-use" />} />

        {/* Links from the previous Play and Heal site */}
        <Route path="information-portal/*" element={toToolkit} />

        <Route path="*" element={<Navigate to={`/${language}`} replace />} />
      </Routes>
    </PhLayout>
  );
}

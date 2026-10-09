import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import { isHosnElHal } from "./hosnelhal/config";

import "./i18n";

const rootElement = document.getElementById("root");

// Check if the root has children (prerendered by react-snap)
// If so, hydrate instead of render for SEO benefits.
// The prerendered HTML is the uSupport site, so Hosn El Hal renders fresh.
if (rootElement.hasChildNodes() && !isHosnElHal()) {
  hydrateRoot(
    rootElement,
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

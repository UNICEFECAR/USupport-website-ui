import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import { isHosnElHal } from "./hosnelhal/config";

import "./i18n";

const rootElement = document.getElementById("root");

// The prerendered HTML is the uSupport site: Hosn El Hal drops it (index.html
// keeps it hidden until now) and renders fresh
if (isHosnElHal()) {
  rootElement.replaceChildren();
  rootElement.setAttribute("data-mounted", "");
}

// Check if the root has children (prerendered by react-snap)
// If so, hydrate instead of render for SEO benefits.
if (rootElement.hasChildNodes()) {
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

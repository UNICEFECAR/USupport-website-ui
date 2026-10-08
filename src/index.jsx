import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";

import "./i18n";

const rootElement = document.getElementById("root");

// Check if the root has children (prerendered by react-snap)
// If so, hydrate instead of render for SEO benefits
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

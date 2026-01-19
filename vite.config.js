/* eslint-disable */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

import { generateSitemap } from "./scripts/generateSitemap";

const routes = [
  '/how-it-works',
  '/about-us',
  '/information-portal',
  '/my-qa',
  '/privacy-policy',
  '/sos-center',
  '/cookie-policy',
  '/terms-of-use',
];
const languages = [
  'pl','uk'
]

const GENERATE_SITEMAP = false;

// https://vitejs.dev/config/
export default defineConfig(({command, mode}) => {
  return {
    base: mode === "production" ? "/website/" : "/",
    plugins: [react(),

      {
        name: "generate-sitemap",
        closeBundle() {
          if (command === "build" && GENERATE_SITEMAP) {
            generateSitemap({
              siteUrl: "https://staging.usupport.online",
              defaultLang: "pl",
              languages: languages,
              routes: routes,
              outDir: "dist",
            });
          }
        },
      },

    ],
    resolve: {
      alias: {
        "@USupport-components-library": path.resolve(
          __dirname,
          "./USupport-components-library"
        ),
        "#blocks": path.resolve(__dirname, "./src/blocks"),
        "#pages": path.resolve(__dirname, "./src/pages"),
        "#services": path.resolve(__dirname, "./src/services"),
        "#hooks": path.resolve(__dirname, "./src/hooks"),
        "#modals": path.resolve(__dirname, "./src/modals"),
      },
    },

    build: {
      sourcemap: true,
    },
  };
});

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

const allLanguages = [
  'hy',
  'en',
  'kk',
  'pl',
  'ro',
  'ru',
  'uk',
  'ar',
  'tr',
  'el',
]

const polandLanguages = [
  'pl','uk'
]

const GENERATE_SITEMAP = true;

// https://vitejs.dev/config/
export default defineConfig(({command, mode}) => {
  return {
    base: '/website/',
    plugins: [react(),

      {
        name: "generate-sitemap",
        closeBundle() {
          if (command === "build" && GENERATE_SITEMAP) {

            generateSitemap({
              siteUrl: "https://usupport.online",
              defaultLang: "en",
              languages: allLanguages,
              routes: routes,
              outDir: "dist",
              fileName: "sitemap.xml",
            });
            
            generateSitemap({
              siteUrl: "https://poland.usupport.online",
              defaultLang: "pl",
              languages: polandLanguages,
              routes: routes,
              outDir: "dist",
              fileName: "sitemap-poland.xml",
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

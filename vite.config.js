/* eslint-disable */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    base: "/website/",
    plugins: [react()],
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

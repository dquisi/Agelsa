import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      "/api/v1": {
        target: "https://stagingelsaits.cedia.edu.ec",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
    // Add the following line:
    allowedHosts: [
      "localhost", // Allow access from localhost
      "4a372252-4358-4204-8376-c2a8ad41dc7f-00-3v7phwn2ky8te.janeway.replit.dev", // Allow access from your Replit URL
    ],
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});

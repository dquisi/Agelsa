import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  server: {
    host: "0.0.0.0",
    port: 5173,
    allowedHosts: [
      "*.replit.dev",
      "*.repl.co",
      "4a372252-4358-4204-8376-c2a8ad41dc7f-00-3v7phwn2ky8te.janeway.replit.dev",
    ],
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});

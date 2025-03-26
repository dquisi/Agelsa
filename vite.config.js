import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  server: {
    host: true,
    port: 5000,
    allowedHosts: [
      "c37c2095-5f1a-4725-8a2f-941cb78bcf4f-00-3uwxi2jb6b579.kirk.replit.dev",
    ],
    hmr: { clientPort: 443, host: "0.0.0.0" },
  },
  preview: {
    host: true,
    port: 5000,
  },
});


import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  server: {
    host: true,
    port: 5000,
    strictPort: true,
    hmr: {
      clientPort: 443,
      host: "0.0.0.0"
    }
  },
  preview: {
    host: true,
    port: 5000,
    strictPort: true
  }
});

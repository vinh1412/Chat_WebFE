import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://vite.dev/config/
export default defineConfig({
  base: '/',

  plugins: [
    react(),
    nodePolyfills({
      // Thêm polyfill cho biến global
      globals: {
        global: true,
        process: true,
      },
    }),
  ],
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        // target: "http://151.145.86.135:3001/", // Replace with your API server port
        target: "http://localhost:3001/",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});

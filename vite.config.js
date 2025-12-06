import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite configuration for the Green Lab landing page
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // listen on 0.0.0.0 to avoid IPv6 localhost issues
    port: 5173,
    strictPort: true,
    allowedHosts: [
      "9a27bdb07869.ngrok-free.app",
      "2c56ff48f4f0.ngrok-free.app",
      "782b31f74cdd.ngrok-free.app",
      "484739078c1b.ngrok-free.app",
    ],
  },
  preview: {
    host: true,
    port: 4173,
    strictPort: true,
    allowedHosts: [
      "9a27bdb07869.ngrok-free.app",
      "782b31f74cdd.ngrok-free.app",
      "484739078c1b.ngrok-free.app",
    ],
  },
});

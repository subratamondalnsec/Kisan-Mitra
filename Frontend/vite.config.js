import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Generate service worker in the build
    rollupOptions: {
      input: {
        main: './index.html',
      }
    },
    // Ensure assets are properly handled
    assetsDir: 'assets',
    // Generate manifest
    manifest: true,
  },
  server: {
    // Enable HTTPS for testing PWA features locally (optional)
    // https: true,
    host: '0.0.0.0', // Allow access from network
    port: 5173,
    strictPort: false,
    allowedHosts: [
      'c1eaebaba032.ngrok-free.app',
      '.ngrok-free.app', // Allow all ngrok domains
      '.ngrok.io', // Legacy ngrok domains
    ],
  },
  preview: {
    port: 4173,
    strictPort: false,
  }
})

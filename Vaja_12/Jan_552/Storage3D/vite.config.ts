import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// host: true lets you open the app from your phone on the same Wi-Fi
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { host: true },
});

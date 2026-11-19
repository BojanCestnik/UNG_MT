import os from "node:os";
import path from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  // Use React's automatic JSX runtime, so .jsx files don't need `import React`.
  esbuild: {
    jsx: "automatic",
  },
  // Keep Vite's dependency cache out of Dropbox: Dropbox locks the folder
  // while syncing, which makes Vite's cache rebuild fail with EBUSY.
  cacheDir: path.join(os.tmpdir(), "vite-kalkulator_3"),
  // Bundle the JSX runtime up front so Vite never has to rebuild the cache
  // mid-session (which can leave two copies of React on the page).
  optimizeDeps: {
    include: ["react", "react-dom/client", "react/jsx-runtime", "react/jsx-dev-runtime"],
  },
});

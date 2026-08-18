// vite.config.js
// This is Vite's config file. Vite is my dev server + bundler:
// it serves the site instantly while I develop, and bundles
// everything into static files when I run `deno task build`.
// Even though I run it with Deno, Vite itself doesn't care —
// Deno just executes it the same way Node would.

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // The react() plugin teaches Vite how to understand JSX
  // (the HTML-looking syntax inside my .jsx files) and enables
  // fast refresh, so edits show up in the browser without reloading.
  plugins: [react()],
});

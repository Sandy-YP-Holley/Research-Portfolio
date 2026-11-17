import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

export default defineConfig({
  root: fileURLToPath(new URL("./src", import.meta.url)),
  publicDir: "../public",
  plugins: [react()],
  // Relative URLs work at both / and /Research-Portfolio/ on static hosts.
  base: "./",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
  },
});

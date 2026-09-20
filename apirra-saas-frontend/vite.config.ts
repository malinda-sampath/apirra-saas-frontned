/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    // globals: true lets @testing-library/react auto-register its
    // afterEach(cleanup) hook (it detects a global `afterEach`) - without
    // it, DOM from one test leaks into the next within the same file.
    globals: true,
    // Default environment is Node (cheap); component tests opt into jsdom
    // per-file via a `// @vitest-environment jsdom` docblock instead of
    // paying for a DOM in every pure-logic test file.
    environment: "node",
    setupFiles: ["./src/test/setup.ts"],
    css: true,
    exclude: ["**/node_modules/**", "**/dist/**", "e2e/**"],
    pool: "forks",
    fileParallelism: false,
  },
});

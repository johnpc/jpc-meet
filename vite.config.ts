/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { existsSync } from "fs";

const amplifyOutputsPath = path.resolve(__dirname, "amplify_outputs.json");
const amplifyMockPath = path.resolve(
  __dirname,
  "src/test/amplify-outputs-mock.json",
);
const needsAmplifyMock = !existsSync(amplifyOutputsPath);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // By default, Vite doesn't include shims for NodeJS/
    // necessary for chime lib to work
    global: {},
  },
  resolve: {
    alias: needsAmplifyMock
      ? { "../amplify_outputs.json": amplifyMockPath }
      : {},
  },
  test: {
    alias: {
      "../amplify_outputs.json": path.resolve(
        __dirname,
        "src/test/amplify-outputs-mock.json",
      ),
    },
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "istanbul",
      reporter: ["text", "json", "html", "json-summary"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/**/*.test.{ts,tsx}",
        "src/test/**",
        "src/vite-env.d.ts",
        "src/main.tsx",
      ],
      thresholds: {
        branches: 90,
        functions: 90,
        lines: 90,
        statements: 90,
      },
    },
  },
});

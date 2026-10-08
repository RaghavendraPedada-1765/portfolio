import { defineConfig } from "@playwright/test";
import production from "./playwright.config";

export default defineConfig({
  ...production,
  use: { ...production.use, baseURL: "http://127.0.0.1:5173" },
  webServer: {
    command: "npm run dev -- --host 127.0.0.1 --port 5173 --strictPort",
    url: "http://127.0.0.1:5173",
    reuseExistingServer: false,
  },
});

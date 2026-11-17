import { defineConfig } from "@playwright/test";
import { existsSync } from "node:fs";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  workers: 2,
  use: {
    baseURL: "http://127.0.0.1:4174/Research-Portfolio/",
    reducedMotion: "reduce",
    viewport: { width: 1440, height: 1000 },
    launchOptions: {
      executablePath:
        process.env.CHROMIUM_PATH ||
        (existsSync("/usr/bin/chromium") ? "/usr/bin/chromium" : undefined),
    },
  },
  webServer: {
    command: "node tests/serve-pages.mjs",
    url: "http://127.0.0.1:4174/Research-Portfolio/",
    reuseExistingServer: !process.env.CI,
  },
});

import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "wxt";
import { manualChunks } from "./manual-chunks";

export default defineConfig({
  srcDir: "src",
  modules: ["@wxt-dev/module-react"],
  imports: false,
  manifest: {
    name: "Fed Open Market Alerts",
    description:
      "Monitor Federal Reserve Open Market Operations with automated alerts",
    permissions: ["notifications", "alarms", "storage"],
    host_permissions: ["https://markets.newyorkfed.org/*", "*://localhost:*/*"],
    icons: {
      16: "icon-16.png",
      48: "icon-48.png",
      128: "icon-128.png",
    },
  },
  vite: () => ({
    plugins: [tailwindcss()],
  }),
  hooks: {
    "vite:build:extendConfig": (entrypoints, config) => {
      // Background is built with codeSplitting: false; manualChunks is invalid there.
      if (entrypoints.some((entry) => entry.type === "background")) {
        return;
      }

      config.build ??= {};
      config.build.rollupOptions ??= {};
      const output = config.build.rollupOptions.output;
      const outputConfig = Array.isArray(output) ? {} : (output ?? {});
      config.build.rollupOptions.output = {
        ...outputConfig,
        manualChunks,
      };
    },
  },
});

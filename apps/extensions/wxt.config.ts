import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import type { ConfigEnv, UserConfig } from "vite";
import { defineConfig } from "wxt";

export function vite(env: ConfigEnv): UserConfig {
  if (env.mode !== "web") {
    return { plugins: [tailwindcss()] };
  }

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "./src"),
        "wxt/browser": path.resolve(
          import.meta.dirname,
          "./wxt-browser.web.ts",
        ),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes("node_modules")) return;
            if (id.includes("recharts") || id.includes("/d3-")) return "charts";
            if (id.includes("@heroui-pro")) return "heroui-pro";
            if (id.includes("@heroui")) return "heroui";
            if (
              id.includes("/react/") ||
              id.includes("/react-dom/") ||
              id.includes("react-router") ||
              id.includes("react-aria")
            ) {
              return "react-vendor";
            }
            if (id.includes("@tanstack")) return "tanstack";
            if (id.includes("/motion/") || id.includes("framer-motion")) {
              return "motion";
            }
            return "vendor";
          },
        },
      },
    },
  };
}

export default defineConfig({
  srcDir: "src",
  modules: ["@wxt-dev/module-react"],
  manifest: {
    name: "Fed Open Market Alerts",
    permissions: ["notifications", "alarms", "storage"],
    host_permissions: ["https://markets.newyorkfed.org/*", "*://localhost:*/*"],
  },
  vite,
});

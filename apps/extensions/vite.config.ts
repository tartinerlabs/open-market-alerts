import path from "node:path";
import { crx } from "@crxjs/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import manifest from "./manifest.config";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isExtensionBuild = mode !== "web";

  return {
    plugins: [
      react(),
      tailwindcss(),
      ...(isExtensionBuild ? [crx({ manifest })] : []),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      rollupOptions: {
        output: {
          // Split heavy vendors out of the main app chunk so no single chunk
          // dominates. recharts (+ its d3 deps) and HeroUI are the largest.
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
            )
              return "react-vendor";
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
});

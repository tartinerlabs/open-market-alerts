import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "wxt";

export default defineConfig({
  srcDir: "src",
  modules: ["@wxt-dev/module-react"],
  manifest: {
    name: "Fed Open Market Alerts",
    permissions: ["notifications", "alarms", "storage"],
    host_permissions: ["https://markets.newyorkfed.org/*", "*://localhost:*/*"],
  },
  vite: () => ({
    plugins: [tailwindcss()],
  }),
});

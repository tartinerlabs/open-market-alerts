import { defineConfig } from "vite";
import { vite } from "./wxt.config";

export default defineConfig((env) => vite({ ...env, mode: "web" }));

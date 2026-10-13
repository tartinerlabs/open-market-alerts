import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AppRouter } from "@/AppRouter.tsx";
import { AppProviders } from "@/app-providers";
import "@/globals.css";

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <AppProviders>
      <AppRouter routerMode="hash" />
    </AppProviders>
  </StrictMode>,
);

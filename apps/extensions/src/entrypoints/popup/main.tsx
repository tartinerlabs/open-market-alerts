import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AppProviders } from "@/app-providers";
import { Popup } from "@/popup";
import "@/globals.css";

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <AppProviders>
      <Popup />
    </AppProviders>
  </StrictMode>,
);

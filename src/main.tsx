import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./globals.css";
import { AppRouter } from "./AppRouter.tsx";
import { Popup } from "./popup";

const queryClient = new QueryClient();

const isExtensionPopup = () => {
  return (
    typeof chrome !== "undefined" &&
    chrome.runtime &&
    chrome.runtime.id &&
    window.location.protocol === "chrome-extension:"
  );
};

const MainComponent = isExtensionPopup() ? Popup : AppRouter;

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <MainComponent />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>,
);

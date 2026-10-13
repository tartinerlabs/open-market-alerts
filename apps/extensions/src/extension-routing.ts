import { browser } from "wxt/browser";

type ExtensionLocation = Pick<Location, "hash" | "protocol">;
type ExtensionRuntime = Pick<typeof browser.runtime, "getURL" | "id">;

const getRuntime = (): ExtensionRuntime | undefined => {
  if (!browser.runtime) return undefined;

  return browser.runtime;
};

export const isExtensionContext = (
  location: ExtensionLocation = window.location,
  runtime: ExtensionRuntime | undefined = getRuntime(),
) => Boolean(runtime?.id) && location.protocol === "chrome-extension:";

export const getDashboardUrl = (
  runtime: ExtensionRuntime | undefined = getRuntime(),
) => {
  if (!runtime?.id) return "/dashboard";

  const dashboardUrl = new URL(runtime.getURL("/dashboard.html"));
  dashboardUrl.hash = "/dashboard";

  return dashboardUrl.href;
};

type ExtensionLocation = Pick<Location, "hash" | "protocol">;
type ExtensionRuntime = Pick<typeof chrome.runtime, "getURL" | "id">;

const getRuntime = (): ExtensionRuntime | undefined => {
  if (typeof chrome === "undefined" || !chrome.runtime) return undefined;

  return chrome.runtime;
};

export const isExtensionContext = (
  location: ExtensionLocation = window.location,
  runtime: ExtensionRuntime | undefined = getRuntime(),
) => Boolean(runtime?.id) && location.protocol === "chrome-extension:";

export const isExtensionPopup = (
  location: ExtensionLocation = window.location,
  runtime: ExtensionRuntime | undefined = getRuntime(),
) => isExtensionContext(location, runtime) && !location.hash.startsWith("#/");

export const getDashboardUrl = (
  runtime: ExtensionRuntime | undefined = getRuntime(),
) => {
  if (!runtime?.id) return "/dashboard";

  const dashboardUrl = new URL(runtime.getURL("index.html"));
  dashboardUrl.hash = "/dashboard";

  return dashboardUrl.href;
};

import { vi } from "vitest";
import {
  getDashboardUrl,
  isExtensionContext,
  isExtensionPopup,
} from "./extension-routing";

const createRuntime = () => ({
  getURL: vi.fn((path: string) => `chrome-extension://test-id/${path}`),
  id: "test-id",
});

describe("extension routing", () => {
  it("should build an absolute URL for the bundled dashboard", () => {
    const runtime = createRuntime();

    const dashboardUrl = getDashboardUrl(runtime);

    expect(runtime.getURL).toHaveBeenCalledWith("index.html");
    expect(dashboardUrl).toBe(
      "chrome-extension://test-id/index.html#/dashboard",
    );
  });

  it("should use the web dashboard path outside the extension", () => {
    expect(getDashboardUrl(undefined)).toBe("/dashboard");
  });

  it("should identify the hashless extension page as the popup", () => {
    const location = { hash: "", protocol: "chrome-extension:" };

    expect(isExtensionPopup(location, createRuntime())).toBeTruthy();
  });

  it("should identify a routed extension page as the full app", () => {
    const location = {
      hash: "#/dashboard",
      protocol: "chrome-extension:",
    };

    expect(isExtensionPopup(location, createRuntime())).toBeFalsy();
    expect(isExtensionContext(location, createRuntime())).toBeTruthy();
  });

  it("should identify a normal web page as the full app", () => {
    const location = { hash: "", protocol: "https:" };

    expect(isExtensionPopup(location, createRuntime())).toBeFalsy();
    expect(isExtensionContext(location, createRuntime())).toBeFalsy();
  });
});

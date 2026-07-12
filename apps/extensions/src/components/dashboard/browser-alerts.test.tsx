import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { BrowserAlerts } from "./browser-alerts";

const webPushMocks = vi.hoisted(() => ({
  getWebPushSubscription: vi.fn(),
  getWebPushSupport: vi.fn(),
  subscribeToWebPush: vi.fn(),
  unsubscribeFromWebPush: vi.fn(),
}));

vi.mock("@/services/web-push", () => ({
  getWebPushSubscription: webPushMocks.getWebPushSubscription,
  getWebPushSupport: webPushMocks.getWebPushSupport,
  subscribeToWebPush: webPushMocks.subscribeToWebPush,
  unsubscribeFromWebPush: webPushMocks.unsubscribeFromWebPush,
}));

const setPermission = (permission: NotificationPermission) => {
  Object.defineProperty(Notification, "permission", {
    configurable: true,
    value: permission,
  });
};

beforeEach(() => {
  vi.stubGlobal("Notification", { permission: "default" });
  webPushMocks.getWebPushSupport.mockReturnValue({ supported: true });
  webPushMocks.getWebPushSubscription.mockResolvedValue(null);
  webPushMocks.subscribeToWebPush.mockResolvedValue(undefined);
  webPushMocks.unsubscribeFromWebPush.mockResolvedValue(undefined);
  setPermission("default");
});

afterEach(() => {
  vi.clearAllMocks();
  vi.unstubAllGlobals();
});

describe("BrowserAlerts", () => {
  it("should show the inactive state for a supported browser", async () => {
    render(<BrowserAlerts />);

    expect(await screen.findByText("Alerts off")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Enable alerts" })).toBeEnabled();
  });

  it("should show an active subscription", async () => {
    webPushMocks.getWebPushSubscription.mockResolvedValue({});

    render(<BrowserAlerts />);

    expect(await screen.findByText("Alerts enabled")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Stop alerts" })).toBeEnabled();
  });

  it("should show the permission-blocked state", async () => {
    setPermission("denied");

    render(<BrowserAlerts />);

    expect(await screen.findByText("Permission blocked")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Enable alerts" }),
    ).toBeDisabled();
  });

  it("should explain an unsupported browser", async () => {
    webPushMocks.getWebPushSupport.mockReturnValue({
      reason: "Browser alerts require HTTPS.",
      supported: false,
    });

    render(<BrowserAlerts />);

    expect(
      await screen.findByText("Browser alerts require HTTPS."),
    ).toBeInTheDocument();
  });

  it("should enable alerts after a successful browser subscription", async () => {
    const user = userEvent.setup();
    render(<BrowserAlerts />);

    await user.click(
      await screen.findByRole("button", { name: "Enable alerts" }),
    );

    expect(webPushMocks.subscribeToWebPush).toHaveBeenCalledOnce();
    expect(await screen.findByText("Alerts enabled")).toBeInTheDocument();
  });

  it("should show a request failure", async () => {
    webPushMocks.subscribeToWebPush.mockRejectedValue(
      new Error("Unable to save alert."),
    );
    const user = userEvent.setup();
    render(<BrowserAlerts />);

    await user.click(
      await screen.findByRole("button", { name: "Enable alerts" }),
    );

    expect(
      await screen.findByText("Unable to save alert."),
    ).toBeInTheDocument();
  });
});

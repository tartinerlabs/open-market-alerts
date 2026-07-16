import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { HelmetProvider } from "react-helmet-async";
import { vi } from "vitest";
import { Dashboard } from "./Dashboard";

const routingMocks = vi.hoisted(() => ({
  isExtensionContext: vi.fn(),
}));

vi.mock("@/extension-routing", () => ({
  isExtensionContext: routingMocks.isExtensionContext,
}));

vi.mock("../layout/Layout", () => ({
  Layout: ({ children }: { children: ReactNode }) => <main>{children}</main>,
}));

vi.mock("../reverse-repo/latest", () => ({
  Latest: () => <section>Latest operation</section>,
}));

vi.mock("../reverse-repo/trend", () => ({
  Trend: () => <section>Operation trend</section>,
}));

vi.mock("./browser-alerts", () => ({
  BrowserAlerts: () => <section>Browser alerts</section>,
}));

const renderDashboard = () => {
  render(
    <HelmetProvider>
      <Dashboard />
    </HelmetProvider>,
  );
};

afterEach(() => {
  vi.clearAllMocks();
});

describe("Dashboard", () => {
  it("should show browser alerts on the web dashboard", () => {
    routingMocks.isExtensionContext.mockReturnValue(false);

    renderDashboard();

    expect(screen.getByText("Browser alerts")).toBeInTheDocument();
  });

  it("should hide web-only browser alerts in the extension dashboard", () => {
    routingMocks.isExtensionContext.mockReturnValue(true);

    renderDashboard();

    expect(screen.queryByText("Browser alerts")).not.toBeInTheDocument();
    expect(screen.getByText("Latest operation")).toBeInTheDocument();
    expect(screen.getByText("Operation trend")).toBeInTheDocument();
  });
});

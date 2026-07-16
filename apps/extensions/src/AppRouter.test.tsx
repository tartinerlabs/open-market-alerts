import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { AppRouter } from "./AppRouter";

const routingMocks = vi.hoisted(() => ({
  isExtensionContext: vi.fn(),
}));

vi.mock("./extension-routing", () => ({
  isExtensionContext: routingMocks.isExtensionContext,
}));

vi.mock("@/pages/contact.tsx", () => ({
  Contact: () => <h1>Contact route</h1>,
}));

vi.mock("@/pages/extension.tsx", () => ({
  Extension: () => <h1>Extension route</h1>,
}));

vi.mock("@/pages/privacy.tsx", () => ({
  Privacy: () => <h1>Privacy route</h1>,
}));

vi.mock("@/pages/terms.tsx", () => ({
  Terms: () => <h1>Terms route</h1>,
}));

vi.mock("./components/dashboard/Dashboard", () => ({
  Dashboard: () => <h1>Dashboard route</h1>,
}));

vi.mock("./components/landing/landing", () => ({
  Landing: () => <h1>Landing route</h1>,
}));

beforeEach(() => {
  routingMocks.isExtensionContext.mockReturnValue(false);
});

afterEach(() => {
  window.history.replaceState({}, "", "/");
  vi.clearAllMocks();
});

describe("AppRouter", () => {
  it("should render the bundled dashboard from the extension hash", () => {
    window.history.replaceState({}, "", "/index.html#/dashboard");

    render(<AppRouter routerMode="hash" />);

    expect(
      screen.getByRole("heading", { name: "Dashboard route" }),
    ).toBeInTheDocument();
  });

  it("should select hash routing by default in the extension", () => {
    routingMocks.isExtensionContext.mockReturnValue(true);
    window.history.replaceState({}, "", "/index.html#/dashboard");

    render(<AppRouter />);

    expect(
      screen.getByRole("heading", { name: "Dashboard route" }),
    ).toBeInTheDocument();
  });

  it("should render the web dashboard from the browser path", () => {
    window.history.replaceState({}, "", "/dashboard");

    render(<AppRouter routerMode="browser" />);

    expect(
      screen.getByRole("heading", { name: "Dashboard route" }),
    ).toBeInTheDocument();
  });
});

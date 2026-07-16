import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import type { Operation } from "@/types/reverse-repo";
import { Popup } from "./popup";

const serviceMocks = vi.hoisted(() => ({
  getLatestReverseRepo: vi.fn(),
  getRecentReverseRepoTrend: vi.fn(),
  setHasUnreadNotification: vi.fn(),
}));

vi.mock("@/services/reverse-repo.ts", () => ({
  getLatestReverseRepo: serviceMocks.getLatestReverseRepo,
  getRecentReverseRepoTrend: serviceMocks.getRecentReverseRepoTrend,
}));

vi.mock("@/services/storage.ts", () => ({
  setHasUnreadNotification: serviceMocks.setHasUnreadNotification,
}));

const operation: Operation = {
  acceptedCpty: 10,
  auctionStatus: "Closed",
  closeTime: "13:15:00",
  details: [
    {
      amtAccepted: 1_000_000,
      amtSubmitted: 1_000_000,
      percentAwardRate: 4.25,
      percentOfferingRate: 4.25,
      securityType: "Treasury",
    },
  ],
  lastUpdated: "2026-07-16T17:20:00Z",
  maturityDate: "2026-07-17",
  note: "",
  operationDate: "2026-07-16",
  operationId: "test-operation",
  operationMethod: "Fixed-Rate",
  operationType: "Reverse Repo",
  participatingCpty: 10,
  releaseTime: "13:15:00",
  settlementDate: "2026-07-16",
  settlementType: "Same Day",
  term: "Overnight",
  termCalenderDays: 1,
  totalAmtAccepted: 1_000_000,
  totalAmtSubmitted: 1_000_000,
};

const renderPopup = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  render(
    <QueryClientProvider client={queryClient}>
      <Popup />
    </QueryClientProvider>,
  );
};

beforeEach(() => {
  serviceMocks.getLatestReverseRepo.mockResolvedValue(operation);
  serviceMocks.getRecentReverseRepoTrend.mockResolvedValue([]);
});

afterEach(() => {
  vi.clearAllMocks();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("Popup", () => {
  it("should open the bundled dashboard in a new extension tab", async () => {
    const createTab = vi.fn().mockResolvedValue(undefined);
    const getURL = vi.fn(
      (path: string) => `chrome-extension://test-id/${path}`,
    );
    vi.stubGlobal("chrome", {
      runtime: { getURL, id: "test-id" },
      tabs: { create: createTab },
    });
    const user = userEvent.setup();
    renderPopup();

    await user.click(
      await screen.findByRole("button", { name: "More Details" }),
    );

    expect(getURL).toHaveBeenCalledWith("index.html");
    expect(createTab).toHaveBeenCalledWith({
      url: "chrome-extension://test-id/index.html#/dashboard",
    });
  });

  it("should open the web dashboard path outside the extension", async () => {
    vi.stubGlobal("chrome", undefined);
    const openWindow = vi.spyOn(window, "open").mockImplementation(() => null);
    const user = userEvent.setup();
    renderPopup();

    await user.click(
      await screen.findByRole("button", { name: "More Details" }),
    );

    expect(openWindow).toHaveBeenCalledWith("/dashboard", "_blank");
  });
});

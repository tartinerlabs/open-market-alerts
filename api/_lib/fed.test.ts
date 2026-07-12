import { createPushPayload } from "./fed.js";

describe("createPushPayload", () => {
  it("should create a visible notification payload for an operation", () => {
    const payload = createPushPayload({
      lastUpdated: "2026-07-10T17:20:00Z",
      operationDate: "2026-07-10T00:00:00Z",
      totalAmtAccepted: 100_000_000_000,
    });

    expect(payload).toMatchObject({
      body: expect.stringContaining("$100,000,000,000"),
      tag: "fed-operation-2026-07-10T17:20:00Z",
      title: "New Fed Reverse Repo Data",
      url: "/dashboard",
    });
  });
});

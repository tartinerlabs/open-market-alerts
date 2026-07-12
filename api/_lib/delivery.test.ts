import { isExpiredPushSubscription } from "./delivery.js";

describe("isExpiredPushSubscription", () => {
  it("should remove subscriptions rejected as gone", () => {
    expect(isExpiredPushSubscription(410)).toBeTruthy();
  });

  it("should remove subscriptions rejected as missing", () => {
    expect(isExpiredPushSubscription(404)).toBeTruthy();
  });

  it("should preserve subscriptions after a transient failure", () => {
    expect(isExpiredPushSubscription(503)).toBeFalsy();
  });
});

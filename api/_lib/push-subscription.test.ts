import {
  parsePushSubscription,
  parseSubscriptionEndpoint,
} from "./push-subscription.js";

const validSubscription = {
  endpoint: "https://push.example.test/subscriptions/123",
  expirationTime: null,
  keys: {
    auth: "auth-key",
    p256dh: "public-key",
  },
};

describe("parsePushSubscription", () => {
  it("should accept a standard HTTPS browser subscription", () => {
    expect(parsePushSubscription(validSubscription)).toEqual(validSubscription);
  });

  it("should reject subscriptions without encryption keys", () => {
    expect(
      parsePushSubscription({
        ...validSubscription,
        keys: { auth: "auth-key" },
      }),
    ).toBeNull();
  });

  it("should reject a non-HTTPS endpoint", () => {
    expect(
      parsePushSubscription({
        ...validSubscription,
        endpoint: "http://push.example.test/subscriptions/123",
      }),
    ).toBeNull();
  });
});

describe("parseSubscriptionEndpoint", () => {
  it("should accept an HTTPS endpoint for unsubscribe", () => {
    expect(parseSubscriptionEndpoint(validSubscription)).toBe(
      validSubscription.endpoint,
    );
  });

  it("should reject an empty unsubscribe payload", () => {
    expect(parseSubscriptionEndpoint({})).toBeNull();
  });
});

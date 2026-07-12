import { isCronAuthorized } from "./http.js";

describe("isCronAuthorized", () => {
  it("should accept a matching bearer token", () => {
    expect(isCronAuthorized("Bearer secret", "secret")).toBeTruthy();
  });

  it("should reject a missing cron secret", () => {
    expect(isCronAuthorized("Bearer secret", undefined)).toBeFalsy();
  });

  it("should reject a non-matching bearer token", () => {
    expect(isCronAuthorized("Bearer stale", "secret")).toBeFalsy();
  });
});

export interface PushSubscriptionInput {
  endpoint: string;
  expirationTime: number | null;
  keys: {
    auth: string;
    p256dh: string;
  };
}

export const parsePushSubscription = (
  value: unknown,
): PushSubscriptionInput | null => {
  if (!value || typeof value !== "object") return null;

  const candidate = value as {
    endpoint?: unknown;
    expirationTime?: unknown;
    keys?: { auth?: unknown; p256dh?: unknown };
  };

  if (
    typeof candidate.endpoint !== "string" ||
    candidate.endpoint.length === 0 ||
    typeof candidate.keys?.auth !== "string" ||
    candidate.keys.auth.length === 0 ||
    typeof candidate.keys.p256dh !== "string" ||
    candidate.keys.p256dh.length === 0 ||
    (candidate.expirationTime !== null &&
      candidate.expirationTime !== undefined &&
      typeof candidate.expirationTime !== "number")
  ) {
    return null;
  }

  try {
    const endpoint = new URL(candidate.endpoint);
    if (endpoint.protocol !== "https:") return null;
  } catch {
    return null;
  }

  return {
    endpoint: candidate.endpoint,
    expirationTime: candidate.expirationTime ?? null,
    keys: {
      auth: candidate.keys.auth,
      p256dh: candidate.keys.p256dh,
    },
  };
};

export const parseSubscriptionEndpoint = (value: unknown): string | null => {
  if (!value || typeof value !== "object") return null;
  const endpoint = (value as { endpoint?: unknown }).endpoint;

  if (typeof endpoint !== "string" || endpoint.length === 0) return null;

  try {
    const url = new URL(endpoint);
    return url.protocol === "https:" ? endpoint : null;
  } catch {
    return null;
  }
};

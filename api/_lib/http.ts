import type { VercelRequest } from "@vercel/node";

export const isCronAuthorized = (
  authorization: string | undefined,
  cronSecret: string | undefined,
): boolean => {
  return Boolean(cronSecret && authorization === `Bearer ${cronSecret}`);
};

export const readJsonBody = (request: VercelRequest): unknown => {
  if (typeof request.body === "string") {
    try {
      return JSON.parse(request.body) as unknown;
    } catch {
      return null;
    }
  }

  return request.body;
};

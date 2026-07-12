import type { VercelRequest, VercelResponse } from "@vercel/node";
import { removeSubscription, upsertSubscription } from "../_lib/database.js";
import { readJsonBody } from "../_lib/http.js";
import {
  parsePushSubscription,
  parseSubscriptionEndpoint,
} from "../_lib/push-subscription.js";

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  const body = readJsonBody(request);

  if (request.method === "POST") {
    const subscription = parsePushSubscription(body);
    if (!subscription) {
      return response.status(400).json({ error: "Invalid push subscription" });
    }

    try {
      await upsertSubscription(subscription);
      return response.status(201).json({ subscribed: true });
    } catch (error) {
      console.error("Unable to store push subscription", error);
      return response
        .status(500)
        .json({ error: "Unable to save subscription" });
    }
  }

  if (request.method === "DELETE") {
    const endpoint = parseSubscriptionEndpoint(body);
    if (!endpoint) {
      return response.status(400).json({ error: "Invalid push subscription" });
    }

    try {
      await removeSubscription(endpoint);
      return response.status(204).end();
    } catch (error) {
      console.error("Unable to remove push subscription", error);
      return response
        .status(500)
        .json({ error: "Unable to remove subscription" });
    }
  }

  response.setHeader("Allow", "POST, DELETE");
  return response.status(405).json({ error: "Method not allowed" });
}

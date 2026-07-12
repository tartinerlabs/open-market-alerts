import type { VercelRequest, VercelResponse } from "@vercel/node";
import { recordOperation } from "../_lib/database.js";
import { deliverPendingPushNotifications } from "../_lib/delivery.js";
import { createPushPayload, getLatestFedOperation } from "../_lib/fed.js";
import { isCronAuthorized } from "../_lib/http.js";

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    return response.status(405).json({ error: "Method not allowed" });
  }

  if (
    !isCronAuthorized(request.headers.authorization, process.env.CRON_SECRET)
  ) {
    return response.status(401).json({ error: "Unauthorized" });
  }

  try {
    const operation = await getLatestFedOperation();
    if (!operation) {
      return response.status(200).json({ deliveries: 0, operation: "missing" });
    }

    const operationRecorded = await recordOperation(
      operation.lastUpdated,
      createPushPayload(operation),
    );
    const result = await deliverPendingPushNotifications();

    return response.status(200).json({ operationRecorded, ...result });
  } catch (error) {
    console.error("Unable to send web push alerts", error);
    return response.status(500).json({ error: "Unable to send push alerts" });
  }
}

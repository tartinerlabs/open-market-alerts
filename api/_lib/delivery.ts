import * as webpush from "web-push";
import {
  claimPendingDeliveries,
  markDeliveryFailed,
  markDeliverySent,
  removeSubscription,
} from "./database.js";

const getVapidDetails = () => {
  const subject = process.env.VAPID_SUBJECT;
  const publicKey = process.env.VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;

  if (!subject || !publicKey || !privateKey) {
    throw new Error("VAPID credentials are not configured");
  }

  return { privateKey, publicKey, subject };
};

const getStatusCode = (error: unknown): number | null => {
  if (!error || typeof error !== "object" || !("statusCode" in error)) {
    return null;
  }

  const statusCode = (error as { statusCode?: unknown }).statusCode;
  return typeof statusCode === "number" ? statusCode : null;
};

export const isExpiredPushSubscription = (statusCode: number | null) => {
  return statusCode === 404 || statusCode === 410;
};

const getErrorMessage = (error: unknown): string => {
  return error instanceof Error ? error.message : "Unknown push delivery error";
};

export const deliverPendingPushNotifications = async () => {
  const deliveries = await claimPendingDeliveries();
  const vapidDetails = getVapidDetails();
  let removed = 0;
  let sent = 0;
  let failed = 0;

  for (const delivery of deliveries) {
    try {
      await webpush.sendNotification(
        {
          endpoint: delivery.endpoint,
          keys: { auth: delivery.auth, p256dh: delivery.p256dh },
        },
        JSON.stringify(delivery.payload),
        { TTL: 86_400, urgency: "normal", vapidDetails },
      );
      await markDeliverySent(delivery.deliveryId);
      sent += 1;
    } catch (error) {
      const statusCode = getStatusCode(error);
      if (isExpiredPushSubscription(statusCode)) {
        await removeSubscription(delivery.endpoint);
        removed += 1;
      } else {
        await markDeliveryFailed(delivery.deliveryId, getErrorMessage(error));
        failed += 1;
      }
    }
  }

  return { failed, removed, sent };
};

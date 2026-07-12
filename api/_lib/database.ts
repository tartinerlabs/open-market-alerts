import { neon } from "@neondatabase/serverless";
import type { PushSubscriptionInput } from "./push-subscription.js";

export interface PendingDelivery {
  auth: string;
  deliveryId: string;
  endpoint: string;
  operationKey: string;
  p256dh: string;
  payload: PushPayload;
  subscriptionId: string;
}

export interface PushPayload {
  body: string;
  tag: string;
  title: string;
  url: string;
}

const getSql = () => {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is not configured");
  return neon(databaseUrl);
};

export const upsertSubscription = async (
  subscription: PushSubscriptionInput,
): Promise<void> => {
  const sql = getSql();
  const expirationTime = subscription.expirationTime
    ? new Date(subscription.expirationTime).toISOString()
    : null;

  await sql`
    INSERT INTO push_subscriptions (endpoint, p256dh, auth, expiration_time)
    VALUES (
      ${subscription.endpoint},
      ${subscription.keys.p256dh},
      ${subscription.keys.auth},
      ${expirationTime}
    )
    ON CONFLICT (endpoint) DO UPDATE
    SET
      p256dh = EXCLUDED.p256dh,
      auth = EXCLUDED.auth,
      expiration_time = EXCLUDED.expiration_time,
      updated_at = NOW()
  `;
};

export const removeSubscription = async (endpoint: string): Promise<void> => {
  const sql = getSql();
  await sql`DELETE FROM push_subscriptions WHERE endpoint = ${endpoint}`;
};

export const recordOperation = async (
  operationKey: string,
  payload: PushPayload,
): Promise<boolean> => {
  const sql = getSql();
  const rows = (await sql`
    INSERT INTO push_operations (operation_key, payload)
    VALUES (${operationKey}, ${JSON.stringify(payload)}::jsonb)
    ON CONFLICT (operation_key) DO NOTHING
    RETURNING id
  `) as { id: string }[];

  if (rows.length === 0) return false;

  await sql`
    INSERT INTO push_deliveries (operation_id, subscription_id)
    SELECT ${rows[0].id}, id FROM push_subscriptions
    ON CONFLICT (operation_id, subscription_id) DO NOTHING
  `;

  return true;
};

export const claimPendingDeliveries = async (): Promise<PendingDelivery[]> => {
  const sql = getSql();
  return (await sql`
    WITH candidates AS (
      SELECT id
      FROM push_deliveries
      WHERE status = 'pending'
        OR (status = 'sending' AND locked_at < NOW() - INTERVAL '15 minutes')
      ORDER BY id
      FOR UPDATE SKIP LOCKED
      LIMIT 100
    ), claimed AS (
      UPDATE push_deliveries AS delivery
      SET
        status = 'sending',
        attempt_count = delivery.attempt_count + 1,
        last_error = NULL,
        locked_at = NOW(),
        updated_at = NOW()
      FROM candidates
      WHERE delivery.id = candidates.id
      RETURNING delivery.id, delivery.subscription_id, delivery.operation_id
    )
    SELECT
      claimed.id::text AS "deliveryId",
      claimed.subscription_id::text AS "subscriptionId",
      subscription.endpoint,
      subscription.p256dh,
      subscription.auth,
      operation.operation_key AS "operationKey",
      operation.payload AS payload
    FROM claimed
    JOIN push_subscriptions AS subscription ON subscription.id = claimed.subscription_id
    JOIN push_operations AS operation ON operation.id = claimed.operation_id
  `) as PendingDelivery[];
};

export const markDeliverySent = async (deliveryId: string): Promise<void> => {
  const sql = getSql();
  await sql`
    UPDATE push_deliveries
    SET status = 'sent', sent_at = NOW(), updated_at = NOW()
    WHERE id = ${deliveryId}
  `;
};

export const markDeliveryFailed = async (
  deliveryId: string,
  error: string,
): Promise<void> => {
  const sql = getSql();
  await sql`
    UPDATE push_deliveries
    SET status = 'pending', last_error = ${error}, updated_at = NOW()
    WHERE id = ${deliveryId}
  `;
};

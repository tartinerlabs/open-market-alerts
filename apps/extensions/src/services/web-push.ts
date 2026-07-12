export interface WebPushSupport {
  reason?: string;
  supported: boolean;
}

const SERVICE_WORKER_PATH = "/push-service-worker.js";

const isIos = () => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
};

const isInstalledIosWebApp = () => {
  const navigatorWithStandalone = navigator as Navigator & {
    standalone?: boolean;
  };

  return (
    navigatorWithStandalone.standalone === true ||
    window.matchMedia("(display-mode: standalone)").matches
  );
};

export const getWebPushSupport = (): WebPushSupport => {
  if (typeof window === "undefined") {
    return {
      reason: "Browser alerts are only available in a web browser.",
      supported: false,
    };
  }

  if (!window.isSecureContext) {
    return {
      reason: "Browser alerts require a secure HTTPS connection.",
      supported: false,
    };
  }

  if (
    !("serviceWorker" in navigator) ||
    !("PushManager" in window) ||
    !("Notification" in window)
  ) {
    return {
      reason: "This browser does not support web push notifications.",
      supported: false,
    };
  }

  if (isIos() && !isInstalledIosWebApp()) {
    return {
      reason:
        "On iPhone or iPad, install this site to the Home Screen before enabling alerts.",
      supported: false,
    };
  }

  return { supported: true };
};

const getRegistration = async (): Promise<ServiceWorkerRegistration> => {
  const existing = await navigator.serviceWorker.getRegistration("/");
  return existing ?? navigator.serviceWorker.register(SERVICE_WORKER_PATH);
};

const getPublicKey = async (): Promise<string> => {
  const response = await fetch("/api/push/public-key");
  if (!response.ok) throw new Error("Browser alerts are not configured yet.");

  const body = (await response.json()) as { publicKey?: unknown };
  if (typeof body.publicKey !== "string" || body.publicKey.length === 0) {
    throw new Error("Browser alerts are not configured yet.");
  }

  return body.publicKey;
};

const toUint8Array = (value: string): Uint8Array<ArrayBuffer> => {
  const padded = value.padEnd(Math.ceil(value.length / 4) * 4, "=");
  const base64 = padded.replace(/-/g, "+").replace(/_/g, "/");
  const decoded = window.atob(base64);
  return Uint8Array.from(decoded, (character) => character.charCodeAt(0));
};

const saveSubscription = async (
  subscription: PushSubscription,
): Promise<void> => {
  const response = await fetch("/api/push/subscriptions", {
    body: JSON.stringify(subscription.toJSON()),
    headers: { "Content-Type": "application/json" },
    method: "POST",
  });

  if (!response.ok)
    throw new Error("We could not save this browser for alerts.");
};

export const getWebPushSubscription =
  async (): Promise<PushSubscription | null> => {
    const registration = await navigator.serviceWorker.getRegistration("/");
    return registration?.pushManager.getSubscription() ?? null;
  };

export const subscribeToWebPush = async (): Promise<void> => {
  const support = getWebPushSupport();
  if (!support.supported) throw new Error(support.reason);

  const registrationPromise = getRegistration();
  const permission =
    Notification.permission === "default"
      ? await Notification.requestPermission()
      : Notification.permission;

  if (permission !== "granted") {
    throw new Error("Notification permission was not granted.");
  }

  const [registration, publicKey] = await Promise.all([
    registrationPromise,
    getPublicKey(),
  ]);
  const existing = await registration.pushManager.getSubscription();
  const subscription =
    existing ??
    (await registration.pushManager.subscribe({
      applicationServerKey: toUint8Array(publicKey),
      userVisibleOnly: true,
    }));

  try {
    await saveSubscription(subscription);
  } catch (error) {
    if (!existing) await subscription.unsubscribe();
    throw error;
  }
};

export const unsubscribeFromWebPush = async (): Promise<void> => {
  const subscription = await getWebPushSubscription();
  if (!subscription) return;

  const response = await fetch("/api/push/subscriptions", {
    body: JSON.stringify({ endpoint: subscription.endpoint }),
    headers: { "Content-Type": "application/json" },
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("We could not stop browser alerts. Please try again.");
  }

  await subscription.unsubscribe();
};

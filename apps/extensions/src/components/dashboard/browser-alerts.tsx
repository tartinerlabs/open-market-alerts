import { Alert, Button, Card, Spinner } from "@heroui/react";
import { BellOff, BellRing, CircleAlert, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import {
  getWebPushSubscription,
  getWebPushSupport,
  subscribeToWebPush,
  unsubscribeFromWebPush,
} from "@/services/web-push";

type AlertStatus =
  | "active"
  | "checking"
  | "denied"
  | "error"
  | "inactive"
  | "pending"
  | "unsupported";

const STATUS_COPY: Record<
  Exclude<AlertStatus, "error" | "unsupported">,
  { description: string; label: string }
> = {
  active: {
    description:
      "This browser will receive weekday alerts when new Fed data is published.",
    label: "Alerts enabled",
  },
  checking: {
    description: "Checking browser support…",
    label: "Checking alerts",
  },
  denied: {
    description:
      "Allow notifications in your browser settings, then enable alerts here.",
    label: "Permission blocked",
  },
  inactive: {
    description:
      "Get a weekday alert when new Fed reverse repo data is published.",
    label: "Alerts off",
  },
  pending: {
    description: "Setting up alerts for this browser…",
    label: "Saving alert preference",
  },
};

export const BrowserAlerts = () => {
  const [error, setError] = useState("");
  const [status, setStatus] = useState<AlertStatus>("checking");

  useEffect(() => {
    const checkSubscription = async () => {
      const support = getWebPushSupport();
      if (!support.supported) {
        setError(support.reason ?? "Browser alerts are unavailable.");
        setStatus("unsupported");
        return;
      }

      if (Notification.permission === "denied") {
        setStatus("denied");
        return;
      }

      try {
        const subscription = await getWebPushSubscription();
        setStatus(subscription ? "active" : "inactive");
      } catch {
        setError("We could not check this browser’s alert status.");
        setStatus("error");
      }
    };

    void checkSubscription();
  }, []);

  const enableAlerts = async () => {
    setError("");
    setStatus("pending");

    try {
      await subscribeToWebPush();
      setStatus("active");
    } catch (caughtError) {
      const message =
        caughtError instanceof Error
          ? caughtError.message
          : "We could not enable browser alerts.";
      setError(message);
      setStatus(Notification.permission === "denied" ? "denied" : "error");
    }
  };

  const disableAlerts = async () => {
    setError("");
    setStatus("pending");

    try {
      await unsubscribeFromWebPush();
      setStatus("inactive");
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "We could not stop browser alerts.",
      );
      setStatus("error");
    }
  };

  const content =
    status === "unsupported"
      ? { description: error, label: "Browser alerts unavailable" }
      : status === "error"
        ? {
            description:
              "Check your connection and try again when you are ready.",
            label: "Browser alerts unavailable",
          }
        : STATUS_COPY[status];

  return (
    <Card className="overflow-hidden border border-accent/20 p-0">
      <div className="flex flex-col gap-4 border-b border-border bg-accent-soft/40 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-accent p-2 text-accent-foreground shadow-sm">
            <BellRing className="size-5" />
          </div>
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-accent uppercase">
              Market signal
            </p>
            <h2 className="text-xl font-bold text-foreground">
              Browser alerts
            </h2>
          </div>
        </div>
        <span className="w-fit rounded-full border border-accent/20 bg-surface px-3 py-1 text-xs font-semibold text-foreground">
          {content.label}
        </span>
      </div>

      <div className="flex flex-col gap-4 p-6">
        <p className="max-w-2xl text-sm leading-6 text-muted">
          {content.description}
        </p>

        {status === "unsupported" && (
          <Alert>
            <Alert.Indicator>
              <CircleAlert />
            </Alert.Indicator>
            <Alert.Content>
              <Alert.Title>
                On iPhone or iPad, add this site to the Home Screen first. macOS
                Safari supports browser alerts directly from this page.
              </Alert.Title>
            </Alert.Content>
          </Alert>
        )}

        {status === "error" && (
          <Alert status="danger">
            <Alert.Indicator>
              <CircleAlert />
            </Alert.Indicator>
            <Alert.Content>
              <Alert.Title>{error}</Alert.Title>
            </Alert.Content>
          </Alert>
        )}

        <div className="flex flex-wrap items-center gap-3">
          {status === "active" ? (
            <Button variant="outline" onPress={disableAlerts}>
              <BellOff className="size-4" />
              Stop alerts
            </Button>
          ) : (
            <Button
              isDisabled={
                status === "unsupported" ||
                status === "denied" ||
                status === "checking" ||
                status === "pending"
              }
              onPress={enableAlerts}
            >
              {status === "pending" || status === "checking" ? (
                <Spinner color="current" size="sm" />
              ) : (
                <BellRing className="size-4" />
              )}
              Enable alerts
            </Button>
          )}
          <span className="flex items-center gap-2 text-xs text-muted">
            <ShieldCheck className="size-4 text-success" />
            No account or email required
          </span>
        </div>
      </div>
    </Card>
  );
};

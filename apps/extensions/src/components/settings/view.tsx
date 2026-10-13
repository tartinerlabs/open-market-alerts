import { Button, Separator, Spinner, Switch, Tooltip } from "@heroui/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Bell, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { browser } from "wxt/browser";
import {
  getTestOperation,
  showFedDataNotification,
} from "@/services/notifications";
import {
  getUserPreferences,
  resetUserPreferences,
  setUserPreferences,
} from "@/services/storage";
import type { UserPreferences } from "@/types/preferences";
import { DEFAULT_PREFERENCES, PREFERENCE_LABELS } from "@/types/preferences";

interface ViewProps {
  onBack: () => void;
}

type TestStatus = "idle" | "sending" | "success" | "error";

export const View = ({ onBack }: ViewProps) => {
  const queryClient = useQueryClient();
  const [testStatus, setTestStatus] = useState<TestStatus>("idle");
  const [testError, setTestError] = useState<string>("");

  const { data: preferences = DEFAULT_PREFERENCES } = useQuery({
    queryKey: ["user-preferences"],
    queryFn: getUserPreferences,
    enabled: Boolean(browser.storage),
  });

  useEffect(() => {
    if (testStatus === "idle" || testStatus === "sending") return;
    const timer = setTimeout(() => {
      setTestStatus("idle");
      setTestError("");
    }, 3000);
    return () => clearTimeout(timer);
  }, [testStatus]);

  const updatePreference = async (updates: Partial<UserPreferences>) => {
    const newPreferences = { ...preferences, ...updates };
    await setUserPreferences(newPreferences);
    queryClient.setQueryData(["user-preferences"], newPreferences);
  };

  const handleReset = async () => {
    await resetUserPreferences();
    queryClient.setQueryData(["user-preferences"], DEFAULT_PREFERENCES);
  };

  const handleTestNotification = async () => {
    setTestStatus("sending");
    setTestError("");
    try {
      await showFedDataNotification(getTestOperation(), { isTest: true });
      setTestStatus("success");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      setTestError(message);
      setTestStatus("error");
    }
  };

  return (
    <div className="w-80 bg-surface">
      <div className="flex items-center gap-3 border-b border-border p-4">
        <Tooltip>
          <Tooltip.Trigger>
            <Button
              isIconOnly
              variant="ghost"
              aria-label="Back"
              onPress={onBack}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Tooltip.Trigger>
          <Tooltip.Content>Back</Tooltip.Content>
        </Tooltip>
        <h1 className="text-lg font-bold text-foreground">Settings</h1>
      </div>

      <div className="space-y-6 p-4">
        <div className="space-y-4">
          <h2 className="text-base font-semibold text-foreground">
            Notifications
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">
                {PREFERENCE_LABELS.notificationsEnabled}
              </span>
              <Switch
                aria-label={PREFERENCE_LABELS.notificationsEnabled}
                isSelected={preferences.notificationsEnabled}
                onChange={(checked) =>
                  updatePreference({ notificationsEnabled: checked })
                }
              >
                <Switch.Content>
                  <Switch.Control>
                    <Switch.Thumb />
                  </Switch.Control>
                </Switch.Content>
              </Switch>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-sm text-foreground">
                    {PREFERENCE_LABELS.immediateNotifications}
                  </span>
                  <p className="text-xs text-muted">
                    Get notified immediately when new Fed data is available
                  </p>
                </div>
                <Switch
                  aria-label={PREFERENCE_LABELS.immediateNotifications}
                  isSelected={preferences.immediateNotifications}
                  isDisabled={!preferences.notificationsEnabled}
                  onChange={(checked) =>
                    updatePreference({ immediateNotifications: checked })
                  }
                >
                  <Switch.Content>
                    <Switch.Control>
                      <Switch.Thumb />
                    </Switch.Control>
                  </Switch.Content>
                </Switch>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-sm text-foreground">
                    {PREFERENCE_LABELS.dailySummary}
                  </span>
                  <p className="text-xs text-muted">
                    Receive a daily summary of Fed operations
                  </p>
                </div>
                <Switch
                  aria-label={PREFERENCE_LABELS.dailySummary}
                  isSelected={preferences.dailySummary}
                  isDisabled={!preferences.notificationsEnabled}
                  onChange={(checked) =>
                    updatePreference({ dailySummary: checked })
                  }
                >
                  <Switch.Content>
                    <Switch.Control>
                      <Switch.Thumb />
                    </Switch.Control>
                  </Switch.Content>
                </Switch>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              isPending={testStatus === "sending"}
              isDisabled={testStatus === "sending"}
              onPress={handleTestNotification}
            >
              {({ isPending }) => (
                <>
                  {isPending ? (
                    <Spinner color="current" size="sm" />
                  ) : (
                    <Bell className="h-4 w-4" />
                  )}
                  Test notification
                </>
              )}
            </Button>
          </div>
          {testStatus === "success" && (
            <p className="text-xs text-success">
              Test notification sent. Check your notifications.
            </p>
          )}
          {testStatus === "error" && (
            <p className="text-xs text-danger">
              Failed: {testError || "unknown error"}. Try re-enabling
              notifications for this extension.
            </p>
          )}
        </div>

        <Separator />

        <div className="flex justify-center">
          <Button variant="ghost" size="sm" onPress={handleReset}>
            <RotateCcw className="mr-1 h-3 w-3" />
            Reset to defaults
          </Button>
        </div>
      </div>
    </div>
  );
};

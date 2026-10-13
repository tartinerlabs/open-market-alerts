import { browser } from "wxt/browser";
import { defineBackground } from "#imports";
import { showFedDataNotification } from "../services/notifications.ts";
import { getLatestReverseRepo } from "../services/reverse-repo.ts";
import {
  ALARM_NAMES,
  scheduleNextFedDataCheck,
} from "../services/scheduler.ts";
import {
  getHasUnreadNotification,
  getLastUpdatedTimestamp,
  getUserPreferences,
  setHasUnreadNotification,
  setLastUpdatedTimestamp,
} from "../services/storage.ts";

export default defineBackground(() => {
  const updateBadge = async () => {
    const hasUnread = await getHasUnreadNotification();

    if (hasUnread) {
      await browser.action.setBadgeText({ text: "!" });
      await browser.action.setBadgeBackgroundColor({ color: "#ef4444" });
    } else {
      await browser.action.setBadgeText({ text: "" });
    }
  };

  const checkFedData = async () => {
    console.log("Checking Fed API for new data...");

    try {
      const currentOperation = await getLatestReverseRepo();

      if (!currentOperation) {
        console.error("No Fed data available");
        return;
      }

      const storedTimestamp = await getLastUpdatedTimestamp();

      console.log("Current lastUpdated:", currentOperation.lastUpdated);
      console.log("Stored lastUpdated:", storedTimestamp);

      if (storedTimestamp !== currentOperation.lastUpdated) {
        console.log("New Fed data detected!");

        const preferences = await getUserPreferences();

        if (
          preferences.notificationsEnabled &&
          preferences.immediateNotifications
        ) {
          console.log("Showing immediate notification...");
          await showFedDataNotification(currentOperation);
          console.log("Notification sent");
        } else {
          console.log(
            "Immediate notifications disabled, skipping notification",
          );
        }

        await setLastUpdatedTimestamp(currentOperation.lastUpdated);
        await setHasUnreadNotification(true);

        console.log("Timestamp updated and unread flag set");
      } else {
        console.log("No new Fed data found");
      }
    } catch (error) {
      console.error("Error checking Fed data:", error);
    }
  };

  browser.runtime.onStartup.addListener(async () => {
    console.log("Extension started - scheduling Fed data checks");
    scheduleNextFedDataCheck();
    await updateBadge();
  });

  browser.runtime.onInstalled.addListener(async () => {
    console.log("Extension installed - scheduling Fed data checks");
    scheduleNextFedDataCheck();
    await updateBadge();
  });

  browser.alarms.onAlarm.addListener(async (alarm) => {
    if (alarm.name === ALARM_NAMES.FED_DATA_CHECK) {
      console.log("Fed data check alarm fired");
      await checkFedData();
      scheduleNextFedDataCheck();
    }
  });

  browser.runtime.onMessage.addListener(async (message) => {
    if (
      message &&
      typeof message === "object" &&
      "action" in message &&
      message.action === "checkFedDataNow"
    ) {
      console.log("Manual Fed data check triggered");
      await checkFedData();
      return { success: true };
    }
  });

  browser.storage.onChanged.addListener(async (changes, namespace) => {
    if (namespace === "local" && changes.has_unread_notification) {
      console.log("Unread notification state changed, updating badge");
      await updateBadge();
    }
  });

  console.log("Background script loaded");
});

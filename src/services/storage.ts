import type { UserPreferences } from "../types/preferences";
import { DEFAULT_PREFERENCES } from "../types/preferences";

const STORAGE_KEYS = {
  LAST_UPDATED_TIMESTAMP: "last_updated_timestamp",
  HAS_UNREAD_NOTIFICATION: "has_unread_notification",
  USER_PREFERENCES: "user_preferences",
} as const;

export const getLastUpdatedTimestamp = async (): Promise<string | null> => {
  const result = await chrome.storage.local.get<{
    [STORAGE_KEYS.LAST_UPDATED_TIMESTAMP]?: string;
  }>([STORAGE_KEYS.LAST_UPDATED_TIMESTAMP]);
  return result[STORAGE_KEYS.LAST_UPDATED_TIMESTAMP] ?? null;
};

export const setLastUpdatedTimestamp = async (
  timestamp: string,
): Promise<void> => {
  await chrome.storage.local.set({
    [STORAGE_KEYS.LAST_UPDATED_TIMESTAMP]: timestamp,
  });
};

export const getHasUnreadNotification = async (): Promise<boolean> => {
  const result = await chrome.storage.local.get<{
    [STORAGE_KEYS.HAS_UNREAD_NOTIFICATION]?: boolean;
  }>([STORAGE_KEYS.HAS_UNREAD_NOTIFICATION]);
  return result[STORAGE_KEYS.HAS_UNREAD_NOTIFICATION] ?? false;
};

export const setHasUnreadNotification = async (
  hasUnread: boolean,
): Promise<void> => {
  await chrome.storage.local.set({
    [STORAGE_KEYS.HAS_UNREAD_NOTIFICATION]: hasUnread,
  });
};

export const getUserPreferences = async (): Promise<UserPreferences> => {
  const result = await chrome.storage.local.get<{
    [STORAGE_KEYS.USER_PREFERENCES]?: UserPreferences;
  }>([STORAGE_KEYS.USER_PREFERENCES]);
  return result[STORAGE_KEYS.USER_PREFERENCES] ?? DEFAULT_PREFERENCES;
};

export const setUserPreferences = async (
  preferences: UserPreferences,
): Promise<void> => {
  await chrome.storage.local.set({
    [STORAGE_KEYS.USER_PREFERENCES]: preferences,
  });
};

export const resetUserPreferences = async (): Promise<void> => {
  await setUserPreferences(DEFAULT_PREFERENCES);
};

import { browser } from "wxt/browser";
import type { Operation } from "../types/reverse-repo.ts";

const NOTIFICATION_CONFIG = {
  ICON: "/icon-48.png",
  TITLE: "New Fed Reverse Repo Data",
  TEST_TITLE: "Test Notification",
} as const;

const buildTestOperation = (): Operation => {
  const now = new Date();
  const isoToday = now.toISOString();
  return {
    operationId: "test-operation",
    auctionStatus: "Test",
    operationDate: isoToday,
    settlementDate: isoToday,
    maturityDate: isoToday,
    operationType: "Test",
    operationMethod: "Test",
    settlementType: "Test",
    termCalenderDays: 1,
    term: "1 day",
    releaseTime: "Test",
    closeTime: "Test",
    note: "Sample data for manual notification test",
    lastUpdated: isoToday,
    participatingCpty: 0,
    acceptedCpty: 0,
    totalAmtSubmitted: 120000000000,
    totalAmtAccepted: 100000000000,
    details: [
      {
        securityType: "Treasury",
        amtSubmitted: 120000000000,
        amtAccepted: 100000000000,
        percentOfferingRate: 5.35,
        percentAwardRate: 5.32,
      },
    ],
  };
};

export const getTestOperation = buildTestOperation;

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatOperationDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};

const formatUpdateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });
};

interface ShowNotificationOptions {
  isTest?: boolean;
}

export const showFedDataNotification = async (
  operation: Operation,
  options: ShowNotificationOptions = {},
): Promise<void> => {
  const amount = formatCurrency(operation.totalAmtAccepted);
  const operationDate = formatOperationDate(operation.operationDate);
  const updateTime = formatUpdateTime(operation.lastUpdated);
  const title = options.isTest
    ? NOTIFICATION_CONFIG.TEST_TITLE
    : NOTIFICATION_CONFIG.TITLE;

  await browser.notifications.create({
    type: "basic",
    iconUrl: browser.runtime.getURL(NOTIFICATION_CONFIG.ICON),
    title,
    message: `${amount} accepted on ${operationDate}`,
    contextMessage: `Updated: ${updateTime}`,
  });
};

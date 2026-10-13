import { browser } from "wxt/browser";

export const ALARM_NAMES = {
  FED_DATA_CHECK: "fedDataCheck",
} as const;

const SCHEDULE_CONFIG = {
  CHECK_HOUR: 13,
  CHECK_MINUTE: 20,
  EST_UTC_OFFSET: -5,
} as const;

const isWeekday = (date: Date): boolean => {
  const day = date.getDay();
  return day >= 1 && day <= 5;
};

const convertEstToLocalTime = (
  estHour: number,
  estMinute: number,
): { hour: number; minute: number } => {
  const estDate = new Date();

  estDate.setUTCHours(
    estHour - SCHEDULE_CONFIG.EST_UTC_OFFSET,
    estMinute,
    0,
    0,
  );

  return {
    hour: estDate.getHours(),
    minute: estDate.getMinutes(),
  };
};

const getNextWeekday = (date: Date): Date => {
  const nextDate = new Date(date);

  while (!isWeekday(nextDate)) {
    nextDate.setDate(nextDate.getDate() + 1);
  }

  return nextDate;
};

export const scheduleNextFedDataCheck = async (): Promise<void> => {
  const now = new Date();
  const localTime = convertEstToLocalTime(
    SCHEDULE_CONFIG.CHECK_HOUR,
    SCHEDULE_CONFIG.CHECK_MINUTE,
  );

  const targetTime = new Date();
  targetTime.setHours(localTime.hour, localTime.minute, 0, 0);

  if (targetTime <= now) {
    targetTime.setDate(targetTime.getDate() + 1);
  }

  const nextWeekday = getNextWeekday(targetTime);

  console.log(
    "Scheduling next Fed data check for:",
    nextWeekday.toLocaleString(),
  );

  await browser.alarms.create(ALARM_NAMES.FED_DATA_CHECK, {
    when: nextWeekday.getTime(),
  });
};

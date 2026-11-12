import dayjs from '@lib/datetime';

export function toDate(date: dayjs.Dayjs) {
  return date.format('YYYY-MM-DD');
}

export function toDatetime(date: dayjs.Dayjs) {
  return date.toISOString();
}

export function getDateToday() {
  return dayjs().startOf('day');
}

const WEEKDAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
] as const;

const WEEKDAYS_SHORT = [
  'Sun',
  'Mon',
  'Tue',
  'Wed',
  'Thur',
  'Fri',
  'Sat',
] as const;

export function getDayOfWeek(
  date: dayjs.Dayjs,
  short: boolean = false,
): string {
  const weekday = date.day();

  return (short ? WEEKDAYS_SHORT : WEEKDAYS)[weekday];
}

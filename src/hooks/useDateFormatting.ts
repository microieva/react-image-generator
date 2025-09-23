import { DateTime } from 'luxon';

export const useDateFormatting = (date: string) => {
  return DateTime.fromISO(date)
    .setZone('Europe/Helsinki')
    .toFormat('HH:mm:ss, dd MMM');
};
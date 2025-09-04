import {DateTime} from 'luxon';

export const useDateFormatting = (date:string) => {
  return DateTime.fromISO(date).toFormat('HH:mm:ss, dd MMM')
}
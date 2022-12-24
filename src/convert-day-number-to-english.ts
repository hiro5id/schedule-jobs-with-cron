import { replaceDayNumber } from './replace-day-number';

export function convertDayNumberToEnglish(english: string) {
  let replaced = replaceDayNumber(english, 1, 'Monday');
  replaced = replaceDayNumber(replaced, 2, 'Tuesday');
  replaced = replaceDayNumber(replaced, 3, 'Wednesday');
  replaced = replaceDayNumber(replaced, 4, 'Thursday');
  replaced = replaceDayNumber(replaced, 5, 'Friday');
  replaced = replaceDayNumber(replaced, 6, 'Saturday');
  replaced = replaceDayNumber(replaced, 7, 'Sunday');
  return replaced;
}

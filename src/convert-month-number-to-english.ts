import { replaceMonthNumber } from './replace-month-number';

export function convertMonthNumberToEnglish(english: string) {
  let replaced = replaceMonthNumber(english, 12, 'December');
  replaced = replaceMonthNumber(replaced, 11, 'November');
  replaced = replaceMonthNumber(replaced, 10, 'October');
  replaced = replaceMonthNumber(replaced, 9, 'September');
  replaced = replaceMonthNumber(replaced, 8, 'August');
  replaced = replaceMonthNumber(replaced, 7, 'July');
  replaced = replaceMonthNumber(replaced, 6, 'June');
  replaced = replaceMonthNumber(replaced, 5, 'May');
  replaced = replaceMonthNumber(replaced, 4, 'April');
  replaced = replaceMonthNumber(replaced, 3, 'March');
  replaced = replaceMonthNumber(replaced, 2, 'February');
  replaced = replaceMonthNumber(replaced, 1, 'January');
  return replaced;
}

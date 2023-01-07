export function convertDayRangeToEnglish(rangeInEnglish: string) {
  let replaced = rangeInEnglish.replace('1', 'Monday');
  replaced = replaced.replace('2', 'Tuesday');
  replaced = replaced.replace('3', 'Wednesday');
  replaced = replaced.replace('4', 'Thursday');
  replaced = replaced.replace('5', 'Friday');
  replaced = replaced.replace('6', 'Saturday');
  replaced = replaced.replace('7', 'Sunday');
  return replaced;
}

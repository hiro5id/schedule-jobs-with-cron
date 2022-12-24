export function convertMonthRangeToEnglish(rangeInEnglish: string) {
  let replaced = rangeInEnglish.replace('12', 'December');
  replaced = replaced.replace('11', 'November');
  replaced = replaced.replace('10', 'October');
  replaced = replaced.replace('9', 'September');
  replaced = replaced.replace('8', 'August');
  replaced = replaced.replace('7', 'July');
  replaced = replaced.replace('6', 'June');
  replaced = replaced.replace('5', 'May');
  replaced = replaced.replace('4', 'April');
  replaced = replaced.replace('3', 'March');
  replaced = replaced.replace('2', 'February');
  replaced = replaced.replace('1', 'January');
  return replaced;
}

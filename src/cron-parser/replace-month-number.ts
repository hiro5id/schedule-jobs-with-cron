export function replaceMonthNumber(input: string, monthNumber: number, monthName: string) {
  let replaced = input.replace(`month ${monthNumber}`, monthName);
  replaced = replaced.replace(`${monthNumber},`, `${monthName},`);
  replaced = replaced.replace(`and ${monthNumber}`, `and ${monthName}`);
  replaced = replaced.replace(`, ${monthNumber}`, `, ${monthName}`);
  return replaced;
}

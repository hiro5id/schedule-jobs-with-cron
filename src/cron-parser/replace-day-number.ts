export function replaceDayNumber(input: string, dayNumber: number, dayName: string) {
  let replaced = input.replace(`day-of-week ${dayNumber}`, dayName);
  replaced = replaced.replace(`${dayNumber},`, `${dayName},`);
  replaced = replaced.replace(`and ${dayNumber}`, `and ${dayName}`);
  replaced = replaced.replace(`, ${dayNumber}`, `, ${dayName}`);
  return replaced;
}

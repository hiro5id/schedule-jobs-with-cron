export function IsPositiveInteger(str: string) {
  // noinspection SuspiciousTypeOfGuard
  if (!str || typeof str !== 'string') {
    return false;
  }
  if (str.trim().length <= 0) {
    return false;
  }
  const num = Number(str.trim());
  return Number.isInteger(num) && num >= 0;
}

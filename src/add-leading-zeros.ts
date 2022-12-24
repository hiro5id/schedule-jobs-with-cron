export function addLeadingZeros(num: number, totalLength: number) {
  return String(num).padStart(totalLength, '0');
}

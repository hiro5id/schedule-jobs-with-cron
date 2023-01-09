import { replaceAll } from './replace-all';

export function cleanCronSpecInput(cronSPec: string) {
  if (!cronSPec) {
    return '';
  }
  // clean nbsp
  let cleanedCronSpec = replaceAll(cronSPec, String.fromCharCode(160), ' ');
  // clean consecutive spaces and tabs
  cleanedCronSpec = cleanedCronSpec.replace(/\s\s+/g, ' ');
  return cleanedCronSpec.trim();
}

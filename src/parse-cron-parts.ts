import { IAllProcessedParts } from './all-processed-parts.interface';
import { CronPartUnitEnum } from './cron-part-unit.enum';
import { parseCronPart } from './parse-cron-part';
import { addLeadingZeros } from './add-leading-zeros';

export function parseCronParts(cronSPec: string, throwsExceptionOnFail: boolean = true): IAllProcessedParts {
  const parts = cronSPec?.trim().toLowerCase().split(' ');

  // begin parsing
  if (parts.length == 5) {
    // If day of week is passed in, then convert it to number representation
    const allowableDaysOfWeek = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
    if (allowableDaysOfWeek.indexOf(parts[4].toLowerCase()) >= 0) {
      parts[4] = (allowableDaysOfWeek.indexOf(parts[4].toLowerCase()) + 1).toString();
    }

    const processedParts = {
      minute: parseCronPart(parts[0], CronPartUnitEnum.MINUTE),
      hour: parseCronPart(parts[1], CronPartUnitEnum.HOUR),
      day_of_month: parseCronPart(parts[2], CronPartUnitEnum.DAY_OF_MONTH),
      month: parseCronPart(parts[3], CronPartUnitEnum.MONTH),
      day_of_week: parseCronPart(parts[4], CronPartUnitEnum.DAY_OF_WEEK),
    };

    const englishMinute = `At ${processedParts.minute.english}`;

    let englishHour = '';
    if (parts[1].trim() != '*') {
      englishHour = ` past ${processedParts.hour.english}`;
    }

    let englishDayOfMonth = '';
    if (parts[2].trim() != '*') {
      englishDayOfMonth = ` on ${processedParts.day_of_month.english}`;
    }

    let englishDayOfWeek = '';
    if (parts[4].trim() != '*') {
      englishDayOfWeek = ` and on ${processedParts.day_of_week.english}`;
    }

    let englishMonth = '';
    if (parts[3].trim() != '*') {
      englishMonth = ` in ${processedParts.month.english}`;
    }

    let completeComposedEnglish = `${englishMinute}${englishHour}${englishDayOfMonth}${englishDayOfWeek}${englishMonth}`;

    // shorthand modifications
    // example: minute 5 past hour 0
    if (processedParts.hour.matrix.length == 1 && processedParts.minute.matrix.length == 1) {
      completeComposedEnglish = completeComposedEnglish.replace(
        /minute [0-9]+ past hour [0-9]+/g,
        `${addLeadingZeros(processedParts.hour.matrix[0], 2)}:${addLeadingZeros(processedParts.minute.matrix[0], 2)}`,
      );
    }
    if (throwsExceptionOnFail) {
      if (processedParts.minute.matrix.length == 0) {
        throw new Error(`unable to parse minute from spec: [${cronSPec}]`);
      }
      if (processedParts.hour.matrix.length == 0) {
        throw new Error(`unable to parse hour from spec: [${cronSPec}]`);
      }
      if (processedParts.day_of_month.matrix.length == 0) {
        throw new Error(`unable to parse day of month from spec: [${cronSPec}]`);
      }
      if (processedParts.month.matrix.length == 0) {
        throw new Error(`unable to parse month from spec: [${cronSPec}]`);
      }
      if (processedParts.day_of_week.matrix.length == 0) {
        throw new Error(`unable to parse day of week from spec: [${cronSPec}]`);
      }
    }
    return { ...processedParts, english: completeComposedEnglish };
  } else {
    if (throwsExceptionOnFail) {
      throw new Error(`unable to parse cron spec provided: [${cronSPec}]`);
    }
    return {} as any;
  }
}

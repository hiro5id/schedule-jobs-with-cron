import { CronPartUnitEnum } from './cron-part-unit.enum';
import { IParsedCronPart } from './parsed-cron-part.interface';
import { convertDayNumberToEnglish } from './convert-day-number-to-english';
import { convertMonthRangeToEnglish } from './convert-month-range-to-english';
import { convertDayRangeToEnglish } from './convert-day-range-to-english';
import { GetUnitDetail } from './get-unit-detail';
import { IsPositiveInteger } from './is-positive-integer';
import { convertMonthNumberToEnglish } from './convert-month-number-to-english';

export function parseCronPart(cronPart: string, unit: CronPartUnitEnum): IParsedCronPart {
  const unitDetail = GetUnitDetail(unit);
  const parts = cronPart?.trim().toLowerCase().split(',');
  const timeMatrix = new Set<number>();
  let english = '';
  const emptyResult = { english: '', matrix: [] };

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    /*
     ********* integers ex: 4
     * ex: minute 3
     */
    if (IsPositiveInteger(part)) {
      // Fill Matrix
      const minuteTick = parseInt(part, 10);
      if (minuteTick < unitDetail.min || minuteTick > unitDetail.max) return emptyResult;
      timeMatrix.add(minuteTick);

      // Fill English
      if (english.length == 0) {
        english = `${unitDetail.singular} `;
      } else {
        if (parts.length > 2) {
          english += ', ';
        } else {
          english += ' ';
        }
        if (i == parts.length - 1) {
          english += 'and ';
        }
      }
      english += `${part}`;
      if (unit == CronPartUnitEnum.MONTH) {
        english = convertMonthNumberToEnglish(english);
      }
      if (unit == CronPartUnitEnum.DAY_OF_WEEK) {
        english = convertDayNumberToEnglish(english);
      }
    } else if (part?.trim().toLowerCase().split('-').length - 1 == 1 && part?.trim().toLowerCase().split('/').length - 1 == 0) {
      /*
       ********* Ranges ex: 4-7
       * ex: every minute from 4 through 5
       */
      const ranges = part?.trim().toLowerCase().split('-');
      // Following is error case so return empty if so
      if (ranges.length != 2) {
        return emptyResult;
      }
      if (ranges[0].length == 0 || ranges[1].length == 0) {
        return emptyResult;
      }
      const start = parseInt(ranges[0], 10);
      const end = parseInt(ranges[1], 10);

      if (end < start || end > unitDetail.max || start < unitDetail.min || !IsPositiveInteger(start.toString()) || !IsPositiveInteger(end.toString())) {
        return emptyResult;
      }

      // Fill matrix
      for (let i = start; i <= end; i++) {
        timeMatrix.add(i);
      }

      // Fill English
      if (english.length > 0) {
        if (parts.length > 2) {
          english += ', ';
        } else {
          english += ' ';
        }
        if (i == parts.length - 1) {
          english += 'and ';
        }
      }
      let englishStart = `${start}`;
      let englishEnd = `${end}`;
      if (unit == CronPartUnitEnum.MONTH) {
        englishStart = convertMonthRangeToEnglish(englishStart);
        englishEnd = convertMonthRangeToEnglish(englishEnd);
      }
      if (unit == CronPartUnitEnum.DAY_OF_WEEK) {
        englishStart = convertDayRangeToEnglish(englishStart);
        englishEnd = convertDayRangeToEnglish(englishEnd);
      }
      english += `every ${unitDetail.singular} from ${englishStart} through ${englishEnd}`;
    } else if (part == '*') {
      /*
       ********* star ex: *
       * ex: minute *
       */
      // Fill matrix
      for (let i = unitDetail.min; i <= unitDetail.max; i++) {
        timeMatrix.add(i);
      }

      // Fill English
      if (english.length > 0) {
        if (parts.length > 2) {
          english += ', ';
        } else {
          english += ' ';
        }
        if (i == parts.length - 1) {
          english += 'and ';
        }
      }
      english += `every ${unitDetail.singular}`;
      if (unit == CronPartUnitEnum.DAY_OF_WEEK) {
        english = english.replace(`every ${unitDetail.singular}`, 'every day');
      }
    } else if (part?.trim().split('/').length - 1 == 1) {
      /*
       ********* fraction
       */
      const dividers = part?.trim().toLowerCase().split('/');
      if (dividers.length != 2) {
        return emptyResult;
      }
      if (dividers[0].length == 0 || dividers[1].length == 0) {
        return emptyResult;
      }

      let start = unitDetail.min;
      let end = unitDetail.max;
      let rangeInEnglish = '';

      if (dividers[0].split('-').length - 1 == 1) {
        const splitDividerOne = dividers[0].split('-');
        if (!IsPositiveInteger(splitDividerOne[0]) || !IsPositiveInteger(splitDividerOne[1])) {
          return emptyResult;
        }
        start = parseInt(splitDividerOne[0], 10);
        end = parseInt(splitDividerOne[1], 10);
        if (start > end || (unit == CronPartUnitEnum.DAY_OF_MONTH && end > 33)) {
          return emptyResult;
        }
        rangeInEnglish = ` from ${start} through ${end}`;
      } else if (IsPositiveInteger(dividers[0])) {
        start = parseInt(dividers[0], 10);
        if (start < unitDetail.min) {
          return emptyResult;
        }
        rangeInEnglish = ` from ${start} through ${end}`;
      }
      if (unit == CronPartUnitEnum.MONTH) {
        rangeInEnglish = convertMonthRangeToEnglish(rangeInEnglish);
      }
      if (unit == CronPartUnitEnum.DAY_OF_WEEK) {
        rangeInEnglish = convertDayRangeToEnglish(rangeInEnglish);
      }
      const stepper = parseInt(dividers[1], 10);

      if (stepper > unitDetail.max) {
        return emptyResult;
      }
      //fill matrix
      for (let i = start; i <= end; i += stepper) {
        timeMatrix.add(i);
      }

      // Fill English
      let postfix = '';
      if (dividers[1].endsWith('1')) {
        postfix = 'st';
      } else if (dividers[1].endsWith('2')) {
        postfix = 'nd';
      } else if (dividers[1].endsWith('3')) {
        postfix = 'rd';
      } else {
        postfix = 'th';
      }

      if (unit == CronPartUnitEnum.MONTH) {
        postfix = 'th';
        if (dividers[1] == '1') {
          postfix = 'st';
        } else if (dividers[1] == '2') {
          postfix = 'nd';
        } else if (dividers[1] == '3') {
          postfix = 'rd';
        }
      }

      if (english.length > 0) {
        if (parts.length > 2) {
          english += ', ';
        } else {
          english += ' ';
        }
        if (i == parts.length - 1) {
          english += 'and ';
        }
      }

      let stepperEnglishPhrase = '';
      if (stepper == 1) {
        stepperEnglishPhrase = ' ';
      } else {
        stepperEnglishPhrase = ` ${stepper}${postfix} `;
      }

      english += `every${stepperEnglishPhrase}${unitDetail.singular}${rangeInEnglish}`;
    } else {
      return emptyResult;
    }
  }

  return {
    english: english,
    matrix: Array.from(timeMatrix).sort((a, b) => a - b),
  };
}

import { expect } from 'chai';
import { IsPositiveInteger } from '../src/is-positive-integer';
import { parseCronParts } from '../src/parse-cron-parts';
import { CronScheduleGenerator } from '../src/cron-schedule-generator';
import { CronPartUnitEnum } from '../src/cron-part-unit.enum';
import { parseCronPart } from '../src/parse-cron-part';

function f(input: Date) {
  return input.toLocaleString('en-US', { timeStyle: 'full', dateStyle: 'full' });
}
describe('schedule-jobs-with-cron', function () {
  it('generates schedule for 5 0 * 8 *', function () {
    const startDate = new Date('2022-12-23T19:00:00.000-04:00');

    const cronScheduleGenerator = new CronScheduleGenerator('5 0 * 8 *', startDate);

    expect(cronScheduleGenerator.englishDescriptionOfSchedule).eql('At 00:05 in August');
    expect(f(cronScheduleGenerator.GetNextScheduledDate())).eql('Tuesday, August 1, 2023 at 12:05:00 AM Eastern Daylight Time');
    expect(f(cronScheduleGenerator.GetNextScheduledDate())).eql('Wednesday, August 2, 2023 at 12:05:00 AM Eastern Daylight Time');
    expect(f(cronScheduleGenerator.GetNextScheduledDate())).eql('Thursday, August 3, 2023 at 12:05:00 AM Eastern Daylight Time');
    expect(f(cronScheduleGenerator.GetNextScheduledDate())).eql('Friday, August 4, 2023 at 12:05:00 AM Eastern Daylight Time');
  });

  it('generates schedule for 15 14/4 1 5,4,2 */2', function () {
    const startDate = new Date(2022, 11, 23, 19, 0, 0, 0);

    const cronScheduleGenerator = new CronScheduleGenerator('15 14/4 1 5,4,2 */2', startDate);

    expect(f(cronScheduleGenerator.GetNextScheduledDate())).eql('Wednesday, February 1, 2023 at 2:15:00 PM Eastern Standard Time');
    expect(f(cronScheduleGenerator.GetNextScheduledDate())).eql('Wednesday, February 1, 2023 at 6:15:00 PM Eastern Standard Time');
    expect(f(cronScheduleGenerator.GetNextScheduledDate())).eql('Wednesday, February 1, 2023 at 10:15:00 PM Eastern Standard Time');
    expect(f(cronScheduleGenerator.GetNextScheduledDate())).eql('Monday, May 1, 2023 at 2:15:00 PM Eastern Daylight Time');
  });

  it('throws exception when using invalid expression2', function () {
    const startDate = new Date(2022, 11, 23, 19, 0, 0, 0);
    expect(() => {
      new CronScheduleGenerator('* * / * *', startDate);
    }).to.throw('unable to parse day of month from spec: [* * / * *]');
  });

  it('throws exception when using invalid expression', function () {
    const startDate = new Date(2022, 11, 23, 19, 0, 0, 0);
    expect(() => {
      new CronScheduleGenerator('a b c d e', startDate);
    }).to.throw('unable to parse minute from spec: [a b c d e]');
  });

  it('parse cron 0 22 4/3 2,3,1-5 1-5', function () {
    const result = parseCronParts('0 22 4/3 2,3,1-5 1-5');
    expect(result.english).eql(
      'At 22:00 on every 3rd day-of-month from 4 through 31 and on every day-of-week from Monday through Friday in February, March, and every month from January through May',
    );
  });

  it('parse cron 0 0 1,15 * 3', function () {
    const result = parseCronParts('0 0 1,15 * 3');
    expect(result.english).eql('At 00:00 on day-of-month 1 and 15 and on Wednesday');
  });

  it('parse cron 0 4 8-14 * *', function () {
    const result = parseCronParts('0 4 8-14 * *');
    expect(result.english).eql('At 04:00 on every day-of-month from 8 through 14');
  });

  it('parse cron 0 0,12 1 */2 *', function () {
    const result = parseCronParts('0 0,12 1 */2 *');
    expect(result.english).eql('At minute 0 past hour 0 and 12 on day-of-month 1 in every 2nd month');
  });

  it('parse cron 23 5 4 * * sun', function () {
    const result = parseCronParts('5 4 * * sun');
    expect(result.english).eql('At 04:05 and on Sunday');
  });

  it('parse cron 23 0-20/2 * * *', function () {
    const result = parseCronParts('23 0-20/2 * * *');
    expect(result.english).eql('At minute 23 past every 2nd hour from 0 through 20');
  });

  it('parse cron 0 22 * * 1-5', function () {
    const result = parseCronParts('0 22 * * 1-5');
    expect(result.english).eql('At 22:00 and on every day-of-week from Monday through Friday');
  });

  it('parse cron */4 2 4 2', function () {
    const result = parseCronParts('15 */4 2 4 2');
    expect(result.english).eql('At minute 15 past every 4th hour on day-of-month 2 and on Tuesday in April');
  });

  it('parse cron 15 14/4 1 5,4,2 */2', function () {
    const result = parseCronParts('15 14/4 1 5,4,2 */2');
    expect(result.english).eql('At minute 15 past every 4th hour from 14 through 23 on day-of-month 1 and on every 2nd day-of-week in May, April, and February');
  });

  it('parse cron 15 14/4 1 * *', function () {
    const result = parseCronParts('15 14/4 1 * *');
    expect(result.english).eql('At minute 15 past every 4th hour from 14 through 23 on day-of-month 1');
  });

  it('parse cron 15 14 1 * *', function () {
    const result = parseCronParts('15 14 1 * *');
    expect(result.english).eql('At 14:15 on day-of-month 1');
  });

  it('parse cron 5 0 * 8 *', function () {
    const result = parseCronParts('5 0 * 8 *');
    expect(result.english).eql('At 00:05 in August');
  });

  it('parse cron * * * * *', function () {
    const result = parseCronParts('* * * * *');
    expect(result.english).eql('At every minute');
  });

  it('parse cron 3 3/4 8 10-11 6', function () {
    const result = parseCronParts('3 3/4 8 10-11 6');
    expect(result.english).eql('At minute 3 past every 4th hour from 3 through 23 on day-of-month 8 and on Saturday in every month from October through November');
  });

  describe('test cron part parsing', function () {
    [
      /*************** DAY ******************/
      {
        input: '1-5',
        expectedEnglish: 'every day-of-week from Monday through Friday',
        expectMatrix: [1, 2, 3, 4, 5],
        unit: CronPartUnitEnum.DAY_OF_WEEK,
      },
      {
        input: '1-2,3-5',
        expectedEnglish: 'every day-of-week from Monday through Tuesday and every day-of-week from Wednesday through Friday',
        expectMatrix: [1, 2, 3, 4, 5],
        unit: CronPartUnitEnum.DAY_OF_WEEK,
      },
      {
        input: '1-5/3',
        expectedEnglish: 'every 3rd day-of-week from Monday through Friday',
        expectMatrix: [1, 4],
        unit: CronPartUnitEnum.DAY_OF_WEEK,
      },
      {
        input: '*/2',
        expectedEnglish: 'every 2nd day-of-week',
        expectMatrix: [1, 3, 5, 7],
        unit: CronPartUnitEnum.DAY_OF_WEEK,
      },
      {
        input: '1,2,3,4,5,6,7',
        expectedEnglish: 'Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, and Sunday',
        expectMatrix: [1, 2, 3, 4, 5, 6, 7],
        unit: CronPartUnitEnum.DAY_OF_WEEK,
      },
      {
        input: '6',
        expectedEnglish: 'Saturday',
        expectMatrix: [6],
        unit: CronPartUnitEnum.DAY_OF_WEEK,
      },
      {
        input: '2-6/2,3,5,3',
        expectedEnglish: 'every 2nd day-of-week from Tuesday through Saturday, Wednesday, Friday, and Wednesday',
        expectMatrix: [2, 3, 4, 5, 6],
        unit: CronPartUnitEnum.DAY_OF_WEEK,
      },
      {
        input: '*',
        expectedEnglish: 'every day',
        expectMatrix: [1, 2, 3, 4, 5, 6, 7],
        unit: CronPartUnitEnum.DAY_OF_WEEK,
      },

      /*************** MONTH ******************/
      {
        input: '10-11',
        expectedEnglish: 'every month from October through November',
        expectMatrix: [10, 11],
        unit: CronPartUnitEnum.MONTH,
      },
      {
        input: '4-6/2,3,5,3',
        expectedEnglish: 'every 2nd month from April through June, March, May, and March',
        expectMatrix: [3, 4, 5, 6],
        unit: CronPartUnitEnum.MONTH,
      },
      {
        input: '4-6/2',
        expectedEnglish: 'every 2nd month from April through June',
        expectMatrix: [4, 6],
        unit: CronPartUnitEnum.MONTH,
      },
      {
        input: '2/12',
        expectedEnglish: 'every 12th month from February through December',
        expectMatrix: [2],
        unit: CronPartUnitEnum.MONTH,
      },
      {
        input: '1',
        expectedEnglish: 'January',
        expectMatrix: [1],
        unit: CronPartUnitEnum.MONTH,
      },
      {
        input: '2',
        expectedEnglish: 'February',
        expectMatrix: [2],
        unit: CronPartUnitEnum.MONTH,
      },
      {
        input: '3',
        expectedEnglish: 'March',
        expectMatrix: [3],
        unit: CronPartUnitEnum.MONTH,
      },
      {
        input: '4',
        expectedEnglish: 'April',
        expectMatrix: [4],
        unit: CronPartUnitEnum.MONTH,
      },
      {
        input: '5',
        expectedEnglish: 'May',
        expectMatrix: [5],
        unit: CronPartUnitEnum.MONTH,
      },
      {
        input: '6',
        expectedEnglish: 'June',
        expectMatrix: [6],
        unit: CronPartUnitEnum.MONTH,
      },
      {
        input: '7',
        expectedEnglish: 'July',
        expectMatrix: [7],
        unit: CronPartUnitEnum.MONTH,
      },
      {
        input: '8',
        expectedEnglish: 'August',
        expectMatrix: [8],
        unit: CronPartUnitEnum.MONTH,
      },
      {
        input: '9',
        expectedEnglish: 'September',
        expectMatrix: [9],
        unit: CronPartUnitEnum.MONTH,
      },
      {
        input: '10',
        expectedEnglish: 'October',
        expectMatrix: [10],
        unit: CronPartUnitEnum.MONTH,
      },
      {
        input: '11',
        expectedEnglish: 'November',
        expectMatrix: [11],
        unit: CronPartUnitEnum.MONTH,
      },
      {
        input: '12',
        expectedEnglish: 'December',
        expectMatrix: [12],
        unit: CronPartUnitEnum.MONTH,
      },
      {
        input: '*',
        expectedEnglish: 'every month',
        expectMatrix: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        unit: CronPartUnitEnum.MONTH,
      },
      {
        input: '*',
        expectedEnglish: 'every month',
        expectMatrix: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        unit: CronPartUnitEnum.MONTH,
      },
      /*************** DAY OF MONTH ******************/
      {
        input: '9-12',
        expectedEnglish: 'every day-of-month from 9 through 12',
        expectMatrix: [9, 10, 11, 12],
        unit: CronPartUnitEnum.DAY_OF_MONTH,
      },
      {
        input: '4-6/2,3,5,3',
        expectedEnglish: 'every 2nd day-of-month from 4 through 6, 3, 5, and 3',
        expectMatrix: [3, 4, 5, 6],
        unit: CronPartUnitEnum.DAY_OF_MONTH,
      },
      {
        input: '4-33/6',
        expectedEnglish: 'every 6th day-of-month from 4 through 33',
        expectMatrix: [4, 10, 16, 22, 28],
        unit: CronPartUnitEnum.DAY_OF_MONTH,
      },
      {
        input: '4-5/6',
        expectedEnglish: 'every 6th day-of-month from 4 through 5',
        expectMatrix: [4],
        unit: CronPartUnitEnum.DAY_OF_MONTH,
      },
      {
        input: '*/6',
        expectedEnglish: 'every 6th day-of-month',
        expectMatrix: [1, 7, 13, 19, 25, 31],
        unit: CronPartUnitEnum.DAY_OF_MONTH,
      },
      {
        input: '*',
        expectedEnglish: 'every day-of-month',
        expectMatrix: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
        unit: CronPartUnitEnum.DAY_OF_MONTH,
      },
      {
        input: '1-5',
        expectedEnglish: 'every day-of-month from 1 through 5',
        expectMatrix: [1, 2, 3, 4, 5],
        unit: CronPartUnitEnum.DAY_OF_MONTH,
      },
      {
        input: '5',
        expectedEnglish: 'day-of-month 5',
        expectMatrix: [5],
        unit: CronPartUnitEnum.DAY_OF_MONTH,
      },
      /*************** HOURS ******************/
      {
        input: '3/2',
        expectedEnglish: 'every 2nd hour from 3 through 23',
        expectMatrix: [3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23],
        unit: CronPartUnitEnum.HOUR,
      },
      {
        input: '*',
        expectedEnglish: 'every hour',
        expectMatrix: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
        unit: CronPartUnitEnum.HOUR,
      },
      {
        input: '3-6/2',
        expectedEnglish: 'every 2nd hour from 3 through 6',
        expectMatrix: [3, 5],
        unit: CronPartUnitEnum.HOUR,
      },
      {
        input: '3-6/1',
        expectedEnglish: 'every hour from 3 through 6',
        expectMatrix: [3, 4, 5, 6],
        unit: CronPartUnitEnum.HOUR,
      },
      {
        input: '6/22',
        expectedEnglish: 'every 22nd hour from 6 through 23',
        expectMatrix: [6],
        unit: CronPartUnitEnum.HOUR,
      },
      {
        input: '*/22',
        expectedEnglish: 'every 22nd hour',
        expectMatrix: [0, 22],
        unit: CronPartUnitEnum.HOUR,
      },
      {
        input: '1/3',
        expectedEnglish: 'every 3rd hour from 1 through 23',
        expectMatrix: [1, 4, 7, 10, 13, 16, 19, 22],
        unit: CronPartUnitEnum.HOUR,
      },
      {
        input: '5',
        expectedEnglish: 'hour 5',
        expectMatrix: [5],
        unit: CronPartUnitEnum.HOUR,
      },
      /*************** MINUTES ******************/
      {
        input: '0',
        expectedEnglish: 'minute 0',
        expectMatrix: [0],
        unit: CronPartUnitEnum.MINUTE,
      },
      {
        input: '1',
        expectedEnglish: 'minute 1',
        expectMatrix: [1],
        unit: CronPartUnitEnum.MINUTE,
      },
      {
        input: '4/30',
        expectedEnglish: 'every 30th minute from 4 through 59',
        expectMatrix: [4, 34],
        unit: CronPartUnitEnum.MINUTE,
      },
      {
        input: '*/30',
        expectedEnglish: 'every 30th minute',
        expectMatrix: [0, 30],
        unit: CronPartUnitEnum.MINUTE,
      },
      {
        input: '1-33/30',
        expectedEnglish: 'every 30th minute from 1 through 33',
        expectMatrix: [1, 31],
        unit: CronPartUnitEnum.MINUTE,
      },
      {
        input: '1-2/30',
        expectedEnglish: 'every 30th minute from 1 through 2',
        expectMatrix: [1],
        unit: CronPartUnitEnum.MINUTE,
      },
      {
        input: '10-59/3',
        expectedEnglish: 'every 3rd minute from 10 through 59',
        expectMatrix: [10, 13, 16, 19, 22, 25, 28, 31, 34, 37, 40, 43, 46, 49, 52, 55, 58],
        unit: CronPartUnitEnum.MINUTE,
      },
      {
        input: '*/3,*/3,*/3',
        expectedEnglish: 'every 3rd minute, every 3rd minute, and every 3rd minute',
        expectMatrix: [0, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36, 39, 42, 45, 48, 51, 54, 57],
        unit: CronPartUnitEnum.MINUTE,
      },
      {
        input: '*/3,*/2',
        expectedEnglish: 'every 3rd minute and every 2nd minute',
        expectMatrix: [0, 2, 3, 4, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20, 21, 22, 24, 26, 27, 28, 30, 32, 33, 34, 36, 38, 39, 40, 42, 44, 45, 46, 48, 50, 51, 52, 54, 56, 57, 58],
        unit: CronPartUnitEnum.MINUTE,
      },
      {
        input: '*/3',
        expectedEnglish: 'every 3rd minute',
        expectMatrix: [0, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36, 39, 42, 45, 48, 51, 54, 57],
        unit: CronPartUnitEnum.MINUTE,
      },
      {
        input: '*/3,9,23',
        expectedEnglish: 'every 3rd minute, 9, and 23',
        expectMatrix: [0, 3, 6, 9, 12, 15, 18, 21, 23, 24, 27, 30, 33, 36, 39, 42, 45, 48, 51, 54, 57],
        unit: CronPartUnitEnum.MINUTE,
      },
      {
        input: '9,6-7,30',
        expectedEnglish: 'minute 9, every minute from 6 through 7, and 30',
        expectMatrix: [6, 7, 9, 30],
        unit: CronPartUnitEnum.MINUTE,
      },
      {
        input: '9,6-7',
        expectedEnglish: 'minute 9 and every minute from 6 through 7',
        expectMatrix: [6, 7, 9],
        unit: CronPartUnitEnum.MINUTE,
      },
      {
        input: '9,4',
        expectedEnglish: 'minute 9 and 4',
        expectMatrix: [4, 9],
        unit: CronPartUnitEnum.MINUTE,
      },
      {
        input: '9,*',
        expectedEnglish: 'minute 9 and every minute',
        expectMatrix: Array.from(Array(60).keys()),
        unit: CronPartUnitEnum.MINUTE,
      },
      {
        input: '*,*,*',
        expectedEnglish: 'every minute, every minute, and every minute',
        expectMatrix: Array.from(Array(60).keys()),
        unit: CronPartUnitEnum.MINUTE,
      },
      {
        input: '*,*',
        expectedEnglish: 'every minute and every minute',
        expectMatrix: Array.from(Array(60).keys()),
        unit: CronPartUnitEnum.MINUTE,
      },
      {
        input: '*',
        expectedEnglish: 'every minute',
        expectMatrix: Array.from(Array(60).keys()),
        unit: CronPartUnitEnum.MINUTE,
      },
      {
        input: '4-5,8,9,11-12',
        expectedEnglish: 'every minute from 4 through 5, 8, 9, and every minute from 11 through 12',
        expectMatrix: [4, 5, 8, 9, 11, 12],
        unit: CronPartUnitEnum.MINUTE,
      },
      {
        input: '59-59',
        expectedEnglish: 'every minute from 59 through 59',
        expectMatrix: [59],
        unit: CronPartUnitEnum.MINUTE,
      },
      {
        input: '50-55',
        expectedEnglish: 'every minute from 50 through 55',
        expectMatrix: [50, 51, 52, 53, 54, 55],
        unit: CronPartUnitEnum.MINUTE,
      },
      {
        input: '3,4,5-8',
        expectedEnglish: 'minute 3, 4, and every minute from 5 through 8',
        expectMatrix: [3, 4, 5, 6, 7, 8],
        unit: CronPartUnitEnum.MINUTE,
      },
      {
        input: '3-6,4,5-8',
        expectedEnglish: 'every minute from 3 through 6, 4, and every minute from 5 through 8',
        expectMatrix: [3, 4, 5, 6, 7, 8],
        unit: CronPartUnitEnum.MINUTE,
      },
      {
        input: '5',
        expectedEnglish: 'minute 5',
        expectMatrix: [5],
        unit: CronPartUnitEnum.MINUTE,
      },
      {
        input: '3,4,5',
        expectedEnglish: 'minute 3, 4, and 5',
        expectMatrix: [3, 4, 5],
        unit: CronPartUnitEnum.MINUTE,
      },
      {
        input: '3',
        expectedEnglish: 'minute 3',
        expectMatrix: [3],
        unit: CronPartUnitEnum.MINUTE,
      },
    ].forEach(testCase => {
      it(`parses ${testCase.unit}: ${testCase.input}`, function () {
        const result = parseCronPart(testCase.input, testCase.unit);
        expect(result.matrix).eql(testCase.expectMatrix);
        expect(result.english).eql(testCase.expectedEnglish);
      });
    });
  });

  describe('test invalid DAY cases', function () {
    ['0', '13', '8'].forEach((testCase: string) => {
      it(`will not parse invalid minute: ${testCase}`, function () {
        const result = parseCronPart(testCase, CronPartUnitEnum.DAY_OF_WEEK);

        expect(result.english).eql('');
        expect(result.matrix).eql([]);
      });
    });
  });

  describe('test invalid MONTH cases', function () {
    ['0', '13'].forEach((testCase: string) => {
      it(`will not parse invalid minute: ${testCase}`, function () {
        const result = parseCronPart(testCase, CronPartUnitEnum.MONTH);

        expect(result.english).eql('');
        expect(result.matrix).eql([]);
      });
    });
  });

  describe('test invalid DAY_OF_MONTH cases', function () {
    ['0', '0/6', '4-34/6', '0', '33'].forEach((testCase: string) => {
      it(`will not parse invalid minute: ${testCase}`, function () {
        const result = parseCronPart(testCase, CronPartUnitEnum.DAY_OF_MONTH);

        expect(result.english).eql('');
        expect(result.matrix).eql([]);
      });
    });
  });

  describe('test invalid HOUR cases', function () {
    ['24', '6-3/1', '*/24', '*-*', '5-4', '59-60', '-4', 'f', '60', 'a-d', 'a', '2-b', ',', '.', '1-2-3'].forEach((testCase: string) => {
      it(`will not parse invalid minute: ${testCase}`, function () {
        const result = parseCronPart(testCase, CronPartUnitEnum.HOUR);

        expect(result.english).eql('');
        expect(result.matrix).eql([]);
      });
    });
  });

  describe('test invalid MINUTE cases', function () {
    [',', '*-*', '5-4', '59-60', '-4', 'f', '60', 'a-d', 'a', '2-b', '.', '1-2-3'].forEach((testCase: string) => {
      it(`will not parse invalid minute: ${testCase}`, function () {
        const result = parseCronPart(testCase, CronPartUnitEnum.MINUTE);

        expect(result.english).eql('');
        expect(result.matrix).eql([]);
      });
    });
  });

  it('identifies positive integers', function () {
    {
      const result = IsPositiveInteger(' ');
      expect(result).eql(false);
    }
    {
      const result = IsPositiveInteger('');
      expect(result).eql(false);
    }
    {
      const result = IsPositiveInteger('0');
      expect(result).eql(true);
    }
    {
      const result = IsPositiveInteger('-3');
      expect(result).eql(false);
    }
    {
      const result = IsPositiveInteger('3');
      expect(result).eql(true);
    }
    {
      const result = IsPositiveInteger('3/2');
      expect(result).eql(false);
    }
    {
      const result = IsPositiveInteger('3.2');
      expect(result).eql(false);
    }
    {
      const result = IsPositiveInteger('-3');
      expect(result).eql(false);
    }
    {
      const result = IsPositiveInteger('2-3');
      expect(result).eql(false);
    }
    {
      const result = IsPositiveInteger('3,4');
      expect(result).eql(false);
    }
  });
});

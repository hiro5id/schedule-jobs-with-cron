import { IAllProcessedParts } from './all-processed-parts.interface';
import { parseCronParts } from './parse-cron-parts';

export function NormalizeDayNumber(dayNumber: number): number {
  // Day zero in Javascript is Sunday
  if (dayNumber == 0) {
    // we will return 7 for the purpose of this library 7 is sunday
    return 7;
  }
  // any other number 1 to 6 is monday to saturday
  return dayNumber;
}
export class CronScheduleGenerator {
  /**
   * Accepts a standard crontab specification
   *
   * @param cronTabSchedule - specify crontab schedule ex "* * * * *"  each star position is: [minute] [hour] [day-of-month] [month] [day]
   * @param startDate - specify the date when to begin schedule
   */
  constructor(public readonly cronTabSchedule: string, public readonly startDate: Date) {
    this._parsedCron = parseCronParts(cronTabSchedule);
    this.englishDescriptionOfSchedule = this._parsedCron.english;
    this._triggeredDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), startDate.getHours(), startDate.getMinutes(), 0, 0);
  }

  public readonly englishDescriptionOfSchedule: string;
  private readonly _parsedCron: IAllProcessedParts;
  private _triggeredDate: Date;

  public getNextScheduledDate(fromDate?: Date): Date {
    let now: Date;
    if (fromDate) {
      now = new Date(fromDate.getTime());
    } else {
      now = new Date(this._triggeredDate.getTime());
    }

    for (let i = 0; i < 900100; i++) {
      now.setMinutes(now.getMinutes() + 1);
      //now = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), 0, 0);

      //Check if it matches a trigger
      if (
        this._parsedCron.minute.matrix.includes(now.getMinutes()) &&
        this._parsedCron.hour.matrix.includes(now.getHours()) &&
        this._parsedCron.day_of_month.matrix.includes(now.getDate()) &&
        this._parsedCron.month.matrix.includes(now.getMonth() + 1) &&
        this._parsedCron.day_of_week.matrix.includes(NormalizeDayNumber(now.getDay()))
      ) {
        this._triggeredDate = now;
        return new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), 0, 0);
      }
    }
    throw new Error(`could not find next trigger date, gave up at ${now}`);
  }
}

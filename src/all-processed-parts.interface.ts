import { IParsedCronPart } from './parsed-cron-part.interface';

export interface IAllProcessedParts {
  hour: IParsedCronPart;
  month: IParsedCronPart;
  day_of_month: IParsedCronPart;
  minute: IParsedCronPart;
  day_of_week: IParsedCronPart;
  english: string;
}

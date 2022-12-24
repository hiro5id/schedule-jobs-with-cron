import { CronPartUnitEnum } from './cron-part-unit.enum';
import { UnitDetail } from './unit-detail';

export function GetUnitDetail(unit: CronPartUnitEnum): UnitDetail {
  switch (unit) {
    case CronPartUnitEnum.MINUTE:
      return {
        singular: 'minute',
        plural: 'minutes',
        min: 0,
        max: 59,
      };
    case CronPartUnitEnum.HOUR:
      return {
        singular: 'hour',
        plural: 'hours',
        min: 0,
        max: 23,
      };
    case CronPartUnitEnum.DAY_OF_MONTH:
      return {
        singular: 'day-of-month',
        plural: 'days-of-month',
        min: 1,
        max: 31,
      };
    case CronPartUnitEnum.MONTH:
      return {
        singular: 'month',
        plural: 'months',
        min: 1,
        max: 12,
      };
    case CronPartUnitEnum.DAY_OF_WEEK:
      return {
        singular: 'day-of-week',
        plural: 'days-of-week',
        min: 1,
        max: 7,
      };

    default:
      throw new Error(`singular unit not defined for ${unit}`);
  }
}

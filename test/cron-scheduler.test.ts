import { Job } from '../src/job';
import { expect } from 'chai';

describe('chron scheduler', function () {
  beforeAll(() => {
    jest.useFakeTimers();
  });
  afterAll(() => {
    jest.useRealTimers();
  });

  it('schedules job', async function () {
    let mockDate = `2010-01-01T00:00:00.000Z`;
    const getNowFunc = jest.spyOn(Job.prototype as any, 'getNow');
    getNowFunc.mockImplementation(() => {
      return new Date(mockDate);
    });

    const endTime = new Date(`2010-01-01T00:04:00.000Z`);
    // jest
    //   .spyOn(global.Date, 'now')
    //   .mockImplementationOnce(() => endTime.valueOf());
    // jest.useFakeTimers();

    let triggerOneReached = false;
    let triggerTwoReached = false;

    const jobWorkerFunction: (triggerTime: Date) => Promise<void> = async (triggerTime: Date) => {
      console.log(`Hello this is a test ${triggerTime}`);
      if (!triggerOneReached) {
        triggerOneReached = true;
      }
      if (!triggerTwoReached) {
        triggerTwoReached = true;
      }
    };

    let afterSettingTimeoutCallbackCount = 0;

    const job = new Job(jobWorkerFunction, '*/1 * * * *', {
      endDate: endTime,
      startDate: new Date(mockDate),
      continueOnError: false,
      afterSettingTimeoutCallback: () => {
        jest.advanceTimersByTime(60000);
      },
      beforeExecutingWorkerCallback: () => {
        afterSettingTimeoutCallbackCount += 1;
        mockDate = `2010-01-01T00:0${afterSettingTimeoutCallbackCount}:00.000Z`;
      },
    });

    try {
      await job.getPromise();
    } catch (err) {
      throw err;
    }

    expect(triggerOneReached).to.be.true;
    expect(triggerTwoReached).to.be.true;
  });
});

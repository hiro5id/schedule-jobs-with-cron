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
    let dateMockCallCount = 0;
    const getNowFunc = jest.spyOn(Job.prototype as any, 'getNow');
    getNowFunc.mockImplementation(() => {
      dateMockCallCount += 1;
      if (dateMockCallCount > 4) {
        return new Date(`2010-01-01T00:01:00.000Z`);
      } else {
        return new Date(`2010-01-01T00:00:00.000Z`);
      }
    });

    const endTime = new Date(`2010-01-01T00:30:00.000Z`);
    // jest
    //   .spyOn(global.Date, 'now')
    //   .mockImplementationOnce(() => endTime.valueOf());
    // jest.useFakeTimers();

    let triggerOneReached = false;
    let triggerTwoReached = false;

    const jobFunction: (triggerTime: Date) => Promise<void> = async (triggerTime: Date) => {
      console.log(`Hello this is a test ${triggerTime}`);
      if (!triggerOneReached) {
        triggerOneReached = true;
      }
      if (!triggerTwoReached) {
        triggerTwoReached = true;
      }
    };
    const job = new Job(jobFunction, '*/1 * * * *', { endDate: endTime, startDate: new Date(`2010-01-01T00:00:00.000Z`), continueOnError: false });

    jest.setSystemTime(new Date(`2010-01-01T00:01:00.000Z`));
    //jest.runAllTimers()

    jest.runAllTimers();
    //jest.advanceTimersByTime(60000);
    // jest.advanceTimersByTime(25822);
    // jest.advanceTimersByTime(25822);

    try {
      await job.getPromise();
    } catch (err) {
      throw err;
    }

    expect(triggerOneReached).to.be.true;
    expect(triggerTwoReached).to.be.true;
  });
});

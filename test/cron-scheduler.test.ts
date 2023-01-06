import { Job, JobWorkerFunction, LoggerFunction } from '../src/job';
import { expect } from 'chai';

describe('chron scheduler', function () {
  beforeAll(() => {
    jest.useFakeTimers();
  });
  afterAll(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('schedules job', async function () {
    let mockDate = `2010-01-01T00:00:00.000Z`;
    const jobGetNowMock = jest.spyOn(Job.prototype as any, 'getNow');
    jobGetNowMock.mockImplementation(() => {
      return new Date(mockDate);
    });

    const endTime = new Date(`2010-01-01T00:04:00.000Z`);

    let triggerOneReached = false;
    let triggerTwoReached = false;

    const jobWorkerFunction: JobWorkerFunction = async (triggerTime: Date, log: LoggerFunction) => {
      log('info', `Hello this is a test ${triggerTime}`);
      if (!triggerOneReached) {
        triggerOneReached = true;
      }
      if (!triggerTwoReached) {
        triggerTwoReached = true;
      }
    };

    let afterSettingTimeoutCallbackCount = 0;

    const job = new Job('testjob123', jobWorkerFunction, '*/1 * * * *', {
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

  it('logs messages', async function () {
    let mockDate = `2010-01-01T00:00:00.000Z`;
    const jobGetNowMock = jest.spyOn(Job.prototype as any, 'getNow');
    jobGetNowMock.mockImplementation(() => {
      return new Date(mockDate);
    });

    const consoleMessages: string[] = [];
    const consoleLogMock = jest.spyOn(console, 'log');
    consoleLogMock.mockImplementation(msg => {
      consoleMessages.push(msg);
    });

    const consoleErrors: string[] = [];
    const consoleErrMock = jest.spyOn(console, 'error');
    consoleErrMock.mockImplementation(msg => {
      consoleErrors.push(msg);
    });

    const endTime = new Date(`2010-01-01T00:04:00.000Z`);

    const jobWorkerFunction: JobWorkerFunction = async (triggerTime: Date, log: LoggerFunction) => {
      log('info', `Hello this is a test ${triggerTime}`);
    };

    let afterSettingTimeoutCallbackCount = 0;

    const job = new Job('testjob123', jobWorkerFunction, '*/1 * * * *', {
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

    expect(consoleMessages).eql([
      'Job [testjob123]: Scheduled to execute: At every minute',
      'Job [testjob123]: Scheduling to trigger in the next 60000 ms, at (Thu Dec 31 2009 19:01:00 GMT-0500 (Eastern Standard Time)) the time is now Thu Dec 31 2009 19:00:00 GMT-0500 (Eastern Standard Time).',
      'Job [testjob123]: Hello this is a test Thu Dec 31 2009 19:01:00 GMT-0500 (Eastern Standard Time)',
      'Job [testjob123]: Scheduled trigger finished.',
      'Job [testjob123]: Scheduling to trigger in the next 60000 ms, at (Thu Dec 31 2009 19:02:00 GMT-0500 (Eastern Standard Time)) the time is now Thu Dec 31 2009 19:01:00 GMT-0500 (Eastern Standard Time).',
      'Job [testjob123]: Hello this is a test Thu Dec 31 2009 19:02:00 GMT-0500 (Eastern Standard Time)',
      'Job [testjob123]: Scheduled trigger finished.',
      'Job [testjob123]: Scheduling to trigger in the next 60000 ms, at (Thu Dec 31 2009 19:03:00 GMT-0500 (Eastern Standard Time)) the time is now Thu Dec 31 2009 19:02:00 GMT-0500 (Eastern Standard Time).',
      'Job [testjob123]: Hello this is a test Thu Dec 31 2009 19:03:00 GMT-0500 (Eastern Standard Time)',
      'Job [testjob123]: Scheduled trigger finished.',
      'Job [testjob123]: End date reached, resolving job promise...',
    ]);
    expect(consoleErrors).eql([]);
  });

  it('disables messages when set to false', async function () {
    let mockDate = `2010-01-01T00:00:00.000Z`;
    const jobGetNowMock = jest.spyOn(Job.prototype as any, 'getNow');
    jobGetNowMock.mockImplementation(() => {
      return new Date(mockDate);
    });

    const consoleMessages: string[] = [];
    const consoleLogMock = jest.spyOn(console, 'log');
    consoleLogMock.mockImplementation(msg => {
      consoleMessages.push(msg);
    });

    const consoleErrors: string[] = [];
    const consoleErrMock = jest.spyOn(console, 'error');
    consoleErrMock.mockImplementation(msg => {
      consoleErrors.push(msg);
    });

    const endTime = new Date(`2010-01-01T00:04:00.000Z`);

    const jobWorkerFunction: JobWorkerFunction = async (triggerTime: Date, log: LoggerFunction) => {
      log('info', `Hello this is a test ${triggerTime}`);
    };

    let afterSettingTimeoutCallbackCount = 0;

    const job = new Job('testjob123', jobWorkerFunction, '*/1 * * * *', {
      disableLogging: true,
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

    expect(consoleMessages).eql([]);
    expect(consoleErrors).eql([]);
  });

  it('throws error', async function () {
    let mockDate = `2010-01-01T00:00:00.000Z`;
    const jobGetNowMock = jest.spyOn(Job.prototype as any, 'getNow');
    jobGetNowMock.mockImplementation(() => {
      return new Date(mockDate);
    });

    const consoleMessages: string[] = [];
    const consoleLogMock = jest.spyOn(console, 'log');
    consoleLogMock.mockImplementation(msg => {
      consoleMessages.push(msg);
    });

    const consoleErrors: string[] = [];
    const consoleErrMock = jest.spyOn(console, 'error');
    consoleErrMock.mockImplementation(msg => {
      consoleErrors.push(msg);
    });

    const endTime = new Date(`2010-01-01T00:04:00.000Z`);

    const jobWorkerFunction: JobWorkerFunction = async (triggerTime: Date, log: LoggerFunction) => {
      log('info', `Hello this is a test ${triggerTime}`);
    };

    let afterSettingTimeoutCallbackCount = 0;

    const job = new Job('testjob123', jobWorkerFunction, '*/1 * * * *', {
      endDate: endTime,
      startDate: new Date(mockDate),
      continueOnError: false,
      afterSettingTimeoutCallback: () => {
        jest.advanceTimersByTime(60000);
        throw new Error('This is a simulated error after running jobWorkerFunction');
      },
      beforeExecutingWorkerCallback: () => {
        afterSettingTimeoutCallbackCount += 1;
        mockDate = `2010-01-01T00:0${afterSettingTimeoutCallbackCount}:00.000Z`;
      },
    });

    let caughtError: string | null = null;
    try {
      await job.getPromise();
    } catch (err) {
      caughtError = err as string;
    }

    expect(caughtError).eql(
      'Job [testjob123]: Error running job at iteration Thu Dec 31 2009 19:01:00 GMT-0500 (Eastern Standard Time): Error: This is a simulated error after running jobWorkerFunction',
    );

    expect(consoleMessages).eql([
      'Job [testjob123]: Scheduled to execute: At every minute',
      'Job [testjob123]: Scheduling to trigger in the next 60000 ms, at (Thu Dec 31 2009 19:01:00 GMT-0500 (Eastern Standard Time)) the time is now Thu Dec 31 2009 19:00:00 GMT-0500 (Eastern Standard Time).',
      'Job [testjob123]: Hello this is a test Thu Dec 31 2009 19:01:00 GMT-0500 (Eastern Standard Time)',
    ]);

    expect(consoleErrors).eql([]);
  });
});

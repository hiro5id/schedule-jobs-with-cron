import { CronJob } from '../src/cron-job';
import { expect } from 'chai';
import { LoggerFunction } from '../src/logger-function.type';
import { JobWorkerFunction } from '../src/job-worker-function.type';

describe('chron scheduler', function () {
  beforeAll(() => {
    jest.useFakeTimers();
  });
  afterAll(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('schedules sync job', async function () {
    let mockDate = `2010-01-01T00:00:00.000Z`;
    const jobGetNowMock = jest.spyOn(CronJob.prototype as any, 'getNow');
    jobGetNowMock.mockImplementation(() => {
      return new Date(mockDate);
    });

    const endTime = new Date(`2010-01-01T00:04:00.000Z`);

    let triggerOneReached = false;
    let triggerTwoReached = false;

    const jobWorkerFunction: JobWorkerFunction = (triggerTime: Date, log: LoggerFunction) => {
      log('info', `Hello this is a test ${triggerTime}`);
      if (!triggerOneReached) {
        triggerOneReached = true;
      }
      if (!triggerTwoReached) {
        triggerTwoReached = true;
      }
    };

    let afterSettingTimeoutCallbackCount = 0;

    const job = new CronJob('testjob123', jobWorkerFunction, '*/1 * * * *', {
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

    expect(job.englishDescriptionOfCronSchedule).eql('At every minute');

    try {
      await job.getPromise();
    } catch (err) {
      throw err;
    }

    expect(triggerOneReached).to.be.true;
    expect(triggerTwoReached).to.be.true;
  });

  it('schedules a-sync job', async function () {
    let mockDate = `2010-01-01T00:00:00.000Z`;
    const jobGetNowMock = jest.spyOn(CronJob.prototype as any, 'getNow');
    jobGetNowMock.mockImplementation(() => {
      return new Date(mockDate);
    });

    const endTime = new Date(`2010-01-01T00:04:00.000Z`);

    let triggerOneReached = false;
    let triggerTwoReached = false;

    const jobWorkerFunction: JobWorkerFunction = async (triggerTime: Date, log: LoggerFunction) => {
      return new Promise(resolve => {
        log('info', `Hello this is a test ${triggerTime}`);
        if (!triggerOneReached) {
          triggerOneReached = true;
        }
        if (!triggerTwoReached) {
          triggerTwoReached = true;
        }
        resolve();
      });
    };

    let afterSettingTimeoutCallbackCount = 0;

    const job = new CronJob('testjob123', jobWorkerFunction, '*/1 * * * *', {
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

  it('logs messages for a-sync job', async function () {
    let mockDate = `2010-01-01T00:00:00.000Z`;
    const jobGetNowMock = jest.spyOn(CronJob.prototype as any, 'getNow');
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
      return new Promise(resolve => {
        log('info', `Hello this is a test ${triggerTime}`);
        resolve();
      });
    };

    let afterSettingTimeoutCallbackCount = 0;

    const job = new CronJob('testjob123', jobWorkerFunction, '*/1 * * * *', {
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
      'Job [testjob123]: Scheduled trigger finished!',
      'Job [testjob123]: Scheduling to trigger in the next 60000 ms, at (Thu Dec 31 2009 19:02:00 GMT-0500 (Eastern Standard Time)) the time is now Thu Dec 31 2009 19:01:00 GMT-0500 (Eastern Standard Time).',
      'Job [testjob123]: Hello this is a test Thu Dec 31 2009 19:02:00 GMT-0500 (Eastern Standard Time)',
      'Job [testjob123]: Scheduled trigger finished!',
      'Job [testjob123]: Scheduling to trigger in the next 60000 ms, at (Thu Dec 31 2009 19:03:00 GMT-0500 (Eastern Standard Time)) the time is now Thu Dec 31 2009 19:02:00 GMT-0500 (Eastern Standard Time).',
      'Job [testjob123]: Hello this is a test Thu Dec 31 2009 19:03:00 GMT-0500 (Eastern Standard Time)',
      'Job [testjob123]: Scheduled trigger finished!',
      'Job [testjob123]: End date reached, resolving job promise...',
    ]);
    expect(consoleErrors).eql([]);
  });

  it('logs messages for sync job', async function () {
    let mockDate = `2010-01-01T00:00:00.000Z`;
    const jobGetNowMock = jest.spyOn(CronJob.prototype as any, 'getNow');
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

    const jobWorkerFunction: JobWorkerFunction = (triggerTime: Date, log: LoggerFunction) => {
      log('info', `Hello this is a test ${triggerTime}`);
    };

    let afterSettingTimeoutCallbackCount = 0;

    const job = new CronJob('testjob123', jobWorkerFunction, '*/1 * * * *', {
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
      'Job [testjob123]: Scheduled trigger finished!',
      'Job [testjob123]: Scheduling to trigger in the next 60000 ms, at (Thu Dec 31 2009 19:02:00 GMT-0500 (Eastern Standard Time)) the time is now Thu Dec 31 2009 19:01:00 GMT-0500 (Eastern Standard Time).',
      'Job [testjob123]: Hello this is a test Thu Dec 31 2009 19:02:00 GMT-0500 (Eastern Standard Time)',
      'Job [testjob123]: Scheduled trigger finished!',
      'Job [testjob123]: Scheduling to trigger in the next 60000 ms, at (Thu Dec 31 2009 19:03:00 GMT-0500 (Eastern Standard Time)) the time is now Thu Dec 31 2009 19:02:00 GMT-0500 (Eastern Standard Time).',
      'Job [testjob123]: Hello this is a test Thu Dec 31 2009 19:03:00 GMT-0500 (Eastern Standard Time)',
      'Job [testjob123]: Scheduled trigger finished!',
      'Job [testjob123]: End date reached, resolving job promise...',
    ]);
    expect(consoleErrors).eql([]);
  });

  it('disables messages when set to false', async function () {
    let mockDate = `2010-01-01T00:00:00.000Z`;
    const jobGetNowMock = jest.spyOn(CronJob.prototype as any, 'getNow');
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

    const job = new CronJob('testjob123', jobWorkerFunction, '*/1 * * * *', {
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

  it('throws error before worker function', async function () {
    let mockDate = `2010-01-01T00:00:00.000Z`;
    const jobGetNowMock = jest.spyOn(CronJob.prototype as any, 'getNow');
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

    const job = new CronJob('testjob123', jobWorkerFunction, '*/1 * * * *', {
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
      'Job [testjob123]: Scheduled did not finish!',
    ]);

    expect(consoleErrors).eql([]);
  });

  it('throws error inside sync worker', async function () {
    let mockDate = `2010-01-01T00:00:00.000Z`;
    const jobGetNowMock = jest.spyOn(CronJob.prototype as any, 'getNow');
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

    const jobWorkerFunction: JobWorkerFunction = (_triggerTime: Date, _log: LoggerFunction) => {
      throw new Error(`This is an error inside async worker function`);
    };

    let afterSettingTimeoutCallbackCount = 0;

    const job = new CronJob('testjob123', jobWorkerFunction, '*/1 * * * *', {
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

    let caughtError: string | null = null;
    try {
      await job.getPromise();
    } catch (err) {
      caughtError = err as string;
    }

    expect(caughtError).eql(
      'Job [testjob123]: Error running job at iteration Thu Dec 31 2009 19:01:00 GMT-0500 (Eastern Standard Time): Job [testjob123]: Error: This is an error inside async worker function',
    );

    expect(consoleMessages).eql([
      'Job [testjob123]: Scheduled to execute: At every minute',
      'Job [testjob123]: Scheduling to trigger in the next 60000 ms, at (Thu Dec 31 2009 19:01:00 GMT-0500 (Eastern Standard Time)) the time is now Thu Dec 31 2009 19:00:00 GMT-0500 (Eastern Standard Time).',
      'Job [testjob123]: Scheduled did not finish!',
    ]);

    expect(consoleErrors).eql(['Job [testjob123]: Failed to execute, following error was received: Error: This is an error inside async worker function']);
  });

  it('throws error inside a-sync worker', async function () {
    let mockDate = `2010-01-01T00:00:00.000Z`;
    const jobGetNowMock = jest.spyOn(CronJob.prototype as any, 'getNow');
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

    const jobWorkerFunction: JobWorkerFunction = async (_triggerTime: Date, _log: LoggerFunction) => {
      return new Promise(() => {
        throw new Error(`This is an error inside async worker function`);
      });
    };

    let afterSettingTimeoutCallbackCount = 0;

    const job = new CronJob('testjob123', jobWorkerFunction, '*/1 * * * *', {
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

    let caughtError: string | null = null;
    try {
      await job.getPromise();
    } catch (err) {
      caughtError = err as string;
    }

    expect(caughtError).eql(
      'Job [testjob123]: Error running job at iteration Thu Dec 31 2009 19:01:00 GMT-0500 (Eastern Standard Time): Job [testjob123]: Error: This is an error inside async worker function',
    );

    expect(consoleMessages).eql([
      'Job [testjob123]: Scheduled to execute: At every minute',
      'Job [testjob123]: Scheduling to trigger in the next 60000 ms, at (Thu Dec 31 2009 19:01:00 GMT-0500 (Eastern Standard Time)) the time is now Thu Dec 31 2009 19:00:00 GMT-0500 (Eastern Standard Time).',
      'Job [testjob123]: Scheduled did not finish!',
    ]);

    expect(consoleErrors).eql(['Job [testjob123]: Failed to execute, following error was received: Error: This is an error inside async worker function']);
  });

  it('rejects inside a-sync worker', async function () {
    let mockDate = `2010-01-01T00:00:00.000Z`;
    const jobGetNowMock = jest.spyOn(CronJob.prototype as any, 'getNow');
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

    const jobWorkerFunction: JobWorkerFunction = async (_triggerTime: Date, _log: LoggerFunction) => {
      return new Promise((_resolve, reject) => {
        reject('we are rejecting from inside jobWorkerFunction');
      });
    };

    let afterSettingTimeoutCallbackCount = 0;

    const job = new CronJob('testjob123', jobWorkerFunction, '*/1 * * * *', {
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

    let caughtError: string | null = null;
    try {
      await job.getPromise();
    } catch (err) {
      caughtError = err as string;
    }

    expect(caughtError).eql(
      'Job [testjob123]: Error running job at iteration Thu Dec 31 2009 19:01:00 GMT-0500 (Eastern Standard Time): Job [testjob123]: we are rejecting from inside jobWorkerFunction',
    );

    expect(consoleMessages).eql([
      'Job [testjob123]: Scheduled to execute: At every minute',
      'Job [testjob123]: Scheduling to trigger in the next 60000 ms, at (Thu Dec 31 2009 19:01:00 GMT-0500 (Eastern Standard Time)) the time is now Thu Dec 31 2009 19:00:00 GMT-0500 (Eastern Standard Time).',
      'Job [testjob123]: Scheduled did not finish!',
    ]);

    expect(consoleErrors).eql(['Job [testjob123]: Failed to execute, following error was received: we are rejecting from inside jobWorkerFunction']);
  });

  it('continues a-sync job on error if specified', async function () {
    let mockDate = `2010-01-01T00:00:00.000Z`;
    const jobGetNowMock = jest.spyOn(CronJob.prototype as any, 'getNow');
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

    let triggerOneReached = false;
    let triggerTwoReached = false;

    const jobWorkerFunction: JobWorkerFunction = async (triggerTime: Date, log: LoggerFunction) => {
      return new Promise((resolve, reject) => {
        log('info', `Hello this is a test ${triggerTime}`);
        if (!triggerOneReached) {
          triggerOneReached = true;
          reject('error from first trigger');
        }
        if (!triggerTwoReached) {
          triggerTwoReached = true;
        }
        resolve();
      });
    };

    let afterSettingTimeoutCallbackCount = 0;

    const job = new CronJob('testjob123', jobWorkerFunction, '*/1 * * * *', {
      endDate: endTime,
      startDate: new Date(mockDate),
      continueOnError: true,
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
    expect(consoleMessages).eql([
      'Job [testjob123]: Scheduled to execute: At every minute',
      'Job [testjob123]: Scheduling to trigger in the next 60000 ms, at (Thu Dec 31 2009 19:01:00 GMT-0500 (Eastern Standard Time)) the time is now Thu Dec 31 2009 19:00:00 GMT-0500 (Eastern Standard Time).',
      'Job [testjob123]: Hello this is a test Thu Dec 31 2009 19:01:00 GMT-0500 (Eastern Standard Time)',
      'Job [testjob123]: Scheduled did not finish!',
      'Job [testjob123]: Scheduling to trigger in the next 60000 ms, at (Thu Dec 31 2009 19:02:00 GMT-0500 (Eastern Standard Time)) the time is now Thu Dec 31 2009 19:01:00 GMT-0500 (Eastern Standard Time).',
      'Job [testjob123]: Hello this is a test Thu Dec 31 2009 19:02:00 GMT-0500 (Eastern Standard Time)',
      'Job [testjob123]: Scheduled trigger finished!',
      'Job [testjob123]: Scheduling to trigger in the next 60000 ms, at (Thu Dec 31 2009 19:03:00 GMT-0500 (Eastern Standard Time)) the time is now Thu Dec 31 2009 19:02:00 GMT-0500 (Eastern Standard Time).',
      'Job [testjob123]: Hello this is a test Thu Dec 31 2009 19:03:00 GMT-0500 (Eastern Standard Time)',
      'Job [testjob123]: Scheduled trigger finished!',
      'Job [testjob123]: End date reached, resolving job promise...',
    ]);
    expect(consoleErrors).eql(['Job [testjob123]: Failed to execute, following error was received: error from first trigger']);
  });

  it('throws when start date is in the past', () => {
    let mockDate = `2010-01-01T00:04:00.000Z`;
    const jobGetNowMock = jest.spyOn(CronJob.prototype as any, 'getNow');
    jobGetNowMock.mockImplementation(() => {
      return new Date(mockDate);
    });

    const endTime = new Date(`2010-01-01T00:00:00.000Z`);

    let caughtError: Error | null = null;
    try {
      new CronJob('a badly declared job', () => {}, '*/1 * * * *', { startDate: new Date(mockDate), endDate: endTime });
    } catch (err) {
      caughtError = err as Error;
    }

    expect(caughtError?.message).eql('Job [a badly declared job]: End date cannot be in the past');
  });

  it('throws when start date is in the past', () => {
    let mockDate = `2010-01-01T00:04:00.000Z`;
    const jobGetNowMock = jest.spyOn(CronJob.prototype as any, 'getNow');
    jobGetNowMock.mockImplementation(() => {
      return new Date(mockDate);
    });

    const startDate = new Date(`2010-01-01T00:00:00.000Z`);

    let caughtError: Error | null = null;
    try {
      new CronJob('a badly declared job', () => {}, '*/1 * * * *', { startDate: new Date(startDate) });
    } catch (err) {
      caughtError = err as Error;
    }

    expect(caughtError?.message).eql('Job [a badly declared job]: Start date cannot be in the past');
  });

  it('throws when start date is in the past', () => {
    let mockDate = `2010-01-01T00:00:00.000Z`;
    const jobGetNowMock = jest.spyOn(CronJob.prototype as any, 'getNow');
    jobGetNowMock.mockImplementation(() => {
      return new Date(mockDate);
    });

    const startDate = new Date(`2010-01-01T00:05:00.000Z`);
    const endTime = new Date(`2010-01-01T00:00:00.000Z`);

    let caughtError: Error | null = null;
    try {
      new CronJob('a badly declared job', () => {}, '*/1 * * * *', { startDate: new Date(startDate), endDate: endTime });
    } catch (err) {
      caughtError = err as Error;
    }

    expect(caughtError?.message).eql('Job [a badly declared job]: End date cannot be before start date');
  });
});

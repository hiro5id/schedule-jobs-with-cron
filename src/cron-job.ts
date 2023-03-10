import { CronScheduleGenerator } from './cron-parser/cron-schedule-generator';
import { IJobOptions } from './job-options.interface';
import { JobWorkerFunction } from './job-worker-function.type';

export function StripMilli(input: Date): Date {
  return new Date(input.getFullYear(), input.getMonth(), input.getDate(), input.getHours(), input.getMinutes(), input.getSeconds(), 0);
}
export class CronJob {
  /**
   *
   * @param jobName - Give the job a unique name that can be identified
   * @param jobWorkerFunction - Function that does the actual work any time the job is triggered
   * @param cronSchedule - A cron spec schedule.  Please see https://crontab.guru for assistance in creating a crontab schedule
   * @param jobOptions - Optional arguments to customize the behaviour
   */
  constructor(public readonly jobName: string, private readonly jobWorkerFunction: JobWorkerFunction, cronSchedule: string, jobOptions: IJobOptions = <any>{}) {
    this._jobOptions = { ...this._defaultOptions, ...jobOptions };

    const now = this.getNow();
    if (StripMilli(this._jobOptions.startDate!).getTime() - StripMilli(now).getTime() < 0) {
      this.throwError(`Start date cannot be in the past: ${this._jobOptions.startDate!.toISOString()} now is: ${now.toISOString()}`);
    }
    if (this._jobOptions.endDate && StripMilli(this._jobOptions.endDate).getTime() - StripMilli(now).getTime() < 0) {
      this.throwError(`End date cannot be in the past: ${this._jobOptions.endDate.toISOString()} now is: ${now.toISOString()}`);
    }
    if (this._jobOptions.endDate && this._jobOptions.startDate && StripMilli(this._jobOptions.endDate).getTime() - StripMilli(this._jobOptions.startDate).getTime() <= 0) {
      this.throwError(`End date cannot be before start date, start: ${this._jobOptions.startDate.toISOString()} end: ${this._jobOptions.endDate.toISOString()}`);
    }

    let execIterations = '';
    if (this._jobOptions.numberOfScheduledIterationsToExecute) {
      execIterations = ` for ${this._jobOptions.numberOfScheduledIterationsToExecute} iterations.`;
    }
    this._scheduleGenerator = new CronScheduleGenerator(cronSchedule, this._jobOptions.startDate!);
    this.log('info', `Scheduled to execute: ${this._scheduleGenerator.englishDescriptionOfSchedule}${execIterations}`);

    this._jobRunnerPromise = new Promise((resolve, reject) => {
      this._resolveJobRunner = resolve;
      this._rejectJobRunner = reject;
    });

    this.scheduleForNextIteration();
  }

  public numberOfExecutedIterations: number = 0;

  /**
   * returns the english interpretation of the cron schedule used to create this job
   */
  public get englishDescriptionOfCronSchedule() {
    return this._scheduleGenerator.englishDescriptionOfSchedule;
  }

  private get formattedJobName() {
    return `Job [${this.jobName}]: `;
  }
  private throwError(message: string) {
    throw new Error(`${this.formattedJobName}${message}`);
  }
  private log(type: 'err' | 'info', message: string) {
    if (this._jobOptions.disableLogging) return;
    if (type == 'info') {
      console.log(`${this.formattedJobName}${message}`);
    } else {
      console.error(`${this.formattedJobName}${message}`);
    }
  }

  /**
   * default options
   * @private
   */
  private _defaultOptions: IJobOptions = {
    numberOfScheduledIterationsToExecute: 0,
    endDate: null,
    continueOnError: false,
    startDate: this.getNow(),
    afterSettingTimeoutCallback: null,
    beforeExecutingWorkerCallback: null,
    disableLogging: false,
  };

  private readonly _jobOptions: IJobOptions;
  private readonly _jobRunnerPromise!: Promise<void>;
  private _resolveJobRunner!: (value: PromiseLike<void> | void) => void;
  private _rejectJobRunner!: (reason?: any) => void;

  private _jobIterationPromise!: Promise<void>;
  private readonly _scheduleGenerator!: CronScheduleGenerator;

  /**
   * returns a promise that will get resolved if the schedule has an end date.
   * But if there is no end date, the promise will never get resolved
   * awaiting on this promise is a good way to keep the schedule running
   *
   * If errors occur then the promise will be resolved, unless continueOnError=true is set on the job options
   */
  public getPromise(): Promise<void> {
    return this._jobRunnerPromise;
  }

  /**
   * Responsible for getting the current date/time
   * @private
   */
  private getNow(): Date {
    return new Date();
  }

  /**
   * recursive call that keeps scheduling for the next iteration according to schedule
   * @private
   */
  private scheduleForNextIteration() {
    // check iteration count
    if (this._jobOptions.numberOfScheduledIterationsToExecute && this.numberOfExecutedIterations >= this._jobOptions.numberOfScheduledIterationsToExecute) {
      this.log('info', `Number of scheduled iterations to execute reached ${this._jobOptions.numberOfScheduledIterationsToExecute}, resolving job promis....`);
      this._resolveJobRunner();
      return;
    }

    // check end date
    const now = this.getNow();
    const nextTrigger = this._scheduleGenerator.getNextScheduledDate(now);
    if (this._jobOptions.endDate && nextTrigger >= this._jobOptions.endDate) {
      this.log('info', `End date reached, resolving job promise...`);
      this._resolveJobRunner();
      return;
    }

    const milisecondsToNextTrigger = nextTrigger.getTime() - now.getTime();

    this.log('info', `Scheduling to trigger in the next ${milisecondsToNextTrigger} ms, at ${nextTrigger.toISOString()} the time is now ${now.toISOString()}.`);
    this._jobIterationPromise = new Promise<void>((resolveJobIteration, rejectJobIteration) => {
      setTimeout(() => {
        if (this._jobOptions.beforeExecutingWorkerCallback) {
          this._jobOptions.beforeExecutingWorkerCallback();
        }
        const now = this.getNow();
        try {
          this.numberOfExecutedIterations += 1;
          this.log('info', `Executing iteration #${this.numberOfExecutedIterations}`);
          // bind the "this" context because it gets lost
          const logger = this.log.bind(this);
          const actionResult = this.jobWorkerFunction(now, logger);

          if (
            (actionResult != undefined && this.jobWorkerFunction.constructor.name === 'AsyncFunction') ||
            (typeof this.jobWorkerFunction === 'function' && this.isPromise(actionResult))
          ) {
            // function returns promise
            (actionResult as Promise<void>)
              .then(() => {
                resolveJobIteration();
              })
              .catch(err => {
                this.log('err', `Failed to execute, following error was received: ${err}`);
                rejectJobIteration(`${this.formattedJobName}${err}`);
              });
          } else {
            resolveJobIteration();
          }
        } catch (err) {
          this.log('err', `Failed to execute, following error was received: ${err}`);
          rejectJobIteration(`${this.formattedJobName}${err}`);
        }
      }, milisecondsToNextTrigger);

      if (this._jobOptions.afterSettingTimeoutCallback) {
        this._jobOptions.afterSettingTimeoutCallback();
      }
    });

    this._jobIterationPromise
      .then(() => {
        this.log('info', `Scheduled trigger finished!`);
        this.scheduleForNextIteration();
      })
      .catch(err => {
        this.log('info', `Scheduled did not finish!`);
        const errMessage = `${this.formattedJobName}Error running job at iteration ${nextTrigger.toISOString()}: ${err}`;

        if (this._jobOptions.continueOnError) {
          this.scheduleForNextIteration();
          return;
        } else {
          this._rejectJobRunner(errMessage);
          return;
        }
      });
  }

  /**
   * checks if passed in object is a promise or not
   * @param objectToTest - pass in an object to check if it is a promise
   * @private
   */
  private isPromise(objectToTest: any): boolean {
    return typeof objectToTest === 'object' && typeof objectToTest.then === 'function';
  }
}

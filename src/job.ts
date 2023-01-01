import { CronScheduleGenerator } from './cron-schedule-generator';

export interface IJobOptions {
  continueOnError?: boolean;
  endDate?: Date | null;
  startDate?: Date | null;
}

export class Job {
  constructor(private readonly action: (triggerTime: Date) => Promise<void>, cronSchedule: string, jobOptions: IJobOptions = <any>{}) {
    const defaultOptions: IJobOptions = {
      endDate: null,
      continueOnError: false,
      startDate: this.getNow(),
    };

    this._jobOptions = { ...defaultOptions, ...jobOptions };

    const now = this.getNow();
    if (this._jobOptions.startDate!.getTime() - now.getTime() < 0) {
      throw new Error('Start date cannot be in the past');
    }
    if (this._jobOptions.endDate && this._jobOptions.endDate.getTime() - now.getTime() < 0) {
      throw new Error('End date cannot be in the past');
    }
    if (this._jobOptions.endDate && this._jobOptions.startDate && this._jobOptions.endDate.getTime() - this._jobOptions.startDate.getTime() <= 0) {
      throw new Error('Start date must be greater than End Date');
    }

    this._scheduleGenerator = new CronScheduleGenerator(cronSchedule, this._jobOptions.startDate!);
    console.log(`job scheduled ${this._scheduleGenerator.englishDescriptionOfSchedule}`);

    this._jobRunnerPromise = new Promise((resolve, reject) => {
      this._resolveJobRunner = resolve;
      this._rejectJobRunner = reject;
    });

    this.scheduleForNextIteration();
  }

  private readonly _jobOptions: IJobOptions;
  private readonly _jobRunnerPromise: Promise<void>;
  private _resolveJobRunner!: (value: PromiseLike<void> | void) => void;
  private _rejectJobRunner!: (reason?: any) => void;

  private _jobPromsie!: Promise<void>;
  private readonly _scheduleGenerator: CronScheduleGenerator;

  public getPromise(): Promise<void> {
    return this._jobRunnerPromise;
  }

  private getNow(): Date {
    return new Date();
  }

  private scheduleForNextIteration() {
    const nextTrigger = this._scheduleGenerator.getNextScheduledDate();
    if (this._jobOptions.endDate && nextTrigger >= this._jobOptions.endDate) {
      this._resolveJobRunner();
      return;
    }
    const now = this.getNow();
    const milisecondsToNextTrigger = nextTrigger.getTime() - now.getTime();

    console.log(`Scheduling for the next ${milisecondsToNextTrigger} (${nextTrigger}) from now ${now}`);
    this._jobPromsie = new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        const now = this.getNow();
        try {
          const actionResult = this.action(now);

          if (this.action.constructor.name === 'AsyncFunction' || (typeof this.action === 'function' && this.isPromise(actionResult))) {
            // function returns promise
            actionResult.then(() => resolve()).catch(err => reject(err));
          } else {
            resolve();
          }
        } catch (err) {
          reject(err);
        }
      }, milisecondsToNextTrigger);
    });

    this._jobPromsie
      .then(() => {
        console.log(`job finished calling re-scheduler`);
        this.scheduleForNextIteration();
      })
      .catch(err => {
        const errMessage = `Error running job at iteration ${nextTrigger}: ${err}`;
        if (this._jobOptions.continueOnError) {
          console.error(errMessage);
          return;
        } else {
          this._rejectJobRunner(errMessage);
          return;
        }
      });
  }

  private isPromise(p: any) {
    return typeof p === 'object' && typeof p.then === 'function';
  }
}

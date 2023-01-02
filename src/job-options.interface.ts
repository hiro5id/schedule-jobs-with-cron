export interface IJobOptions {
  /**
   * Optional specify wether to continue the job schedule if an error occurs.  The default for this is false.
   */
  continueOnError?: boolean;
  /**
   * Optional date/time to specify when the job should stop executing.  When the job ends, the Promise returned by job.getPromise() will be resolved
   */
  endDate?: Date | null;
  /**
   * Optional date/time to specify when the job should begin executing according to the schedule
   */
  startDate?: Date | null;
  /**
   * Optional callback called after internally setting up timeout for the next iteration of when the job is expected to trigger again.
   * This is typically useful for creating mocked unit tests, not normally needed for normal operation, but can be used for complex use cases
   */
  afterSettingTimeoutCallback?: (() => void) | null;
  /**
   * Optional callback called just before triggering the jobWorkerFunction
   * This is typically useful for creating mocked unit tests, not normally needed for normal operation, but can be used for complex use cases
   */
  beforeExecutingWorkerCallback?: (() => void) | null;
}
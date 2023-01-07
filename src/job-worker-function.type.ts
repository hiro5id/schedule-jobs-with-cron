import { LoggerFunction } from './logger-function.type';

/**
 * Supply a worker function for the job.
 * Optionally the date and log references are passed in to the function in case the trigger time needs to be known or
 * logs need to be generated from within the function.  The job's logger function will be used in this case so that
 * the job name is automatically attached to the message.
 */
export type JobWorkerFunction = (triggerTime: Date, log: LoggerFunction) => Promise<void> | void;

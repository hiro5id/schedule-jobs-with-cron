/**
 * A logger function used throughout the job to keep things consistent
 */
export type LoggerFunction = (type: 'err' | 'info', message: string) => void;

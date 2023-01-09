// This is an example to demonstrate it in runkit

const { CronJob } = require('schedule-jobs-with-cron');

// Define and schedule a new job
const job1 = new CronJob(
  'A test Job 1',
  (triggerTime, log) => {
    log('info', `Hello from inside the job, it was triggered at: ${triggerTime}`);
    // Add code that does some work here
  },
  '*/2 * * * *',
);

// Await for the job
await job1.getPromise();

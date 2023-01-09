/*
 * This is a how to use live example
 */
// Import the library
const { CronJob } = require('schedule-jobs-with-cron');

// Let's define an end date in one minute, we don't want this demo to run forever
const now = new Date();
const endInMinutes = 1;
const endDate = new Date(now.getTime() + endInMinutes * 60000);

// Define and schedule a new job
const job1 = new CronJob(
  'A test Job 1',
  (triggerTime, log) => {
    log('info', `Hello from inside the job, it was triggered at: ${triggerTime}`);
    /***
      Add code that does some work here
    ***/
  },
  // A cron schedule that runs every minute
  '* * * * *',
  {
    endDate: endDate,
  },
);

// Await for the job
await job1.getPromise();
console.log('done');

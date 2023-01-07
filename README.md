# schedule-jobs-with-cron

<img title="" src="README-assets/c9aff62393369ca4e241934df63ffef0ff9cd342.png" alt="" data-align="center">

Schedule jobs in NodeJs using cron specifications

## Why?

- Support async worker function and compatible with non-async too
- Works with standard crontab definitions
- Cron parser shows the schedule in plain english
- Typescript support
- No dependencies
- Small (~45 KB when installed from npm)
- Configurable
- Other good cron packages haven't been updated in a while

## How to use:

```typescript
import { CronJob } from 'schedule-jobs-with-cron';

// Define and schedule a new job
const job1 = new CronJob(
  'A test Job 1',
  (triggerTime, log) => {
    log('info', `Hello from inside the job, it was triggered at: ${triggerTime}`);
  },
  '*/2 * * * *',
);

// Await for the job
await job1.getPromise();
```

### Explanation:

The above creates a new cron job, passing in a name (it can be anything),
the worker function that will be triggered, and the cron schedule to use,
in this case it's `*/2 * * * *` which will run every 2 minutes.  
(The website https://crontab.guru is helpful to define cron schedules.)

As long as the job promise is awaited the job will continue to run and be rescheduled forever,
unless an endDate is provided through the optional parameters (more on that below).

The console output of the above will look like the follwing example:

```text
Job [A test Job 1]: Scheduled to execute: At every 2nd minute
Job [A test Job 1]: Scheduling to trigger in the next 81699 ms, at (Sat Jan 07 2023 04:24:00 GMT-0500 (Eastern Standard Time)) the time is now Sat Jan 07 2023 04:22:38 GMT-0500 (Eastern Standard Time).
Job [A test Job 1]: Hello from inside the job, it was triggered at: Sat Jan 07 2023 04:24:00 GMT-0500 (Eastern Standard Time)
Job [A test Job 1]: Scheduled trigger finished!
Job [A test Job 1]: Scheduling to trigger in the next 119997 ms, at (Sat Jan 07 2023 04:26:00 GMT-0500 (Eastern Standard Time)) the time is now Sat Jan 07 2023 04:24:00 GMT-0500 (Eastern Standard Time).
```
